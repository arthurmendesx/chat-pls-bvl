<script lang="ts">
	import { onMount } from 'svelte';
	import Sidebar from '$lib/components/Sidebar.svelte';
	import ChatArea from '$lib/components/ChatArea.svelte';
	import ContactProfile from '$lib/components/ContactProfile.svelte';
	import { api } from '$lib/services/api';
	import { supabase } from '$lib/services/supabaseClient';
	import { sessionsStore } from '$lib/stores/sessions';
	import { chatStore } from '$lib/stores/chat';
	import { auth } from '$lib/stores/auth.svelte';
	import { SessionStatus, type Message, type Session } from '$lib/types';

	function handleLogout() {
		auth.logout();
		window.location.href = '/login';
	}

	let loading = $state(true);
	let error = $state('');

	// Carrega todas as sessões baseadas nos 3 status que suportamos
	async function loadAllSessions() {
		try {
			loading = true;
			const bot = await api.fetchSessions(SessionStatus.BOT);
			const waiting = await api.fetchSessions(SessionStatus.WAITING);
			const active = await api.fetchSessions(SessionStatus.ACTIVE);

			// Consolida todos e manda pro store (que possui ordenação automática por updatedAt)
			sessionsStore.setSessions([...bot, ...waiting, ...active]);
		} catch (err) {
			error = err instanceof Error ? err.message : 'Falha fatal ao carregar o sistema.';
		} finally {
			loading = false;
		}
	}

	onMount(() => {
		// 1. Carga Inicial
		loadAllSessions();

		// 2. Subscrições Realtime - Tabela de Mensagens
		const messageSubscription = supabase
			.channel('public:Message')
			.on(
				'postgres_changes',
				{ event: 'INSERT', schema: 'public', table: 'Message' },
				(payload) => {
					// Quando o n8n ou o cliente enviam mensagem, injetamos no chat em tempo real
					chatStore.appendMessage(payload.new as Message);
					// Nota: Numa aplicação real, a API backend deveria nos avisar das sessões, mas
					// como pedimos Realtime puro pelo Supabase, também re-buscamos se não tivermos
					// a sessão correspondente no store.
				}
			)
			.subscribe();

		// 3. Subscrições Realtime - Tabela de Sessões
		const sessionSubscription = supabase
			.channel('public:Session')
			.on(
				'postgres_changes',
				{ event: '*', schema: 'public', table: 'Session' },
				(payload) => {
					// Quando o status muda (Ex: BOT -> WAITING), re-buscamos a tabela inteira
					// ou poderíamos apenas atualizar localmente. Vamos chamar a carga global
					// para garantir integridade do contact join.
					loadAllSessions();
				}
			)
			.subscribe();

		return () => {
			supabase.removeChannel(messageSubscription);
			supabase.removeChannel(sessionSubscription);
		};
	});
</script>

<svelte:head>
	<title>ChatSupport — Atendimento</title>
	<meta name="description" content="Dashboard de chat omnichannel" />
</svelte:head>

