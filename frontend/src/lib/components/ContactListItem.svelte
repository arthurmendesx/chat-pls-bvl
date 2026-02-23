<script lang="ts">
	import type { Contact } from '$lib/types';

	interface Props {
		contact: Contact;
		isActive?: boolean;
		onclick?: () => void;
	}

	let { contact, isActive = false, onclick }: Props = $props();
</script>

<button
	type="button"
	class="flex w-full cursor-pointer items-start gap-3 border-b border-gray-100 px-4 py-3 text-left transition-colors hover:bg-gray-50 {isActive
		? 'border-l-3 border-l-emerald-600 bg-emerald-50'
		: ''}"
	onclick={onclick}
>
	<!-- Avatar -->
	<div class="relative shrink-0">
		<div
			class="{contact.avatarColor} flex h-10 w-10 items-center justify-center rounded-full text-sm font-semibold text-white"
		>
			{contact.initials}
		</div>
		{#if contact.isOnline}
			<span
				class="absolute -bottom-0 -right-0 h-2.5 w-2.5 rounded-full border-2 border-white bg-emerald-500"
			></span>
		{/if}
	</div>

	<!-- Info -->
	<div class="min-w-0 flex-1">
		<p class="truncate text-sm font-semibold text-gray-900">{contact.name}</p>
		<p class="text-xs text-gray-500">{contact.phone}</p>
		<p class="mt-0.5 truncate text-xs text-gray-400">{contact.lastMessage}</p>
	</div>
</button>
