<script lang="ts">
	import type { Contact, Session } from '$lib/types';
	import { ContactFilter } from '$lib/types';
	import ContactListItem from './ContactListItem.svelte';
	import { api } from '$lib/services/api';
	import { botSessions, waitingSessions, activeSessions, sessionsStore } from '$lib/stores/sessions';
	import { chatStore } from '$lib/stores/chat';

	let activeFilter = $state<ContactFilter>(ContactFilter.ALL);
	let searchQuery = $state('');

	const filters: { label: string; value: ContactFilter; emoji: string }[] = [
		{ label: 'Todos', value: ContactFilter.ALL, emoji: '📋' },
		{ label: 'Bot', value: ContactFilter.BOT, emoji: '🤖' },
		{ label: 'Espera', value: ContactFilter.WAITING, emoji: '⏳' },
		{ label: 'Meus', value: ContactFilter.MINE, emoji: '👤' }
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

<aside class="sidebar">
	<!-- Header -->
	<div class="sidebar-header">
		<div class="sidebar-title">
			<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" class="title-icon">
				<path stroke-linecap="round" stroke-linejoin="round" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"></path>
			</svg>
			<span>Conversas</span>
		</div>
		<span class="session-count">{visibleSessions.length}</span>
	</div>

	<!-- Search -->
	<div class="search-wrapper">
		<svg class="search-icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
			<path fill-rule="evenodd" d="M9 3.5a5.5 5.5 0 100 11 5.5 5.5 0 000-11zM2 9a7 7 0 1112.452 4.391l3.328 3.329a.75.75 0 11-1.06 1.06l-3.329-3.328A7 7 0 012 9z" clip-rule="evenodd" />
		</svg>
		<input
			type="text"
			placeholder="Buscar contato ou telefone…"
			class="search-input"
			bind:value={searchQuery}
		/>
	</div>

	<!-- Filter Pills -->
	<div class="filter-bar">
		{#each filters as filter}
			<button
				type="button"
				class="filter-pill"
				class:active={activeFilter === filter.value}
				onclick={() => (activeFilter = filter.value)}
			>
				<span class="filter-emoji">{filter.emoji}</span>
				{filter.label}
			</button>
		{/each}
	</div>

	<!-- Contact List -->
	<div class="contact-list custom-scrollbar">
		{#if visibleSessions.length === 0}
			<div class="empty-list">
				<span>Nenhuma conversa encontrada</span>
			</div>
		{:else}
			{#each visibleSessions as session (session.id)}
				<ContactListItem
					contact={session.contact}
					status={session.status}
					isActive={$chatStore.session?.id === session.id}
					lastMessage={session.messages?.[0]?.content}
					onclick={() => handleSelectSession(session)}
				/>
			{/each}
		{/if}
	</div>
</aside>

<style>
	.sidebar {
		display: flex;
		flex-direction: column;
		width: 320px;
		height: 100%;
		border-right: 1px solid rgba(255, 255, 255, 0.06);
		background: rgba(255, 255, 255, 0.02);
		flex-shrink: 0;
	}

	/* Header */
	.sidebar-header {
		display: flex;
		align-items: center;
		justify-content: space-between;
		padding: 1rem 1.125rem;
		border-bottom: 1px solid rgba(255, 255, 255, 0.06);
	}

	.sidebar-title {
		display: flex;
		align-items: center;
		gap: 0.5rem;
		font-size: 0.9375rem;
		font-weight: 600;
		color: #e2e8f0;
	}

	.title-icon {
		width: 20px;
		height: 20px;
		color: #a78bfa;
	}

	.session-count {
		font-size: 0.6875rem;
		font-weight: 700;
		color: #a78bfa;
		background: rgba(124, 58, 237, 0.15);
		border: 1px solid rgba(124, 58, 237, 0.2);
		padding: 2px 8px;
		border-radius: 99px;
	}

	/* Search */
	.search-wrapper {
		position: relative;
		padding: 0.75rem 1rem;
	}

	.search-icon {
		position: absolute;
		top: 50%;
		left: 1.75rem;
		transform: translateY(-50%);
		width: 16px;
		height: 16px;
		color: rgba(255, 255, 255, 0.25);
		pointer-events: none;
	}

	.search-input {
		width: 100%;
		padding: 0.6rem 0.75rem 0.6rem 2.25rem;
		font-size: 0.8125rem;
		color: #e2e8f0;
		background: rgba(255, 255, 255, 0.04);
		border: 1px solid rgba(255, 255, 255, 0.08);
		border-radius: 10px;
		outline: none;
		transition: all 0.2s;
		font-family: inherit;
	}

	.search-input::placeholder {
		color: rgba(255, 255, 255, 0.2);
	}

	.search-input:focus {
		border-color: rgba(124, 58, 237, 0.4);
		box-shadow: 0 0 0 3px rgba(124, 58, 237, 0.1);
		background: rgba(255, 255, 255, 0.06);
	}

	/* Filter Bar */
	.filter-bar {
		display: flex;
		gap: 0.375rem;
		padding: 0 1rem 0.75rem;
	}

	.filter-pill {
		display: flex;
		align-items: center;
		gap: 0.25rem;
		padding: 0.3rem 0.625rem;
		font-size: 0.6875rem;
		font-weight: 600;
		font-family: inherit;
		color: rgba(255, 255, 255, 0.45);
		background: rgba(255, 255, 255, 0.04);
		border: 1px solid rgba(255, 255, 255, 0.06);
		border-radius: 8px;
		cursor: pointer;
		transition: all 0.2s;
	}

	.filter-pill:hover {
		background: rgba(255, 255, 255, 0.06);
		color: rgba(255, 255, 255, 0.7);
	}

	.filter-pill.active {
		color: #c4b5fd;
		background: rgba(124, 58, 237, 0.15);
		border-color: rgba(124, 58, 237, 0.3);
	}

	.filter-emoji {
		font-size: 0.75rem;
	}

	/* Contact List */
	.contact-list {
		flex: 1;
		overflow-y: auto;
	}

	.empty-list {
		display: flex;
		align-items: center;
		justify-content: center;
		height: 100%;
		font-size: 0.8125rem;
		color: rgba(255, 255, 255, 0.2);
	}
</style>
