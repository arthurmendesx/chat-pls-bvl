import { Module } from '@nestjs/common';
import { ChatController } from './chat.controller.js';
import { ChatService } from './chat.service.js';
import { MessagesModule } from './messages.module.js';
import { WhatsAppModule } from '../whatsapp/whatsapp.module.js';
import { SessionsModule } from '../sessions/sessions.module.js';

@Module({
  imports: [MessagesModule, WhatsAppModule, SessionsModule],
  controllers: [ChatController],
  providers: [ChatService],
})
export class ChatModule {}
