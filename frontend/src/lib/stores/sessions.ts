import { writable, derived } from 'svelte/store';
import type { Session } from '../types';
import { SessionStatus } from '../types';

function createSessionsStore() {
	const { subscribe, set, update } = writable<Session[]>([]);

	return {
		subscribe,
		set,
		// Atualiza o array inteiro de sessões
		setSessions: (sessions: Session[]) => set(sessions),

		// Adiciona ou atualiza uma única sessão (útil para eventos Realtime)
		upsertSession: (newSession: Session) => {
			update((sessions) => {
				const index = sessions.findIndex((s) => s.id === newSession.id);
				if (index !== -1) {
					const updated = [...sessions];
					updated[index] = newSession;
					// Reordena para exibir as atualizadas mais recentemente no topo
					return updated.sort(
						(a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
					);
				}
				return [newSession, ...sessions].sort(
					(a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
				);
			});
		}
	};
}

export const sessionsStore = createSessionsStore();

// Derived stores para facilitar a separação por abas na UI
export const botSessions = derived(sessionsStore, ($sessions) =>
	$sessions.filter((s) => s.status === SessionStatus.BOT)
);

export const waitingSessions = derived(sessionsStore, ($sessions) =>
	$sessions.filter((s) => s.status === SessionStatus.WAITING)
);

export const activeSessions = derived(sessionsStore, ($sessions) =>
	$sessions.filter((s) => s.status === SessionStatus.ACTIVE)
);
