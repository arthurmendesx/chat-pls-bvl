<script lang="ts">
	import type { Contact } from '$lib/types';
	import { SessionStatus } from '$lib/types';

	interface Props {
		contact: Contact;
		status?: SessionStatus;
		isActive?: boolean;
		lastMessage?: string;
		onclick?: () => void;
	}

	let { contact, status, isActive = false, lastMessage = '', onclick }: Props = $props();

	const initials = $derived((contact.name || contact.phone || '??').substring(0, 2).toUpperCase());

	const statusConfig = $derived.by(() => {
		switch (status) {
			case SessionStatus.BOT:
				return { label: 'Bot', color: '#a78bfa', bg: 'rgba(124,58,237,0.15)' };
			case SessionStatus.WAITING:
				return { label: 'Espera', color: '#fbbf24', bg: 'rgba(251,191,36,0.12)' };
			case SessionStatus.ACTIVE:
				return { label: 'Ativo', color: '#34d399', bg: 'rgba(52,211,153,0.12)' };
			case SessionStatus.CLOSED:
				return { label: 'Fechado', color: '#94a3b8', bg: 'rgba(148,163,184,0.1)' };
			default:
				return { label: '', color: '#94a3b8', bg: 'transparent' };
		}
	});
</script>

<button
	type="button"
	class="contact-item"
	class:active={isActive}
	onclick={onclick}
>
	<!-- Avatar -->
	<div class="avatar-wrapper">
		<div class="avatar">
			{initials}
		</div>
		{#if status}
			<span class="status-dot" style:background={statusConfig.color}></span>
		{/if}
	</div>

	<!-- Info -->
	<div class="contact-info">
		<div class="contact-top">
			<span class="contact-name">{contact.name || contact.phone}</span>
			{#if status}
				<span class="status-badge" style:color={statusConfig.color} style:background={statusConfig.bg}>
					{statusConfig.label}
				</span>
			{/if}
		</div>
		<span class="contact-phone">{contact.phone}</span>
		<span class="last-msg">{lastMessage || 'Sem mensagens'}</span>
	</div>
</button>

<style>
	.contact-item {
		display: flex;
		align-items: center;
		gap: 0.75rem;
		width: 100%;
		padding: 0.875rem 1.125rem;
		text-align: left;
		cursor: pointer;
		border: none;
		border-bottom: 1px solid rgba(255, 255, 255, 0.04);
		background: transparent;
		transition: all 0.15s;
		font-family: inherit;
	}

	.contact-item:hover {
		background: rgba(255, 255, 255, 0.03);
	}

	.contact-item.active {
		background: rgba(124, 58, 237, 0.08);
		border-left: 3px solid #a78bfa;
	}

	/* Avatar */
	.avatar-wrapper {
		position: relative;
		flex-shrink: 0;
	}

	.avatar {
		width: 42px;
		height: 42px;
		border-radius: 12px;
		background: linear-gradient(135deg, #7c3aed, #6d28d9);
		display: flex;
		align-items: center;
		justify-content: center;
		font-size: 0.8125rem;
		font-weight: 700;
		color: #fff;
	}

	.status-dot {
		position: absolute;
		bottom: -1px;
		right: -1px;
		width: 10px;
		height: 10px;
		border-radius: 50%;
		border: 2px solid #0e0b1e;
	}

	/* Info */
	.contact-info {
		flex: 1;
		min-width: 0;
		display: flex;
		flex-direction: column;
		gap: 0.125rem;
	}

	.contact-top {
		display: flex;
		align-items: center;
		justify-content: space-between;
		gap: 0.5rem;
	}

	.contact-name {
		font-size: 0.8125rem;
		font-weight: 600;
		color: #e2e8f0;
		overflow: hidden;
		text-overflow: ellipsis;
		white-space: nowrap;
	}

	.status-badge {
		font-size: 0.5625rem;
		font-weight: 700;
		text-transform: uppercase;
		letter-spacing: 0.04em;
		padding: 2px 6px;
		border-radius: 5px;
		flex-shrink: 0;
	}

	.contact-phone {
		font-size: 0.6875rem;
		color: rgba(255, 255, 255, 0.3);
	}

	.last-msg {
		font-size: 0.75rem;
		color: rgba(255, 255, 255, 0.2);
		overflow: hidden;
		text-overflow: ellipsis;
		white-space: nowrap;
		margin-top: 0.125rem;
	}
</style>
