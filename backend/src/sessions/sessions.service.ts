import {
  Injectable,
  NotFoundException,
  BadRequestException,
  Logger,
} from '@nestjs/common';
import { SessionsRepository } from './sessions.repository.js';
import type { SessionWithContact, SessionWithRelations } from './sessions.repository.js';
import {
  SessionStatusEnum,
  VALID_STATUS_TRANSITIONS,
} from '../common/enums/session-status.enum.js';
import type { SessionStatus } from '@prisma/client';

/** Inactivity timeout in minutes — after this, bot_state resets to menu_inicial */
const INACTIVITY_TIMEOUT_MINUTES = 60;

/** Auto-close threshold in hours — sessions inactive longer than this get closed */
const AUTO_CLOSE_HOURS = 12;

@Injectable()
export class SessionsService {
  private readonly logger = new Logger(SessionsService.name);

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

  /**
   * Called when a new message arrives. Updates last_interaction_at and
   * checks if the session was inactive long enough to reset bot_state.
   */
  async touchSession(sessionId: string): Promise<SessionWithContact> {
    const session = await this.findById(sessionId);

    // Check for inactivity timeout — if user was away for > 1 hour, reset to menu
    if (session.status === 'BOT' && session.last_interaction_at) {
      const minutesSinceLastInteraction =
        (Date.now() - new Date(session.last_interaction_at).getTime()) / (1000 * 60);

      if (minutesSinceLastInteraction > INACTIVITY_TIMEOUT_MINUTES) {
        this.logger.log(
          `Session ${sessionId}: inactive for ${Math.round(minutesSinceLastInteraction)} min, resetting bot_state to menu_inicial`,
        );
        await this.sessionsRepository.updateBotState(sessionId, 'menu_inicial');
      }
    }

    return this.sessionsRepository.updateLastInteraction(sessionId);
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

    await this.sessionsRepository.updateBotState(sessionId, 'menu_inicial');

    return updated;
  }

  /**
   * Auto-close sessions that have been inactive for > AUTO_CLOSE_HOURS.
   * Should be called periodically (e.g., via a cron job or n8n scheduled workflow).
   */
  async closeInactiveSessions(): Promise<number> {
    const count = await this.sessionsRepository.closeInactiveSessions(AUTO_CLOSE_HOURS);
    if (count > 0) {
      this.logger.log(`Auto-closed ${count} inactive sessions (> ${AUTO_CLOSE_HOURS}h)`);
    }
    return count;
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
