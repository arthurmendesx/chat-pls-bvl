<script lang="ts">
	import { chatStore } from '$lib/stores/chat';
	import { api } from '$lib/services/api';
	import { SessionStatus } from '$lib/types';

	let isUpdating = $state(false);

	async function updateStatus(newStatus: SessionStatus) {
		if (!$chatStore.session || isUpdating) return;

		try {
			isUpdating = true;
			const updated = await api.updateSessionStatus($chatStore.session.id, newStatus);
			// Atualiza o store da sessão localmente para refletir a mudança instantaneamente
			chatStore.setActiveSession(updated, $chatStore.messages);
		} catch (error) {
			alert(error instanceof Error ? error.message : 'Falha ao atualizar o status');
		} finally {
			isUpdating = false;
		}
	}
</script>

{#if $chatStore.session}
	<aside class="profile-panel">
		<!-- Contact Info -->
		<div class="profile-header">
			<div class="profile-avatar">
				{($chatStore.session.contact.name || $chatStore.session.contact.phone || '??').substring(0, 2).toUpperCase()}
			</div>
			<h2 class="profile-name">{$chatStore.session.contact.name || 'Desconhecido'}</h2>
			<span class="profile-phone">{$chatStore.session.contact.phone}</span>
			<div class="profile-status" class:st-bot={$chatStore.session.status === 'BOT'} class:st-active={$chatStore.session.status === 'ACTIVE'} class:st-waiting={$chatStore.session.status === 'WAITING'} class:st-closed={$chatStore.session.status === 'CLOSED'}>
				{$chatStore.session.status}
			</div>
		</div>

		<!-- Action Buttons -->
		<div class="actions-section">
			<h3 class="section-title">Ações</h3>

			<!-- Take over chat -->
			{#if $chatStore.session.status !== SessionStatus.ACTIVE}
				<button
					type="button"
					onclick={() => updateStatus(SessionStatus.ACTIVE)}
					disabled={isUpdating}
					class="action-btn action-primary"
				>
					<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" class="action-icon">
						<path fill-rule="evenodd" d="M10 1a.75.75 0 01.75.75v1.5a.75.75 0 01-1.5 0v-1.5A.75.75 0 0110 1zM5.05 3.05a.75.75 0 011.06 0l1.062 1.06a.75.75 0 11-1.061 1.061l-1.06-1.06a.75.75 0 010-1.06zm9.9 0a.75.75 0 010 1.06l-1.06 1.061a.75.75 0 01-1.062-1.06l1.061-1.06a.75.75 0 011.06 0zM3 8a.75.75 0 01.75-.75h1.5a.75.75 0 010 1.5h-1.5A.75.75 0 013 8zm11 0a.75.75 0 01.75-.75h1.5a.75.75 0 010 1.5h-1.5A.75.75 0 0114 8zm-6.828 2.828a.75.75 0 010 1.061L6.11 12.95a.75.75 0 01-1.06-1.06l1.06-1.06a.75.75 0 011.061 0zm6.364-6.364a.75.75 0 010 1.06L12.475 6.586a.75.75 0 11-1.061-1.06l1.06-1.061a.75.75 0 011.061 0zM10 14a.75.75 0 01.75.75v1.5a.75.75 0 01-1.5 0v-1.5A.75.75 0 0110 14z" clip-rule="evenodd" />
					</svg>
					{isUpdating ? 'Aguarde…' : 'Assumir Atendimento'}
				</button>
			{/if}

			<!-- Return to Bot -->
			<button
				type="button"
				onclick={() => updateStatus(SessionStatus.BOT)}
				disabled={isUpdating}
				class="action-btn action-secondary"
			>
				<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" class="action-icon">
					<path stroke-linecap="round" stroke-linejoin="round" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"></path>
				</svg>
				Retornar ao Bot
			</button>

			<!-- End Session -->
			{#if $chatStore.session.status !== SessionStatus.CLOSED}
				<button
					type="button"
					onclick={() => updateStatus(SessionStatus.CLOSED)}
					disabled={isUpdating}
					class="action-btn action-danger"
				>
					<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" class="action-icon">
						<path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.28 7.22a.75.75 0 00-1.06 1.06L8.94 10l-1.72 1.72a.75.75 0 101.06 1.06L10 11.06l1.72 1.72a.75.75 0 101.06-1.06L11.06 10l1.72-1.72a.75.75 0 00-1.06-1.06L10 8.94 8.28 7.22z" clip-rule="evenodd" />
					</svg>
					{isUpdating ? 'Aguarde…' : 'Encerrar Sessão'}
				</button>
			{/if}
		</div>

		<!-- Internal Notes -->
		<div class="notes-section">
			<h3 class="section-title">Notas Internas</h3>
			<p class="notes-hint">Não visível ao cliente</p>
			<textarea
				placeholder="Adicione notas sobre este atendimento…"
				class="notes-textarea"
			></textarea>
			<button type="button" class="save-note-btn">
				Salvar Nota
			</button>
		</div>
	</aside>
{/if}

<style>
	.profile-panel {
		display: flex;
		flex-direction: column;
		width: 300px;
		height: 100%;
		border-left: 1px solid rgba(255, 255, 255, 0.06);
		background: rgba(255, 255, 255, 0.02);
		flex-shrink: 0;
		overflow-y: auto;
	}

	/* ─── Header ─── */
	.profile-header {
		display: flex;
		flex-direction: column;
		align-items: center;
		padding: 1.75rem 1.25rem 1.25rem;
		border-bottom: 1px solid rgba(255, 255, 255, 0.06);
	}

	.profile-avatar {
		width: 64px;
		height: 64px;
		border-radius: 18px;
		background: linear-gradient(135deg, #7c3aed, #6d28d9);
		display: flex;
		align-items: center;
		justify-content: center;
		font-size: 1.25rem;
		font-weight: 700;
		color: #fff;
		margin-bottom: 0.75rem;
		box-shadow: 0 4px 16px rgba(124, 58, 237, 0.3);
	}

	.profile-name {
		font-size: 1rem;
		font-weight: 600;
		color: #e2e8f0;
		margin: 0;
	}

	.profile-phone {
		font-size: 0.75rem;
		color: rgba(255, 255, 255, 0.35);
		margin-top: 0.25rem;
	}

	.profile-status {
		margin-top: 0.75rem;
		font-size: 0.625rem;
		font-weight: 700;
		text-transform: uppercase;
		letter-spacing: 0.06em;
		padding: 3px 12px;
		border-radius: 6px;
	}

	.st-bot {
		background: rgba(124, 58, 237, 0.15);
		color: #a78bfa;
	}

	.st-active {
		background: rgba(52, 211, 153, 0.12);
		color: #34d399;
	}

	.st-waiting {
		background: rgba(251, 191, 36, 0.12);
		color: #fbbf24;
	}

	.st-closed {
		background: rgba(148, 163, 184, 0.1);
		color: #94a3b8;
	}

	/* ─── Section Title ─── */
	.section-title {
		font-size: 0.6875rem;
		font-weight: 700;
		text-transform: uppercase;
		letter-spacing: 0.06em;
		color: rgba(255, 255, 255, 0.35);
		margin: 0 0 0.75rem;
	}

	/* ─── Actions ─── */
	.actions-section {
		padding: 1.25rem;
		border-bottom: 1px solid rgba(255, 255, 255, 0.06);
		display: flex;
		flex-direction: column;
		gap: 0.5rem;
	}

	.action-btn {
		display: flex;
		align-items: center;
		justify-content: center;
		gap: 0.5rem;
		width: 100%;
		padding: 0.6rem;
		font-size: 0.8125rem;
		font-weight: 600;
		font-family: inherit;
		border-radius: 10px;
		cursor: pointer;
		transition: all 0.2s;
		border: 1px solid transparent;
	}

	.action-btn:disabled {
		opacity: 0.4;
		cursor: not-allowed;
	}

	.action-icon {
		width: 16px;
		height: 16px;
	}

	.action-primary {
		background: linear-gradient(135deg, #7c3aed, #6d28d9);
		color: #fff;
		box-shadow: 0 2px 8px rgba(124, 58, 237, 0.3);
	}

	.action-primary:hover:not(:disabled) {
		box-shadow: 0 4px 12px rgba(124, 58, 237, 0.4);
	}

	.action-secondary {
		background: rgba(255, 255, 255, 0.04);
		border-color: rgba(255, 255, 255, 0.08);
		color: rgba(255, 255, 255, 0.6);
	}

	.action-secondary:hover:not(:disabled) {
		background: rgba(255, 255, 255, 0.06);
		color: rgba(255, 255, 255, 0.8);
	}

	.action-danger {
		background: rgba(239, 68, 68, 0.08);
		border-color: rgba(239, 68, 68, 0.15);
		color: #f87171;
	}

	.action-danger:hover:not(:disabled) {
		background: rgba(239, 68, 68, 0.12);
	}

	/* ─── Notes ─── */
	.notes-section {
		padding: 1.25rem;
		display: flex;
		flex-direction: column;
		flex: 1;
	}

	.notes-hint {
		font-size: 0.6875rem;
		color: rgba(255, 255, 255, 0.2);
		margin: -0.5rem 0 0.75rem;
	}

	.notes-textarea {
		flex: 1;
		min-height: 100px;
		resize: none;
		padding: 0.75rem;
		font-size: 0.8125rem;
		color: #e2e8f0;
		background: rgba(255, 255, 255, 0.04);
		border: 1px solid rgba(255, 255, 255, 0.08);
		border-radius: 10px;
		outline: none;
		transition: all 0.2s;
		font-family: inherit;
	}

	.notes-textarea::placeholder {
		color: rgba(255, 255, 255, 0.15);
	}

	.notes-textarea:focus {
		border-color: rgba(124, 58, 237, 0.4);
		box-shadow: 0 0 0 3px rgba(124, 58, 237, 0.1);
	}

	.save-note-btn {
		margin-top: 0.75rem;
		width: 100%;
		padding: 0.6rem;
		font-size: 0.8125rem;
		font-weight: 600;
		font-family: inherit;
		color: rgba(255, 255, 255, 0.7);
		background: rgba(255, 255, 255, 0.06);
		border: 1px solid rgba(255, 255, 255, 0.1);
		border-radius: 10px;
		cursor: pointer;
		transition: all 0.2s;
	}

	.save-note-btn:hover {
		background: rgba(255, 255, 255, 0.08);
		color: #fff;
	}
</style>
