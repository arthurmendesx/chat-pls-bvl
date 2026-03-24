import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service.js';
import { WhatsAppService } from '../whatsapp/whatsapp.service.js';
import type {
  SessionStatus,
  SenderType,
  Session,
  Contact,
  Message,
} from '@prisma/client';

export interface SessionWithContact extends Session {
  readonly contact: Contact;
}

export interface MessageHistoryResponse {
  readonly session: SessionWithContact;
  readonly messages: readonly Message[];
}

const VALID_STATUS_TRANSITIONS: Record<string, readonly string[]> = {
  BOT: ['WAITING', 'ACTIVE', 'CLOSED'],
  WAITING: ['ACTIVE', 'CLOSED'],
  ACTIVE: ['BOT', 'CLOSED'],
};

@Injectable()
export class ChatService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly whatsAppService: WhatsAppService,
  ) {}

  async getMessages(sessionId: string): Promise<MessageHistoryResponse> {
    const session = await this.prisma.session.findUnique({
      where: { id: sessionId },
      include: { contact: true },
    });

    if (!session) {
      throw new NotFoundException(
        `Sessão com ID "${sessionId}" não encontrada.`,
      );
    }

    const messages = await this.prisma.message.findMany({
      where: { sessionId },
      orderBy: { createdAt: 'asc' },
    });

    return {
      session: session as SessionWithContact,
      messages,
    };
  }

  async updateStatus(
    sessionId: string,
    newStatus: string,
  ): Promise<SessionWithContact> {
    const session = await this.prisma.session.findUnique({
      where: { id: sessionId },
      include: { contact: true },
    });

    if (!session) {
      throw new NotFoundException(
        `Sessão com ID "${sessionId}" não encontrada.`,
      );
    }

    const allowedTransitions =
      VALID_STATUS_TRANSITIONS[session.status] ?? [];

    if (!allowedTransitions.includes(newStatus)) {
      throw new BadRequestException(
        `Não é possível alterar o status de "${session.status}" para "${newStatus}". ` +
          `Transições permitidas: ${allowedTransitions.join(', ') || 'nenhuma'}.`,
      );
    }

    return this.prisma.session.update({
      where: { id: sessionId },
      data: { status: newStatus as SessionStatus },
      include: { contact: true },
    }) as Promise<SessionWithContact>;
  }

  async sendMessage(
    sessionId: string,
    content: string,
  ): Promise<Message> {
    const session = await this.prisma.session.findUnique({
      where: { id: sessionId },
      include: { contact: true },
    });

    if (!session) {
      throw new NotFoundException(
        `Sessão com ID "${sessionId}" não encontrada.`,
      );
    }

    if (session.status !== 'ACTIVE') {
      throw new BadRequestException(
        'Só é possível enviar mensagens em sessões com status ACTIVE.',
      );
    }

    const contact = (session as SessionWithContact).contact;
    const externalId = await this.whatsAppService.sendTextMessage(
      contact.phone,
      content,
    );

    return this.prisma.message.create({
      data: {
        content,
        senderType: 'AGENT' as SenderType,
        externalId,
        sessionId,
      },
    });
  }
}
