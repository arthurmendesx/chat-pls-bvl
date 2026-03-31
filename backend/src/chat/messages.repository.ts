import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service.js';
import type { Message, SenderType } from '@prisma/client';

interface CreateMessageData {
  readonly content: string;
  readonly senderType: SenderType;
  readonly sessionId: string;
  readonly externalId?: string;
  readonly userId?: string;
}

@Injectable()
export class MessagesRepository {
  constructor(private readonly prisma: PrismaService) {}

  async findBySessionId(sessionId: string): Promise<Message[]> {
    return this.prisma.message.findMany({
      where: { sessionId },
      orderBy: { createdAt: 'asc' },
    });
  }

  async create(data: CreateMessageData): Promise<Message> {
    return this.prisma.message.create({ data });
  }
}
