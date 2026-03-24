import { Controller, Get, Query } from '@nestjs/common';
import { SessionsService } from './sessions.service.js';
import { SessionFilterDto } from './dto/session-filter.dto.js';

@Controller('sessions')
export class SessionsController {
  constructor(private readonly sessionsService: SessionsService) {}

  @Get()
  findAll(@Query() filter: SessionFilterDto) {
    return this.sessionsService.findAll(filter.status);
  }
}