<div class="dashboard">
	<!-- Global Header -->
	<header class="dashboard-header">
		<div class="header-left">
			<div class="header-logo">
				<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" class="logo-icon">
					<circle cx="12" cy="12" r="10" />
					<ellipse cx="12" cy="12" rx="14" ry="4" transform="rotate(-30 12 12)" />
				</svg>
			</div>
			<div>
				<span class="header-title">Planeta Imaginário</span>
				<span class="header-badge">Atendimento</span>
			</div>
		</div>
		<div class="header-right">
			<div class="user-pill">
				<div class="user-avatar">
					{(auth.user?.name ?? 'A').substring(0, 1).toUpperCase()}
				</div>
				<span class="user-name">{auth.user?.name ?? 'Atendente'}</span>
			</div>
			<button class="logout-btn" onclick={handleLogout} title="Sair">
				<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" class="logout-icon">
					<path fill-rule="evenodd" d="M3 4.25A2.25 2.25 0 015.25 2h5.5A2.25 2.25 0 0113 4.25v2a.75.75 0 01-1.5 0v-2a.75.75 0 00-.75-.75h-5.5a.75.75 0 00-.75.75v11.5c0 .414.336.75.75.75h5.5a.75.75 0 00.75-.75v-2a.75.75 0 011.5 0v2A2.25 2.25 0 0110.75 18h-5.5A2.25 2.25 0 013 15.75V4.25z" clip-rule="evenodd" />
					<path fill-rule="evenodd" d="M19 10a.75.75 0 00-.75-.75H8.704l1.048-.943a.75.75 0 10-1.004-1.114l-2.5 2.25a.75.75 0 000 1.114l2.5 2.25a.75.75 0 101.004-1.114l-1.048-.943h9.546A.75.75 0 0019 10z" clip-rule="evenodd" />
				</svg>
			</button>
		</div>
	</header>

	<main class="dashboard-main">
		{#if loading}
			<div class="loading-state">
				<div class="loading-spinner"></div>
				<span>Carregando atendimentos…</span>
			</div>
		{:else if error}
			<div class="error-state">
				<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" class="error-icon">
					<path fill-rule="evenodd" d="M9.401 3.003c1.155-2 4.043-2 5.197 0l7.355 12.748c1.154 2-.29 4.5-2.599 4.5H4.645c-2.309 0-3.752-2.5-2.598-4.5L9.4 3.003zM12 8.25a.75.75 0 01.75.75v3.75a.75.75 0 01-1.5 0V9a.75.75 0 01.75-.75zm0 8.25a.75.75 0 100-1.5.75.75 0 000 1.5z" clip-rule="evenodd" />
				</svg>
				<p>{error}</p>
			</div>
		{:else}
			<Sidebar />
			<ChatArea />
			<ContactProfile />
		{/if}
	</main>
</div>

<style>
	/* ─── Dashboard Shell ─── */
	.dashboard {
		display: flex;
		flex-direction: column;
		width: 100vw;
		height: 100vh;
		overflow: hidden;
		background: #0e0b1e;
	}

	/* ─── Header ─── */
	.dashboard-header {
		display: flex;
		align-items: center;
		justify-content: space-between;
		height: 56px;
		padding: 0 1.25rem;
		background: rgba(255, 255, 255, 0.04);
		border-bottom: 1px solid rgba(255, 255, 255, 0.06);
		flex-shrink: 0;
	}

	.header-left {
		display: flex;
		align-items: center;
		gap: 0.75rem;
	}

	.header-logo {
		display: flex;
		align-items: center;
		justify-content: center;
		width: 34px;
		height: 34px;
		border-radius: 10px;
		background: linear-gradient(135deg, rgba(124, 58, 237, 0.35), rgba(45, 212, 191, 0.2));
		border: 1px solid rgba(255, 255, 255, 0.08);
	}

	.logo-icon {
		width: 20px;
		height: 20px;
		color: #c4b5fd;
	}

	.header-title {
		font-size: 0.9375rem;
		font-weight: 700;
		color: #f1f5f9;
		letter-spacing: -0.01em;
	}

	.header-badge {
		margin-left: 0.5rem;
		font-size: 0.625rem;
		font-weight: 600;
		text-transform: uppercase;
		letter-spacing: 0.06em;
		color: #a78bfa;
		background: rgba(124, 58, 237, 0.15);
		border: 1px solid rgba(124, 58, 237, 0.2);
		padding: 2px 8px;
		border-radius: 6px;
	}

	.header-right {
		display: flex;
		align-items: center;
		gap: 0.75rem;
	}

	.user-pill {
		display: flex;
		align-items: center;
		gap: 0.5rem;
		padding: 4px 12px 4px 4px;
		border-radius: 999px;
		background: rgba(255, 255, 255, 0.05);
		border: 1px solid rgba(255, 255, 255, 0.08);
	}

	.user-avatar {
		width: 28px;
		height: 28px;
		border-radius: 50%;
		background: linear-gradient(135deg, #7c3aed, #6d28d9);
		display: flex;
		align-items: center;
		justify-content: center;
		font-size: 0.75rem;
		font-weight: 700;
		color: #fff;
	}

	.user-name {
		font-size: 0.8125rem;
		font-weight: 500;
		color: rgba(255, 255, 255, 0.7);
	}

	.logout-btn {
		display: flex;
		align-items: center;
		justify-content: center;
		width: 34px;
		height: 34px;
		border-radius: 10px;
		background: rgba(239, 68, 68, 0.08);
		border: 1px solid rgba(239, 68, 68, 0.15);
		cursor: pointer;
		transition: all 0.2s;
		color: #f87171;
	}

	.logout-btn:hover {
		background: rgba(239, 68, 68, 0.15);
		border-color: rgba(239, 68, 68, 0.3);
	}

	.logout-icon {
		width: 16px;
		height: 16px;
	}

	/* ─── Main ─── */
	.dashboard-main {
		display: flex;
		flex: 1;
		overflow: hidden;
	}

	/* ─── Loading / Error States ─── */
	.loading-state,
	.error-state {
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		width: 100%;
		gap: 1rem;
		color: rgba(255, 255, 255, 0.45);
		font-size: 0.875rem;
	}

	.loading-spinner {
		width: 32px;
		height: 32px;
		border: 3px solid rgba(124, 58, 237, 0.2);
		border-top-color: #a78bfa;
		border-radius: 50%;
		animation: spin 0.8s linear infinite;
	}

	@keyframes spin {
		to { transform: rotate(360deg); }
	}

	.error-state {
		color: #f87171;
	}

	.error-icon {
		width: 40px;
		height: 40px;
		opacity: 0.6;
	}
</style>
