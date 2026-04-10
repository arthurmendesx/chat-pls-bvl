export enum SessionStatusEnum {
  BOT = 'BOT',
  WAITING = 'WAITING',
  ACTIVE = 'ACTIVE',
  CLOSED = 'CLOSED',
}

export const VALID_STATUS_TRANSITIONS: Record<SessionStatusEnum, readonly SessionStatusEnum[]> = {
  [SessionStatusEnum.BOT]: [SessionStatusEnum.WAITING, SessionStatusEnum.ACTIVE, SessionStatusEnum.CLOSED],
  [SessionStatusEnum.WAITING]: [SessionStatusEnum.ACTIVE, SessionStatusEnum.CLOSED],
  [SessionStatusEnum.ACTIVE]: [SessionStatusEnum.BOT, SessionStatusEnum.CLOSED],
  [SessionStatusEnum.CLOSED]: [SessionStatusEnum.BOT],
};
