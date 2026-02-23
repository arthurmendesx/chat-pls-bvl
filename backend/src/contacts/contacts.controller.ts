import { Controller, Get, Post, Body } from '@nestjs/common';
import { ContactsService } from './contacts.service';

@Controller('contacts')
export class ContactsController {
  constructor(private readonly contactsService: ContactsService) {}

  @Post()
  create(@Body() createContactDto: { name: string; phone: string; avatarUrl?: string; notes?: string }) {
    return this.contactsService.create(createContactDto);
  }

  @Get()
  findAll() {
    return this.contactsService.findAll();
  }
}