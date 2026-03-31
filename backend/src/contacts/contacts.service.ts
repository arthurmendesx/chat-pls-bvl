import { Injectable, ConflictException } from '@nestjs/common';
import { ContactsRepository } from './contacts.repository.js';
import type { Contact } from '@prisma/client';
import type { CreateContactDto } from './dto/create-contact.dto.js';

@Injectable()
export class ContactsService {
  constructor(private readonly contactsRepository: ContactsRepository) {}

  async create(dto: CreateContactDto): Promise<Contact> {
    const existing = await this.contactsRepository.findByPhone(dto.phone);

    if (existing) {
      throw new ConflictException(
        'Já existe um contato com este número de telefone.',
      );
    }

    return this.contactsRepository.create(dto);
  }

  async findAll(): Promise<Contact[]> {
    return this.contactsRepository.findAll();
  }

  async findOrCreateByPhone(phone: string, name: string): Promise<Contact> {
    return this.contactsRepository.upsertByPhone(phone, { name, phone });
  }
}