import {
  Controller,
  Get,
  Post,
  Patch,
  Param,
  Body,
  Query,
  UseGuards,
} from '@nestjs/common';
import { SessionsService } from './sessions.service.js';
import { SessionFilterDto } from './dto/session-filter.dto.js';
import { UpdateStatusDto } from './dto/update-status.dto.js';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard.js';
import { CurrentUser } from '../auth/decorators/current-user.decorator.js';

interface JwtPayload {
  readonly userId: string;
  readonly email: string;
  readonly role: string;
}

@Controller('sessions')
@UseGuards(JwtAuthGuard)
export class SessionsController {
  constructor(private readonly sessionsService: SessionsService) {}

  @Get()
  findAll(@Query() filter: SessionFilterDto) {
    return this.sessionsService.findAll(filter.status);
  }

  @Patch(':id/status')
  updateStatus(
    @Param('id') id: string,
    @Body() dto: UpdateStatusDto,
  ) {
    return this.sessionsService.updateStatus(id, dto.status);
  }

  @Patch(':id/assume')
  assumeSession(
    @Param('id') id: string,
    @CurrentUser() user: JwtPayload,
  ) {
    return this.sessionsService.assumeSession(id, user.userId);
  }

  @Patch(':id/return-to-bot')
  returnToBot(@Param('id') id: string) {
    return this.sessionsService.returnToBot(id);
  }

  /**
   * Endpoint to trigger auto-close of inactive sessions.
   * Can be called by a n8n scheduled workflow or a cron job.
   * POST /api/sessions/auto-close
   */
  @Post('auto-close')
  async autoClose() {
    const closedCount = await this.sessionsService.closeInactiveSessions();
    return { closed: closedCount };
  }
}
