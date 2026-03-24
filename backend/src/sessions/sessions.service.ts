import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service.js';
import type { SessionStatus, Session, Contact, Message } from '@prisma/client';

export interface SessionWithRelations extends Session {
  readonly contact: Contact;
  readonly messages: readonly Message[];
}

@Injectable()
export class SessionsService {
  constructor(private readonly prisma: PrismaService) {}

  async findAll(status?: string): Promise<SessionWithRelations[]> {
    const where = status
      ? { status: status as SessionStatus }
      : undefined;

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
}
