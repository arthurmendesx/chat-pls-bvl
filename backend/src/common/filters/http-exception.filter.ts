import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus,
  Logger,
} from '@nestjs/common';
import { Response } from 'express';

interface ErrorResponseBody {
  readonly statusCode: number;
  readonly erro: string;
  readonly mensagem: string | string[];
  readonly timestamp: string;
}

const STATUS_MESSAGES: Record<number, string> = {
  [HttpStatus.BAD_REQUEST]: 'Requisição inválida',
  [HttpStatus.UNAUTHORIZED]: 'Não autorizado',
  [HttpStatus.FORBIDDEN]: 'Acesso negado',
  [HttpStatus.NOT_FOUND]: 'Recurso não encontrado',
  [HttpStatus.CONFLICT]: 'Conflito de dados',
  [HttpStatus.UNPROCESSABLE_ENTITY]: 'Dados não processáveis',
  [HttpStatus.INTERNAL_SERVER_ERROR]: 'Erro interno do servidor',
  [HttpStatus.BAD_GATEWAY]: 'Erro de comunicação com serviço externo',
  [HttpStatus.SERVICE_UNAVAILABLE]: 'Serviço indisponível',
};

@Catch()
export class HttpExceptionFilter implements ExceptionFilter {
  private readonly logger = new Logger(HttpExceptionFilter.name);

  catch(exception: unknown, host: ArgumentsHost): void {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();

    const status =
      exception instanceof HttpException
        ? exception.getStatus()
        : HttpStatus.INTERNAL_SERVER_ERROR;

    const mensagem = this.extractMessage(exception);

    if (status >= HttpStatus.INTERNAL_SERVER_ERROR) {
      this.logger.error(
        `Erro ${status}: ${JSON.stringify(mensagem)}`,
        exception instanceof Error ? exception.stack : undefined,
      );
    }

    const body: ErrorResponseBody = {
      statusCode: status,
      erro: STATUS_MESSAGES[status] ?? 'Erro desconhecido',
      mensagem,
      timestamp: new Date().toISOString(),
    };

    response.status(status).json(body);
  }

  private extractMessage(exception: unknown): string | string[] {
    if (!(exception instanceof HttpException)) {
      return 'Ocorreu um erro inesperado. Tente novamente mais tarde.';
    }

    const response = exception.getResponse();

    if (typeof response === 'string') {
      return response;
    }

    if (typeof response === 'object' && response !== null) {
      const res = response as Record<string, unknown>;
      if (Array.isArray(res['message'])) {
        return res['message'] as string[];
      }
      if (typeof res['message'] === 'string') {
        return res['message'];
      }
    }

    return exception.message;
  }
}
