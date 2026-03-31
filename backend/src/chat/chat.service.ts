import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { MessagesRepository } from './messages.repository.js';
import { SessionsService } from '../sessions/sessions.service.js';
import { WhatsAppService } from '../whatsapp/whatsapp.service.js';
import type { Message } from '@prisma/client';
import type { SessionWithContact } from '../sessions/sessions.repository.js';

export interface MessageHistoryResponse {
  readonly session: SessionWithContact;
  readonly messages: readonly Message[];
}

@Injectable()
export class ChatService {
  constructor(
    private readonly messagesRepository: MessagesRepository,
    private readonly sessionsService: SessionsService,
    private readonly whatsAppService: WhatsAppService,
  ) {}

  async getMessages(sessionId: string): Promise<MessageHistoryResponse> {
    const session = await this.sessionsService.findById(sessionId);
    const messages = await this.messagesRepository.findBySessionId(sessionId);

    return { session, messages };
  }

  async sendMessage(
    sessionId: string,
    content: string,
    userId: string,
  ): Promise<Message> {
    const session = await this.sessionsService.findById(sessionId);

    if (session.status !== 'ACTIVE') {
      throw new BadRequestException(
        'Só é possível enviar mensagens em sessões com status ACTIVE.',
      );
    }

    const externalId = await this.whatsAppService.sendTextMessage(
      session.contact.phone,
      content,
    );

    return this.messagesRepository.create({
      content,
      senderType: 'AGENT',
      externalId,
      sessionId,
      userId,
    });
  }
}
