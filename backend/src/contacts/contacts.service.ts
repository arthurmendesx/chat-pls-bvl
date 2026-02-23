import { Injectable, ConflictException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class ContactsService {
  // Injetamos o Prisma aqui
  constructor(private prisma: PrismaService) {}

  async create(data: { name: string; phone: string; avatarUrl?: string; notes?: string }) {
    // 1. Verifica se o contato já existe pelo telefone
    const existingContact = await this.prisma.contact.findUnique({
      where: { phone: data.phone },
    });

    if (existingContact) {
      throw new ConflictException('Já existe um contato com este número de telefone.');
    }

    // 2. Cria no banco de dados
    return this.prisma.contact.create({
      data,
    });
  }

  async findAll() {
    // Retorna todos os contatos ordenados pelos mais recentes
    return this.prisma.contact.findMany({
      orderBy: { createdAt: 'desc' },
    });
  }
}