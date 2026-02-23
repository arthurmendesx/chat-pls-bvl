<script lang="ts">
	import type { Conversation } from '$lib/types';
	import ChatMessage from './ChatMessage.svelte';

	interface Props {
		conversation: Conversation;
	}

	let { conversation }: Props = $props();
</script>

<section class="flex h-full flex-1 flex-col bg-gray-50">
	<!-- Chat Header -->
	<div class="flex items-center gap-3 border-b border-gray-200 bg-white px-6 py-3">
		<div
			class="{conversation.contact.avatarColor} flex h-10 w-10 items-center justify-center rounded-full text-sm font-semibold text-white"
		>
			{conversation.contact.initials}
		</div>
		<div>
			<h2 class="text-sm font-semibold text-gray-900">{conversation.contact.name}</h2>
			<p class="text-xs font-medium text-amber-500">{conversation.waitingTime}</p>
		</div>
	</div>

	<!-- Messages Area -->
	<div class="custom-scrollbar flex-1 space-y-4 overflow-y-auto px-6 py-4">
		{#each conversation.messages as message (message.id)}
			<ChatMessage {message} />
		{/each}
	</div>

	<!-- Message Input -->
	<div class="flex items-center gap-3 border-t border-gray-200 bg-white px-4 py-3">
		<!-- Attach button -->
		<button type="button" class="shrink-0 text-gray-400 transition-colors hover:text-gray-600">
			<svg class="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
				<path
					stroke-linecap="round"
					stroke-linejoin="round"
					stroke-width="2"
					d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13"
				></path>
			</svg>
		</button>

		<!-- Input -->
		<input
			type="text"
			placeholder="Type your message..."
			class="flex-1 rounded-full border border-gray-300 px-4 py-2.5 text-sm text-gray-900 placeholder-gray-400 focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500"
		/>

		<!-- Send button -->
		<button
			type="button"
			class="flex shrink-0 items-center gap-1.5 rounded-lg bg-emerald-600 px-4 py-2.5 text-sm font-medium text-white transition-colors hover:bg-emerald-700"
		>
			<svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
				<path
					stroke-linecap="round"
					stroke-linejoin="round"
					stroke-width="2"
					d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"
				></path>
			</svg>
			Send
		</button>
	</div>
</section>
