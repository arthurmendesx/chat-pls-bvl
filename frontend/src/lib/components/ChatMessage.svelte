<script lang="ts">
	import type { Message } from '$lib/types';
	import { SenderType } from '$lib/types';

	interface Props {
		message: Message;
	}

	let { message }: Props = $props();

	const isBot = $derived(message.senderType === SenderType.BOT);
	const isContact = $derived(message.senderType === SenderType.CONTACT);
	
	const displayTime = $derived(
		new Date(message.createdAt).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })
	);
</script>

<div class="flex flex-col {isContact ? 'items-start' : 'items-end'}">
	<!-- Bubble -->
	<div
		class="max-w-lg shadow-sm px-4 py-3 {isContact
			? 'bg-white text-gray-900 rounded-2xl rounded-bl-none'
			: 'bg-blue-600 text-white rounded-2xl rounded-br-none'}"
	>
		{#if isBot}
			<div class="mb-1 flex items-center gap-1 text-xs font-medium text-blue-100">
				<svg
					class="h-3.5 w-3.5"
					fill="none"
					stroke="currentColor"
					viewBox="0 0 24 24"
					xmlns="http://www.w3.org/2000/svg"
				>
					<path
						stroke-linecap="round"
						stroke-linejoin="round"
						stroke-width="2"
						d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"
					></path>
				</svg>
				Bot
			</div>
		{/if}
		<p class="text-sm leading-relaxed">{message.content}</p>
	</div>

	<!-- Timestamp -->
	<span class="mt-1 text-xs text-gray-400">{displayTime}</span>
</div>
