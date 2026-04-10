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
      data: {
        contactId,
        status: 'BOT',
        bot_state: 'menu_inicial',
        last_interaction_at: new Date(),
      },
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

  /**
   * Updates last_interaction_at timestamp on a session.
   * Called every time a message is received for this session.
   */
  async updateLastInteraction(id: string): Promise<SessionWithContact> {
    return this.prisma.session.update({
      where: { id },
      data: { last_interaction_at: new Date() },
      include: { contact: true },
    }) as Promise<SessionWithContact>;
  }

  /**
   * Acquires a processing lock on a session.
   * Returns the session if lock was acquired, null if another execution is already processing.
   * This prevents race conditions when 2 messages arrive simultaneously.
   */
  async acquireProcessingLock(id: string): Promise<SessionWithContact | null> {
    // Use updateMany with a condition to atomically acquire the lock
    const result = await this.prisma.session.updateMany({
      where: { id, is_processing: false },
      data: { is_processing: true },
    });

    if (result.count === 0) {
      return null; // Lock not acquired — another execution is processing
    }

    return this.findById(id);
  }

  /**
   * Releases the processing lock on a session.
   */
  async releaseProcessingLock(id: string): Promise<void> {
    await this.prisma.session.update({
      where: { id },
      data: { is_processing: false },
    });
  }

  /**
   * Closes all sessions that have been inactive for more than the specified hours.
   * Used by the auto-close scheduled job.
   */
  async closeInactiveSessions(inactiveHours: number): Promise<number> {
    const cutoff = new Date(Date.now() - inactiveHours * 60 * 60 * 1000);

    const result = await this.prisma.session.updateMany({
      where: {
        status: { in: ['BOT', 'WAITING'] },
        last_interaction_at: { lt: cutoff },
      },
      data: { status: 'CLOSED', is_processing: false },
    });

    return result.count;
  }
}
