import { Global, Module } from '@nestjs/common';
import { PrismaService } from './prisma.service';

@Global() // <-- Isso aqui faz a mágica de deixar disponível no projeto todo
@Module({
  providers: [PrismaService],
  exports: [PrismaService], // <-- Precisamos exportar para os outros usarem
})
export class PrismaModule {}