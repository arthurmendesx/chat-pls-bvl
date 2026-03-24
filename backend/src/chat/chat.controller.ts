import { Controller, Get, Patch, Post, Param, Body } from '@nestjs/common';
import { ChatService } from './chat.service.js';
import { UpdateStatusDto } from './dto/update-status.dto.js';
import { SendMessageDto } from './dto/send-message.dto.js';

@Controller('chats')
export class ChatController {
  constructor(private readonly chatService: ChatService) {}

  @Get(':sessionId')
  getMessages(@Param('sessionId') sessionId: string) {
    return this.chatService.getMessages(sessionId);
  }

  @Patch(':sessionId/status')
  updateStatus(
    @Param('sessionId') sessionId: string,
    @Body() dto: UpdateStatusDto,
  ) {
    return this.chatService.updateStatus(sessionId, dto.status);
  }

  @Post(':sessionId/send')
  sendMessage(
    @Param('sessionId') sessionId: string,
    @Body() dto: SendMessageDto,
  ) {
    return this.chatService.sendMessage(sessionId, dto.content);
  }
}
