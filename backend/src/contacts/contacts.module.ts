import { Module } from '@nestjs/common';
import { ContactsService } from './contacts.service.js';
import { ContactsController } from './contacts.controller.js';
import { ContactsRepository } from './contacts.repository.js';

@Module({
  controllers: [ContactsController],
  providers: [ContactsService, ContactsRepository],
  exports: [ContactsService],
})
export class ContactsModule {}
