import { Module } from '@nestjs/common';
import { WhatsAppService } from './whatsapp.service.js';
import { WhatsAppController } from './whatsapp.controller.js';
import { WebhookAuthGuard } from './guards/webhook-auth.guard.js';
import { ContactsModule } from '../contacts/contacts.module.js';
import { SessionsModule } from '../sessions/sessions.module.js';
import { MessagesModule } from '../chat/messages.module.js';

@Module({
  imports: [ContactsModule, SessionsModule, MessagesModule],
  controllers: [WhatsAppController],
  providers: [WhatsAppService, WebhookAuthGuard],
  exports: [WhatsAppService],
})
export class WhatsAppModule {}
