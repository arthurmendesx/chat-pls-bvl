import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service.js';
import type { Contact } from '@prisma/client';

interface CreateContactData {
  readonly name: string;
  readonly phone: string;
  readonly avatarUrl?: string;
  readonly notes?: string;
}

@Injectable()
export class ContactsRepository {
  constructor(private readonly prisma: PrismaService) {}

  async findById(id: string): Promise<Contact | null> {
    return this.prisma.contact.findUnique({ where: { id } });
  }

  async findByPhone(phone: string): Promise<Contact | null> {
    return this.prisma.contact.findUnique({ where: { phone } });
  }

  async findAll(): Promise<Contact[]> {
    return this.prisma.contact.findMany({
      orderBy: { createdAt: 'desc' },
    });
  }

  async create(data: CreateContactData): Promise<Contact> {
    return this.prisma.contact.create({ data });
  }

  async upsertByPhone(
    phone: string,
    data: CreateContactData,
  ): Promise<Contact> {
    return this.prisma.contact.upsert({
      where: { phone },
      update: { name: data.name },
      create: data,
    });
  }
}
