import { writable } from 'svelte/store';
import type { Session, Message } from '../types';

interface ChatState {
	session: Session | null;
	messages: Message[];
	isLoading: boolean;
	error: string | null;
}

function createChatStore() {
	const { subscribe, set, update } = writable<ChatState>({
		session: null,
		messages: [],
		isLoading: false,
		error: null
	});

	return {
		subscribe,
		set,

		// Inicia estado de carregamento
		setLoading: (isLoading: boolean) => update((state) => ({ ...state, isLoading })),

		// Define a sessão ativa junto com seu histórico inicial e garante que a flag de carregamento seja removida
		setActiveSession: (session: Session, messages: Message[]) =>
			update((state) => ({ ...state, session, messages, error: null, isLoading: false })),

		// Exibe um erro na UI do chat (ex: falha ao enviar)
		setError: (error: string) => update((state) => ({ ...state, error })),

		// Opcionalmente limpa a conversa atual (usuário deselecionou o contato)
		clearSession: () => update(() => ({ session: null, messages: [], isLoading: false, error: null })),

		// Adiciona uma nova mensagem à sessão atual (via API ou Webhook Realtime)
		appendMessage: (message: Message) => {
			update((state) => {
				// Verifica se a mensagem pertence à conversa selecionada
				if (state.session && state.session.id === message.sessionId) {
					// Impede duplicação caso tenhamos adicionado otimisticamente
					const exists = state.messages.find((m) => m.id === message.id);
					if (exists) return state;

					return { ...state, messages: [...state.messages, message] };
				}
				return state;
			});
		}
	};
}

export const chatStore = createChatStore();
