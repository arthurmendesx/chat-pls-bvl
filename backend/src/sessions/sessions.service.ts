import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { SessionsRepository } from './sessions.repository.js';
import type { SessionWithContact, SessionWithRelations } from './sessions.repository.js';
import {
  SessionStatusEnum,
  VALID_STATUS_TRANSITIONS,
} from '../common/enums/session-status.enum.js';
import type { SessionStatus } from '@prisma/client';

@Injectable()
export class SessionsService {
  constructor(private readonly sessionsRepository: SessionsRepository) {}

  async findAll(status?: string): Promise<SessionWithRelations[]> {
    return this.sessionsRepository.findAll(
      status as SessionStatus | undefined,
    );
  }

  async findById(sessionId: string): Promise<SessionWithContact> {
    const session = await this.sessionsRepository.findById(sessionId);

    if (!session) {
      throw new NotFoundException(
        `Sessão com ID "${sessionId}" não encontrada.`,
      );
    }

    return session;
  }

  async findOrCreateForContact(contactId: string): Promise<SessionWithContact> {
    const existing = await this.sessionsRepository.findActiveByContactId(contactId);

    if (existing) {
      return existing;
    }

    return this.sessionsRepository.create(contactId);
  }

  async updateStatus(
    sessionId: string,
    newStatus: SessionStatusEnum,
  ): Promise<SessionWithContact> {
    const session = await this.findById(sessionId);
    this.validateTransition(session.status as SessionStatusEnum, newStatus);

    return this.sessionsRepository.updateStatus(
      sessionId,
      newStatus as unknown as SessionStatus,
    );
  }

  async assumeSession(
    sessionId: string,
    userId: string,
  ): Promise<SessionWithContact> {
    const session = await this.findById(sessionId);

    const currentStatus = session.status as SessionStatusEnum;
    if (
      currentStatus !== SessionStatusEnum.BOT &&
      currentStatus !== SessionStatusEnum.WAITING
    ) {
      throw new BadRequestException(
        `Só é possível assumir sessões com status BOT ou WAITING. Status atual: ${currentStatus}.`,
      );
    }

    return this.sessionsRepository.updateStatus(
      sessionId,
      'ACTIVE' as SessionStatus,
      userId,
    );
  }

  async returnToBot(sessionId: string): Promise<SessionWithContact> {
    const session = await this.findById(sessionId);

    if (session.status !== 'ACTIVE') {
      throw new BadRequestException(
        'Só é possível retornar ao bot sessões com status ACTIVE.',
      );
    }

    const updated = await this.sessionsRepository.updateStatus(
      sessionId,
      'BOT' as SessionStatus,
      null,
    );

    await this.sessionsRepository.updateBotState(sessionId, null);

    return updated;
  }

  private validateTransition(
    currentStatus: SessionStatusEnum,
    newStatus: SessionStatusEnum,
  ): void {
    const allowedTransitions = VALID_STATUS_TRANSITIONS[currentStatus] ?? [];

    if (!allowedTransitions.includes(newStatus)) {
      throw new BadRequestException(
        `Não é possível alterar o status de "${currentStatus}" para "${newStatus}". ` +
          `Transições permitidas: ${allowedTransitions.join(', ') || 'nenhuma'}.`,
      );
    }
  }
}
