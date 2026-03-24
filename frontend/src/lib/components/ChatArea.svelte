<script lang="ts">
	import ChatMessage from './ChatMessage.svelte';
	import { chatStore } from '$lib/stores/chat';
	import { api } from '$lib/services/api';

	let messageText = $state('');
	let isSending = $state(false);

	async function handleSendMessage() {
		if (!messageText.trim() || !$chatStore.session || isSending) return;

		try {
			isSending = true;
			const sentMessage = await api.sendMessage($chatStore.session.id, messageText);
			chatStore.appendMessage(sentMessage);
			messageText = '';
		} catch (error) {
			alert('Falha ao enviar mensagem.');
		} finally {
			isSending = false;
		}
	}

	function handleKeydown(e: KeyboardEvent) {
		if (e.key === 'Enter' && !e.shiftKey) {
			e.preventDefault();
			handleSendMessage();
		}
	}
</script>

<section class="flex h-full flex-1 flex-col bg-slate-50">
	{#if $chatStore.isLoading}
		<!-- Loading Skeleton -->
		<div class="flex flex-1 flex-col space-y-4">
			<div class="flex animate-pulse items-center gap-3 border-b border-gray-100 bg-white px-6 py-3">
				<div class="h-10 w-10 rounded-full bg-gray-200"></div>
				<div class="space-y-2">
					<div class="h-4 w-32 rounded bg-gray-200"></div>
					<div class="h-3 w-20 rounded bg-gray-200"></div>
				</div>
			</div>
			<div class="flex flex-1 items-center justify-center">
				<div class="h-8 w-8 animate-spin rounded-full border-4 border-blue-600 border-t-transparent"></div>
			</div>
		</div>
	{:else if !$chatStore.session}
		<div class="flex flex-1 items-center justify-center">
			<span class="text-sm text-gray-500">Selecione um contato para iniciar o atendimento</span>
		</div>
	{:else}
		<!-- Chat Header -->
		<div class="flex items-center gap-3 border-b border-gray-200 bg-white px-6 py-3">
			<div
				class="bg-gradient-to-br from-blue-500 to-blue-700 flex h-10 w-10 items-center justify-center rounded-full text-sm font-semibold text-white"
			>
				{($chatStore.session.contact.name || $chatStore.session.contact.phone || '??').substring(0, 2).toUpperCase()}
			</div>
			<div>
				<h2 class="text-sm font-semibold text-gray-900">{$chatStore.session.contact.name || 'Desconhecido'}</h2>
				<p class="text-xs font-medium text-amber-500">
					Status: {$chatStore.session.status}
				</p>
			</div>
		</div>

		<!-- Messages Area -->
		<div class="custom-scrollbar flex-1 space-y-4 overflow-y-auto px-6 py-4">
			{#if $chatStore.messages.length === 0}
				<div class="flex h-full items-center justify-center">
					<span class="text-sm text-gray-500">Nenhuma mensagem encontrada para este atendimento.</span>
				</div>
			{:else}
				{#each $chatStore.messages as message (message.id)}
					<ChatMessage {message} />
				{/each}
			{/if}
		</div>

		<!-- Message Input -->
		<div class="flex items-center gap-3 border-t border-gray-200 bg-white px-4 py-3">
			<!-- Attach button (mock) -->
			<button type="button" aria-label="Anexar arquivo" class="shrink-0 text-gray-400 transition-colors hover:text-gray-600">
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
				placeholder="Digite sua mensagem..."
				class="flex-1 rounded-full border border-gray-300 px-4 py-2.5 text-sm text-gray-900 placeholder-gray-400 focus:border-blue-600 focus:outline-none focus:ring-1 focus:ring-blue-600 disabled:opacity-50"
				bind:value={messageText}
				onkeydown={handleKeydown}
				disabled={isSending || $chatStore.session.status !== 'ACTIVE'}
			/>

			<!-- Send button -->
			<button
				type="button"
				class="flex shrink-0 items-center gap-1.5 rounded-full bg-blue-600 shadow-sm hover:shadow-md px-4 py-2.5 text-sm font-medium text-white transition-all hover:bg-blue-700 disabled:opacity-50"
				onclick={handleSendMessage}
				disabled={isSending || $chatStore.session.status !== 'ACTIVE'}
			>
				<svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
					<path
						stroke-linecap="round"
						stroke-linejoin="round"
						stroke-width="2"
						d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"
					></path>
				</svg>
				{isSending ? 'Enviando...' : 'Enviar'}
			</button>
		</div>
	{/if}
</section>
