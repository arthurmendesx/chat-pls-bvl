<script lang="ts">
	import type { Contact, Session } from '$lib/types';
	import { ContactFilter } from '$lib/types';
	import ContactListItem from './ContactListItem.svelte';
	import { api } from '$lib/services/api';
	import { botSessions, waitingSessions, activeSessions, sessionsStore } from '$lib/stores/sessions';
	import { chatStore } from '$lib/stores/chat';

	let activeFilter = $state<ContactFilter>(ContactFilter.ALL);
	let searchQuery = $state('');

	const filters: { label: string; value: ContactFilter }[] = [
		{ label: 'Todos', value: ContactFilter.ALL },
		{ label: 'Bot', value: ContactFilter.BOT },
		{ label: 'Espera', value: ContactFilter.WAITING },
		{ label: 'Meus', value: ContactFilter.MINE }
	];

	// Usa o store derivado dependendo do filtro selecionado
	const visibleSessions = $derived.by(() => {
		let list: Session[] = [];
		if (activeFilter === ContactFilter.ALL || activeFilter === ContactFilter.MINE) {
			list = $sessionsStore;
		} else if (activeFilter === ContactFilter.BOT) {
			list = $botSessions;
		} else if (activeFilter === ContactFilter.WAITING) {
			list = $waitingSessions;
		}

		if (searchQuery) {
			const lower = searchQuery.toLowerCase();
			return list.filter((s) => s.contact.name.toLowerCase().includes(lower) || s.contact.phone.includes(lower));
		}
		return list;
	});

	async function handleSelectSession(session: Session) {
		try {
			chatStore.setLoading(true);
			const response = await api.fetchChatHistory(session.id);
			console.log('API Response:', response); // Console requisitado
			
			const sessionData = response.session || (response as any).data?.session || session;
			const messagesData = response.messages || (response as any).data?.messages || [];
			
			chatStore.setActiveSession(sessionData, messagesData);
		} catch (error) {
			console.error(error);
			alert('Falha ao abrir a conversa.');
			chatStore.clearSession();
		}
	}
</script>

<aside class="flex h-full w-80 flex-col border-r border-gray-200 bg-white">
	<!-- Logo -->
	<div class="flex items-center gap-2 border-b border-gray-200 px-4 py-4">
		<div class="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-600 text-white">
			<svg class="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
				<path
					stroke-linecap="round"
					stroke-linejoin="round"
					stroke-width="2"
					d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
				></path>
			</svg>
		</div>
		<h1 class="text-lg font-bold text-gray-900">ChatSupport</h1>
	</div>

	<!-- Search -->
	<div class="px-4 py-3">
		<div class="relative">
			<svg
				class="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400"
				fill="none"
				stroke="currentColor"
				viewBox="0 0 24 24"
			>
				<path
					stroke-linecap="round"
					stroke-linejoin="round"
					stroke-width="2"
					d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
				></path>
			</svg>
			<input
				type="text"
				placeholder="Buscar contatos..."
				class="w-full rounded-lg border border-gray-200 py-2 pl-9 pr-3 text-sm text-gray-900 placeholder-gray-400 focus:border-blue-600 focus:outline-none focus:ring-1 focus:ring-blue-600"
				bind:value={searchQuery}
			/>
		</div>
	</div>

	<!-- Filter Pills -->
	<div class="flex gap-2 px-4 pb-3">
		{#each filters as filter}
			<button
				type="button"
				class="rounded-full px-3 py-1 text-xs font-medium transition-colors {activeFilter ===
				filter.value
					? 'bg-blue-600 text-white'
					: 'bg-gray-100 text-gray-600 hover:bg-gray-200'}"
				onclick={() => (activeFilter = filter.value)}
			>
				{filter.label}
			</button>
		{/each}
	</div>

	<!-- Contact List -->
	<div class="custom-scrollbar flex-1 overflow-y-auto">
		{#each visibleSessions as session (session.id)}
			<ContactListItem
				contact={session.contact}
				isActive={$chatStore.session?.id === session.id}
				lastMessage={session.messages?.[0]?.content}
				onclick={() => handleSelectSession(session)}
			/>
		{/each}
	</div>
</aside>
