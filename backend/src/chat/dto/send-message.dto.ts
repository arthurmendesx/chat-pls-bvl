import { IsString, IsNotEmpty } from 'class-validator';

export class SendMessageDto {
  @IsString({ message: 'O conteúdo da mensagem deve ser um texto' })
  @IsNotEmpty({ message: 'O conteúdo da mensagem não pode ser vazio' })
  content!: string;
}
