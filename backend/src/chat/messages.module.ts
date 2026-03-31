import { Module } from '@nestjs/common';
import { MessagesRepository } from './messages.repository.js';

@Module({
  providers: [MessagesRepository],
  exports: [MessagesRepository],
})
export class MessagesModule {}
