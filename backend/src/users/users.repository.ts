import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service.js';
import type { User } from '@prisma/client';

interface CreateUserData {
  readonly name: string;
  readonly email: string;
  readonly password: string;
  readonly role?: 'ADMIN' | 'AGENT';
}

@Injectable()
export class UsersRepository {
  constructor(private readonly prisma: PrismaService) {}

  async findById(id: string): Promise<User | null> {
    return this.prisma.user.findUnique({ where: { id } });
  }

  async findByEmail(email: string): Promise<User | null> {
    return this.prisma.user.findUnique({ where: { email } });
  }

  async findAll(): Promise<User[]> {
    return this.prisma.user.findMany({
      orderBy: { createdAt: 'desc' },
    });
  }

  async create(data: CreateUserData): Promise<User> {
    return this.prisma.user.create({ data });
  }
}
