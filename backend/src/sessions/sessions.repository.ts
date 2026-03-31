import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service.js';
import type { Session, Contact, Message, SessionStatus } from '@prisma/client';

export interface SessionWithContact extends Session {
  readonly contact: Contact;
}

export interface SessionWithRelations extends Session {
  readonly contact: Contact;
  readonly messages: readonly Message[];
}

@Injectable()
export class SessionsRepository {
  constructor(private readonly prisma: PrismaService) {}

  async findById(id: string): Promise<SessionWithContact | null> {
    return this.prisma.session.findUnique({
      where: { id },
      include: { contact: true },
    }) as Promise<SessionWithContact | null>;
  }

  async findAll(status?: SessionStatus): Promise<SessionWithRelations[]> {
    const where = status ? { status } : undefined;

    return this.prisma.session.findMany({
      where,
      include: {
        contact: true,
        messages: {
          orderBy: { createdAt: 'desc' },
          take: 1,
        },
      },
      orderBy: { updatedAt: 'desc' },
    }) as Promise<SessionWithRelations[]>;
  }

  async findActiveByContactId(contactId: string): Promise<SessionWithContact | null> {
    return this.prisma.session.findFirst({
      where: {
        contactId,
        status: { not: 'CLOSED' },
      },
      include: { contact: true },
      orderBy: { updatedAt: 'desc' },
    }) as Promise<SessionWithContact | null>;
  }

  async create(contactId: string): Promise<SessionWithContact> {
    return this.prisma.session.create({
      data: { contactId, status: 'BOT' },
      include: { contact: true },
    }) as Promise<SessionWithContact>;
  }

  async updateStatus(
    id: string,
    status: SessionStatus,
    userId?: string | null,
  ): Promise<SessionWithContact> {
    return this.prisma.session.update({
      where: { id },
      data: {
        status,
        userId: userId !== undefined ? userId : undefined,
      },
      include: { contact: true },
    }) as Promise<SessionWithContact>;
  }

  async updateBotState(id: string, botState: string | null): Promise<SessionWithContact> {
    return this.prisma.session.update({
      where: { id },
      data: { bot_state: botState },
      include: { contact: true },
    }) as Promise<SessionWithContact>;
  }
}
