<script lang="ts">
	import type { Contact, Conversation } from '$lib/types';
	import { ContactFilter } from '$lib/types';
	import ContactListItem from './ContactListItem.svelte';

	interface Props {
		contacts: Contact[];
		activeContactId: string;
		onSelectContact?: (contact: Contact) => void;
	}

	let { contacts, activeContactId, onSelectContact }: Props = $props();

	let activeFilter = $state<ContactFilter>(ContactFilter.ALL);
	let searchQuery = $state('');

	const filters: { label: string; value: ContactFilter }[] = [
		{ label: 'All', value: ContactFilter.ALL },
		{ label: 'Bot', value: ContactFilter.BOT },
		{ label: 'Waiting', value: ContactFilter.WAITING },
		{ label: 'Mine', value: ContactFilter.MINE }
	];
</script>

<aside class="flex h-full w-80 flex-col border-r border-gray-200 bg-white">
	<!-- Logo -->
	<div class="flex items-center gap-2 border-b border-gray-200 px-4 py-4">
		<div class="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-600 text-white">
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
				placeholder="Search contacts..."
				class="w-full rounded-lg border border-gray-200 py-2 pl-9 pr-3 text-sm text-gray-900 placeholder-gray-400 focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500"
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
					? 'bg-emerald-600 text-white'
					: 'bg-gray-100 text-gray-600 hover:bg-gray-200'}"
				onclick={() => (activeFilter = filter.value)}
			>
				{filter.label}
			</button>
		{/each}
	</div>

	<!-- Contact List -->
	<div class="custom-scrollbar flex-1 overflow-y-auto">
		{#each contacts as contact (contact.id)}
			<ContactListItem
				{contact}
				isActive={contact.id === activeContactId}
				onclick={() => onSelectContact?.(contact)}
			/>
		{/each}
	</div>
</aside>
