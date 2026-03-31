import {
  Injectable,
  ConflictException,
  NotFoundException,
} from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { UsersRepository } from './users.repository.js';
import type { User } from '@prisma/client';
import type { CreateUserDto } from './dto/create-user.dto.js';

type SafeUser = Omit<User, 'password'>;

@Injectable()
export class UsersService {
  constructor(private readonly usersRepository: UsersRepository) {}

  async createAgent(dto: CreateUserDto): Promise<SafeUser> {
    const existing = await this.usersRepository.findByEmail(dto.email);

    if (existing) {
      throw new ConflictException('Já existe um usuário com este e-mail.');
    }

    const hashedPassword = await bcrypt.hash(dto.password, 10);

    const user = await this.usersRepository.create({
      name: dto.name,
      email: dto.email,
      password: hashedPassword,
      role: 'AGENT',
    });

    return this.excludePassword(user);
  }

  async findById(id: string): Promise<User | null> {
    return this.usersRepository.findById(id);
  }

  async findByEmail(email: string): Promise<User | null> {
    return this.usersRepository.findByEmail(email);
  }

  async findAll(): Promise<SafeUser[]> {
    const users = await this.usersRepository.findAll();
    return users.map((user) => this.excludePassword(user));
  }

  private excludePassword(user: User): SafeUser {
    const { password: _, ...safeUser } = user;
    return safeUser;
  }
}
