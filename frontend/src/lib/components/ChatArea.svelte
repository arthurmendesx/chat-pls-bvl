<script lang="ts">
	import ChatMessage from './ChatMessage.svelte';
	import { chatStore } from '$lib/stores/chat';
	import { api } from '$lib/services/api';
	import { tick } from 'svelte';

	let messageText = $state('');
	let isSending = $state(false);
	let messagesContainer: HTMLDivElement | undefined = $state();

	// Auto scroll to bottom when messages change
	$effect(() => {
		if ($chatStore.messages.length && messagesContainer) {
			tick().then(() => {
				messagesContainer?.scrollTo({ top: messagesContainer.scrollHeight, behavior: 'smooth' });
			});
		}
	});

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

<section class="chat-area">
	{#if $chatStore.isLoading}
		<!-- Loading Skeleton -->
		<div class="chat-loading">
			<div class="skeleton-header">
				<div class="skeleton-circle"></div>
				<div class="skeleton-lines">
					<div class="skeleton-line w-32"></div>
					<div class="skeleton-line w-20"></div>
				</div>
			</div>
			<div class="chat-loading-body">
				<div class="loading-spinner"></div>
			</div>
		</div>
	{:else if !$chatStore.session}
		<!-- Empty State -->
		<div class="empty-state">
			<div class="empty-icon">
				<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.2">
					<path stroke-linecap="round" stroke-linejoin="round" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
				</svg>
			</div>
			<h3>Selecione uma conversa</h3>
			<p>Escolha um contato à esquerda para visualizar o histórico de mensagens.</p>
		</div>
	{:else}
		<!-- Chat Header -->
		<div class="chat-header">
			<div class="chat-header-left">
				<div class="chat-avatar">
					{($chatStore.session.contact.name || $chatStore.session.contact.phone || '??').substring(0, 2).toUpperCase()}
				</div>
				<div class="chat-header-info">
					<h2>{$chatStore.session.contact.name || 'Desconhecido'}</h2>
					<span class="chat-header-phone">{$chatStore.session.contact.phone}</span>
				</div>
			</div>
			<div class="chat-header-status" class:status-bot={$chatStore.session.status === 'BOT'} class:status-active={$chatStore.session.status === 'ACTIVE'} class:status-waiting={$chatStore.session.status === 'WAITING'}>
				{$chatStore.session.status}
			</div>
		</div>

		<!-- Messages Area -->
		<div class="messages-area custom-scrollbar" bind:this={messagesContainer}>
			{#if $chatStore.messages.length === 0}
				<div class="no-messages">
					<span>Nenhuma mensagem nesta sessão.</span>
				</div>
			{:else}
				{#each $chatStore.messages as message (message.id)}
					<ChatMessage {message} />
				{/each}
			{/if}
		</div>

		<!-- Message Input -->
		<div class="input-bar">
			<!-- Attach button -->
			<button type="button" aria-label="Anexar arquivo" class="attach-btn">
				<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" class="attach-icon">
					<path fill-rule="evenodd" d="M15.621 4.379a3 3 0 00-4.242 0l-7 7a3 3 0 004.241 4.243h.001l.497-.5a.75.75 0 011.064 1.057l-.498.501-.002.002a4.5 4.5 0 01-6.364-6.364l7-7a4.5 4.5 0 016.368 6.36l-3.455 3.553A2.625 2.625 0 119.52 9.52l3.45-3.451a.75.75 0 111.061 1.06l-3.45 3.451a1.125 1.125 0 001.587 1.595l3.454-3.553a3 3 0 000-4.242z" clip-rule="evenodd" />
				</svg>
			</button>

			<!-- Text Input -->
			<input
				type="text"
				placeholder="Digite sua mensagem…"
				class="message-input"
				bind:value={messageText}
				onkeydown={handleKeydown}
				disabled={isSending || $chatStore.session.status !== 'ACTIVE'}
			/>

			<!-- Send Button -->
			<button
				type="button"
				class="send-btn"
				onclick={handleSendMessage}
				disabled={isSending || !messageText.trim() || $chatStore.session.status !== 'ACTIVE'}
			>
				{#if isSending}
					<div class="send-spinner"></div>
				{:else}
					<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" class="send-icon">
						<path d="M3.105 2.289a.75.75 0 00-.826.95l1.414 4.925A1.5 1.5 0 005.135 9.25h6.115a.75.75 0 010 1.5H5.135a1.5 1.5 0 00-1.442 1.086l-1.414 4.926a.75.75 0 00.826.95 28.896 28.896 0 0015.293-7.154.75.75 0 000-1.115A28.897 28.897 0 003.105 2.289z" />
					</svg>
				{/if}
			</button>
		</div>
	{/if}
</section>

<style>
	.chat-area {
		display: flex;
		flex-direction: column;
		flex: 1;
		height: 100%;
		background: #0e0b1e;
		min-width: 0;
	}

	/* ─── Loading ─── */
	.chat-loading {
		display: flex;
		flex-direction: column;
		height: 100%;
	}

	.skeleton-header {
		display: flex;
		align-items: center;
		gap: 0.75rem;
		padding: 0.875rem 1.25rem;
		border-bottom: 1px solid rgba(255, 255, 255, 0.06);
	}

	.skeleton-circle {
		width: 40px;
		height: 40px;
		border-radius: 12px;
		background: rgba(255, 255, 255, 0.06);
		animation: pulse 1.5s ease-in-out infinite;
	}

	.skeleton-lines {
		display: flex;
		flex-direction: column;
		gap: 0.375rem;
	}

	.skeleton-line {
		height: 10px;
		border-radius: 5px;
		background: rgba(255, 255, 255, 0.06);
		animation: pulse 1.5s ease-in-out infinite;
	}

	.skeleton-line.w-32 { width: 128px; }
	.skeleton-line.w-20 { width: 80px; }

	.chat-loading-body {
		flex: 1;
		display: flex;
		align-items: center;
		justify-content: center;
	}

	.loading-spinner {
		width: 28px;
		height: 28px;
		border: 3px solid rgba(124, 58, 237, 0.15);
		border-top-color: #a78bfa;
		border-radius: 50%;
		animation: spin 0.8s linear infinite;
	}

	@keyframes pulse {
		0%, 100% { opacity: 1; }
		50% { opacity: 0.4; }
	}

	@keyframes spin {
		to { transform: rotate(360deg); }
	}

	/* ─── Empty State ─── */
	.empty-state {
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		height: 100%;
		text-align: center;
		padding: 2rem;
		gap: 0.75rem;
	}

	.empty-icon {
		width: 64px;
		height: 64px;
		border-radius: 20px;
		background: rgba(124, 58, 237, 0.1);
		border: 1px solid rgba(124, 58, 237, 0.15);
		display: flex;
		align-items: center;
		justify-content: center;
		margin-bottom: 0.5rem;
	}

	.empty-icon svg {
		width: 32px;
		height: 32px;
		color: #a78bfa;
	}

	.empty-state h3 {
		font-size: 1rem;
		font-weight: 600;
		color: rgba(255, 255, 255, 0.6);
		margin: 0;
	}

	.empty-state p {
		font-size: 0.8125rem;
		color: rgba(255, 255, 255, 0.25);
		max-width: 280px;
		line-height: 1.5;
		margin: 0;
	}

	/* ─── Chat Header ─── */
	.chat-header {
		display: flex;
		align-items: center;
		justify-content: space-between;
		padding: 0.75rem 1.25rem;
		border-bottom: 1px solid rgba(255, 255, 255, 0.06);
		background: rgba(255, 255, 255, 0.02);
		flex-shrink: 0;
	}

	.chat-header-left {
		display: flex;
		align-items: center;
		gap: 0.75rem;
	}

	.chat-avatar {
		width: 40px;
		height: 40px;
		border-radius: 12px;
		background: linear-gradient(135deg, #7c3aed, #6d28d9);
		display: flex;
		align-items: center;
		justify-content: center;
		font-size: 0.8125rem;
		font-weight: 700;
		color: #fff;
	}

	.chat-header-info {
		display: flex;
		flex-direction: column;
	}

	.chat-header-info h2 {
		font-size: 0.875rem;
		font-weight: 600;
		color: #e2e8f0;
		margin: 0;
	}

	.chat-header-phone {
		font-size: 0.6875rem;
		color: rgba(255, 255, 255, 0.3);
	}

	.chat-header-status {
		font-size: 0.625rem;
		font-weight: 700;
		text-transform: uppercase;
		letter-spacing: 0.05em;
		padding: 3px 10px;
		border-radius: 6px;
	}

	.chat-header-status.status-bot {
		background: rgba(124, 58, 237, 0.15);
		color: #a78bfa;
	}

	.chat-header-status.status-active {
		background: rgba(52, 211, 153, 0.12);
		color: #34d399;
	}

	.chat-header-status.status-waiting {
		background: rgba(251, 191, 36, 0.12);
		color: #fbbf24;
	}

	/* ─── Messages Area ─── */
	.messages-area {
		flex: 1;
		overflow-y: auto;
		padding: 1.25rem 1.25rem;
		display: flex;
		flex-direction: column;
		gap: 0.5rem;
	}

	.no-messages {
		display: flex;
		align-items: center;
		justify-content: center;
		height: 100%;
		font-size: 0.8125rem;
		color: rgba(255, 255, 255, 0.2);
	}

	/* ─── Input Bar ─── */
	.input-bar {
		display: flex;
		align-items: center;
		gap: 0.5rem;
		padding: 0.75rem 1rem;
		border-top: 1px solid rgba(255, 255, 255, 0.06);
		background: rgba(255, 255, 255, 0.02);
		flex-shrink: 0;
	}

	.attach-btn {
		display: flex;
		align-items: center;
		justify-content: center;
		width: 38px;
		height: 38px;
		border-radius: 10px;
		background: transparent;
		border: 1px solid rgba(255, 255, 255, 0.08);
		cursor: pointer;
		transition: all 0.2s;
		color: rgba(255, 255, 255, 0.3);
		flex-shrink: 0;
	}

	.attach-btn:hover {
		background: rgba(255, 255, 255, 0.04);
		color: rgba(255, 255, 255, 0.5);
	}

	.attach-icon {
		width: 16px;
		height: 16px;
	}

	.message-input {
		flex: 1;
		padding: 0.6rem 1rem;
		font-size: 0.8125rem;
		color: #e2e8f0;
		background: rgba(255, 255, 255, 0.04);
		border: 1px solid rgba(255, 255, 255, 0.08);
		border-radius: 12px;
		outline: none;
		transition: all 0.2s;
		font-family: inherit;
	}

	.message-input::placeholder {
		color: rgba(255, 255, 255, 0.2);
	}

	.message-input:focus {
		border-color: rgba(124, 58, 237, 0.4);
		box-shadow: 0 0 0 3px rgba(124, 58, 237, 0.1);
		background: rgba(255, 255, 255, 0.06);
	}

	.message-input:disabled {
		opacity: 0.4;
		cursor: not-allowed;
	}

	.send-btn {
		display: flex;
		align-items: center;
		justify-content: center;
		width: 38px;
		height: 38px;
		border-radius: 10px;
		background: linear-gradient(135deg, #7c3aed, #6d28d9);
		border: none;
		cursor: pointer;
		transition: all 0.2s;
		color: #fff;
		flex-shrink: 0;
		box-shadow: 0 2px 8px rgba(124, 58, 237, 0.3);
	}

	.send-btn:hover:not(:disabled) {
		background: linear-gradient(135deg, #8b5cf6, #7c3aed);
		box-shadow: 0 4px 12px rgba(124, 58, 237, 0.4);
	}

	.send-btn:disabled {
		opacity: 0.35;
		cursor: not-allowed;
	}

	.send-icon {
		width: 16px;
		height: 16px;
	}

	.send-spinner {
		width: 16px;
		height: 16px;
		border: 2px solid rgba(255, 255, 255, 0.25);
		border-top-color: #fff;
		border-radius: 50%;
		animation: spin 0.7s linear infinite;
	}
</style>
