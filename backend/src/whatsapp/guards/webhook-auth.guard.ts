import {
  Injectable,
  CanActivate,
  ExecutionContext,
  UnauthorizedException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class WebhookAuthGuard implements CanActivate {
  private readonly webhookSecret: string;

  constructor(config: ConfigService) {
    this.webhookSecret = config.getOrThrow<string>('WEBHOOK_SECRET');
  }

  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest();
    const secret = request.headers['x-webhook-secret'];

    if (secret !== this.webhookSecret) {
      throw new UnauthorizedException('Webhook secret inválido.');
    }

    return true;
  }
}
