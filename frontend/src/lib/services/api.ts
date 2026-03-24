import { PUBLIC_API_URL } from '$env/static/public';
import type { Session, Message, SessionStatus } from '../types';

interface ApiError {
	statusCode: number;
	erro: string;
	mensagem: string | string[];
}

/**
 * Utilitário interno para chamadas fetch com tratamento padronizado de erros.
 */
async function fetchApi<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
	const url = `${PUBLIC_API_URL}${endpoint}`;
	const headers = {
		'Content-Type': 'application/json',
		...options.headers
	};

	try {
		const response = await fetch(url, { ...options, headers });

		if (!response.ok) {
			const errorData = (await response.json().catch(() => ({}))) as Partial<ApiError>;
			const errorMessage = Array.isArray(errorData.mensagem)
				? errorData.mensagem[0]
				: errorData.mensagem || 'Erro desconhecido da API';

			throw new Error(errorMessage);
		}

		return response.json() as Promise<T>;
	} catch (error) {
		const message = error instanceof Error ? error.message : String(error);
		console.error(`Falha na requisição para ${endpoint}:`, message);
		throw new Error(message);
	}
}

export const api = {
	/**
	 * Busca os atendimentos filtrados por status (BOT, WAITING, ACTIVE, CLOSED)
	 */
	async fetchSessions(status: string): Promise<Session[]> {
		try {
			return await fetchApi<Session[]>(`/sessions?status=${status}`);
		} catch (error) {
			throw new Error('Erro ao carregar os atendimentos. Tente novamente mais tarde.');
		}
	},

	/**
	 * Busca o histórico de mensagens e informações de uma sessão específica
	 */
	async fetchChatHistory(sessionId: string): Promise<{ session: Session; messages: Message[] }> {
		try {
			return await fetchApi<{ session: Session; messages: Message[] }>(`/chats/${sessionId}`);
		} catch (error) {
			throw new Error('Erro ao carregar o histórico da conversa.');
		}
	},

	/**
	 * Atualiza o status de uma sessão (ex: assumir chat, encerrar atendimento)
	 */
	async updateSessionStatus(sessionId: string, newStatus: SessionStatus): Promise<Session> {
		try {
			return await fetchApi<Session>(`/chats/${sessionId}/status`, {
				method: 'PATCH',
				body: JSON.stringify({ status: newStatus })
			});
		} catch (error) {
			throw new Error(`Falha ao alterar o status do atendimento: ${error instanceof Error ? error.message : 'Erro interno'}`);
		}
	},

	/**
	 * Envia uma mensagem de texto (Agente) para o contato
	 */
	async sendMessage(sessionId: string, text: string): Promise<Message> {
		try {
			return await fetchApi<Message>(`/chats/${sessionId}/send`, {
				method: 'POST',
				body: JSON.stringify({ content: text })
			});
		} catch (error) {
			throw new Error(`Falha ao enviar a mensagem: ${error instanceof Error ? error.message : 'Erro interno'}`);
		}
	}
};
