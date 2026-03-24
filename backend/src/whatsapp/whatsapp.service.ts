import { Injectable, Logger, BadGatewayException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

interface MetaMessagePayload {
  readonly messaging_product: 'whatsapp';
  readonly to: string;
  readonly type: 'text';
  readonly text: { readonly body: string };
}

interface MetaSuccessResponse {
  readonly messages: ReadonlyArray<{ readonly id: string }>;
}

interface MetaErrorDetail {
  readonly message: string;
  readonly code: number;
}

interface MetaErrorResponse {
  readonly error: MetaErrorDetail;
}

const META_API_BASE = 'https://graph.facebook.com/v19.0';

@Injectable()
export class WhatsAppService {
  private readonly logger = new Logger(WhatsAppService.name);
  private readonly accessToken: string;
  private readonly phoneNumberId: string;

  constructor(private readonly config: ConfigService) {
    this.accessToken = this.config.getOrThrow<string>('META_ACCESS_TOKEN');
    this.phoneNumberId = this.config.getOrThrow<string>('META_PHONE_NUMBER_ID');
  }

  async sendTextMessage(recipientPhone: string, text: string): Promise<string> {
    const url = `${META_API_BASE}/${this.phoneNumberId}/messages`;

    const payload: MetaMessagePayload = {
      messaging_product: 'whatsapp',
      to: recipientPhone,
      type: 'text',
      text: { body: text },
    };

    let response: Response;

    try {
      response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${this.accessToken}`,
        },
        body: JSON.stringify(payload),
      });
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : String(error);
      this.logger.error(`Falha na conexão com a API do Meta: ${message}`);
      throw new BadGatewayException(
        'Não foi possível conectar à API do WhatsApp. Tente novamente.',
      );
    }

    if (!response.ok) {
      const errorBody = (await response.json()) as MetaErrorResponse;
      const metaError = errorBody?.error;

      this.logger.error(
        `Meta API retornou ${response.status}: ${JSON.stringify(metaError)}`,
      );

      const friendlyMessage = this.mapMetaError(
        metaError?.code,
        metaError?.message,
      );
      throw new BadGatewayException(friendlyMessage);
    }

    const successBody = (await response.json()) as MetaSuccessResponse;
    const externalId = successBody.messages?.[0]?.id ?? '';

    this.logger.log(
      `Mensagem enviada para ${recipientPhone} — ID externo: ${externalId}`,
    );

    return externalId;
  }

  private mapMetaError(code?: number, message?: string): string {
    if (code === 190) {
      return 'Token de acesso do Meta expirado ou inválido. Verifique as credenciais.';
    }
    if (code === 131030) {
      return 'Número de telefone do destinatário é inválido ou não está registrado no WhatsApp.';
    }
    if (code === 131047) {
      return 'Mensagem não enviada: o contato precisa iniciar a conversa primeiro (janela de 24h expirada).';
    }
    if (code === 4) {
      return 'Limite de requisições da API do Meta atingido. Aguarde alguns minutos.';
    }

    return `Erro ao enviar mensagem via WhatsApp: ${message ?? 'erro desconhecido'}`;
  }
}
