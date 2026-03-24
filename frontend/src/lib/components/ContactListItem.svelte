<script lang="ts">
	import type { Contact } from '$lib/types';

	interface Props {
		contact: Contact;
		isActive?: boolean;
		lastMessage?: string;
		onclick?: () => void;
	}

	let { contact, isActive = false, lastMessage = '', onclick }: Props = $props();

	const initials = $derived((contact.name || contact.phone || '??').substring(0, 2).toUpperCase());
	// Simula a cor usando o gradiente do design system
	const avatarColor = 'bg-gradient-to-br from-blue-500 to-blue-700'; 
</script>

<button
	type="button"
	class="flex w-full cursor-pointer items-start gap-3 border-b border-gray-100 px-4 py-3 text-left transition-colors hover:bg-slate-50 {isActive
		? 'border-l-3 border-l-blue-600 bg-blue-50'
		: ''}"
	onclick={onclick}
>
	<!-- Avatar -->
	<div class="relative shrink-0">
		<div
			class="{avatarColor} flex h-10 w-10 items-center justify-center rounded-full text-sm font-semibold text-white"
		>
			{initials}
		</div>
	</div>

	<!-- Info -->
	<div class="min-w-0 flex-1">
		<p class="truncate text-sm font-semibold text-gray-900">{contact.name || contact.phone}</p>
		<p class="text-xs text-gray-500">{contact.phone}</p>
		<p class="mt-0.5 truncate text-xs text-gray-400">{lastMessage || 'Sem mensagens'}</p>
	</div>
</button>
