import { Controller, Post, Body, UseGuards, Logger } from '@nestjs/common';
import { WhatsAppService } from './whatsapp.service.js';
import { WebhookPayloadDto } from './dto/webhook-payload.dto.js';
import { WebhookAuthGuard } from './guards/webhook-auth.guard.js';

@Controller('webhook')
export class WhatsAppController {
  private readonly logger = new Logger(WhatsAppController.name);

  constructor(private readonly whatsAppService: WhatsAppService) {}

  @Post('incoming')
  @UseGuards(WebhookAuthGuard)
  async handleIncoming(@Body() payload: WebhookPayloadDto) {
    this.logger.log('Webhook recebido do Meta/n8n');
    return this.whatsAppService.processIncomingWebhook(payload);
  }
}
