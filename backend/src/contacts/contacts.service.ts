import { Injectable, ConflictException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service.js';
import type { Contact } from '@prisma/client';

interface CreateContactData {
  readonly name: string;
  readonly phone: string;
  readonly avatarUrl?: string;
  readonly notes?: string;
}

@Injectable()
export class ContactsService {
  constructor(private readonly prisma: PrismaService) {}

  async create(data: CreateContactData): Promise<Contact> {
    const existing = await this.prisma.contact.findUnique({
      where: { phone: data.phone },
    });

    if (existing) {
      throw new ConflictException(
        'Já existe um contato com este número de telefone.',
      );
    }

    return this.prisma.contact.create({ data });
  }

  async findAll(): Promise<Contact[]> {
    return this.prisma.contact.findMany({
      orderBy: { createdAt: 'desc' },
    });
  }
}