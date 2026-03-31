import { IsString, IsNotEmpty, IsOptional } from 'class-validator';

export class CreateContactDto {
  @IsString({ message: 'O nome deve ser um texto' })
  @IsNotEmpty({ message: 'O nome é obrigatório' })
  name!: string;

  @IsString({ message: 'O telefone deve ser um texto' })
  @IsNotEmpty({ message: 'O telefone é obrigatório' })
  phone!: string;

  @IsOptional()
  @IsString({ message: 'A URL do avatar deve ser um texto' })
  avatarUrl?: string;

  @IsOptional()
  @IsString({ message: 'As notas devem ser um texto' })
  notes?: string;
}
