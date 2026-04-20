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
    this.webhookSecret = config.getOrThrow<string>('WEBHOOK_SECRET').trim();
  }

  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest();
    const secret = request.headers['x-webhook-secret'] as string | undefined;

    console.log('[DEBUG] Webhook validation started');
    console.log(`[DEBUG] Received secret: "${secret}"`);
    console.log(`[DEBUG] Expected secret: "${this.webhookSecret}"`);
    
    if (secret && this.webhookSecret) {
        console.log(`[DEBUG] Received length: ${secret.length}, Expected length: ${this.webhookSecret.length}`);
        let diffIndex = -1;
        for(let i=0; i<Math.max(secret.length, this.webhookSecret.length); i++) {
           if (secret[i] !== this.webhookSecret[i]) {
               diffIndex = i;
               console.log(`[DEBUG] Difference at index ${i}: received '${secret[i]}' (code ${secret.charCodeAt(i)}) vs expected '${this.webhookSecret[i]}' (code ${this.webhookSecret.charCodeAt(i)})`);
               break;
           }
        }
        if (diffIndex === -1 && secret !== this.webhookSecret) {
            console.log(`[DEBUG] Strings differ despite no index difference found (impossible case check)`);
        }
    }

    if (!secret || secret.trim() !== this.webhookSecret) {
      throw new UnauthorizedException('Webhook secret inválido.');
    }

    return true;
  }
}
