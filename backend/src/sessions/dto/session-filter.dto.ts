import { IsOptional, IsEnum } from 'class-validator';
import { SessionStatusEnum } from '../../common/enums/session-status.enum.js';

export class SessionFilterDto {
  @IsOptional()
  @IsEnum(SessionStatusEnum, {
    message: 'Status deve ser: BOT, WAITING, ACTIVE ou CLOSED',
  })
  status?: SessionStatusEnum;
}
