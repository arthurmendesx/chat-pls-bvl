import { IsEnum, IsNotEmpty } from 'class-validator';
import { SessionStatusEnum } from '../../common/enums/session-status.enum.js';

export class UpdateStatusDto {
  @IsNotEmpty({ message: 'O campo status é obrigatório' })
  @IsEnum(SessionStatusEnum, {
    message: 'Status deve ser: BOT, WAITING, ACTIVE ou CLOSED',
  })
  status!: SessionStatusEnum;
}
