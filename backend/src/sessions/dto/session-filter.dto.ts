import { IsOptional, IsEnum } from 'class-validator';

enum SessionStatusFilter {
  BOT = 'BOT',
  WAITING = 'WAITING',
  ACTIVE = 'ACTIVE',
  CLOSED = 'CLOSED',
}

export class SessionFilterDto {
  @IsOptional()
  @IsEnum(SessionStatusFilter, {
    message: 'Status deve ser: BOT, WAITING, ACTIVE ou CLOSED',
  })
  status?: SessionStatusFilter;
}
