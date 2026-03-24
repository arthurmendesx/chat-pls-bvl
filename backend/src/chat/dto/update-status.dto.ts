import { IsEnum, IsNotEmpty } from 'class-validator';

enum SessionStatusUpdate {
  ACTIVE = 'ACTIVE',
  CLOSED = 'CLOSED',
}

export class UpdateStatusDto {
  @IsNotEmpty({ message: 'O campo status é obrigatório' })
  @IsEnum(SessionStatusUpdate, {
    message: 'Status deve ser: ACTIVE ou CLOSED',
  })
  status!: SessionStatusUpdate;
}
