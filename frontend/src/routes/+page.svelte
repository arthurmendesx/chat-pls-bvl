<script lang="ts">
	import { onMount } from 'svelte';
	import Sidebar from '$lib/components/Sidebar.svelte';
	import ChatArea from '$lib/components/ChatArea.svelte';
	import ContactProfile from '$lib/components/ContactProfile.svelte';
	import { api } from '$lib/services/api';
	import { supabase } from '$lib/services/supabaseClient';
	import { sessionsStore } from '$lib/stores/sessions';
	import { chatStore } from '$lib/stores/chat';
	import { SessionStatus, type Message, type Session } from '$lib/types';

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

<div class="flex h-screen w-screen flex-col overflow-hidden bg-slate-50">
	<!-- Global Header -->
	<header class="flex h-16 shrink-0 items-center justify-between border-b border-gray-200 bg-white px-6 shadow-sm">
		<div class="flex items-center gap-3">
			<img src="/logo.png" alt="Planeta Imaginário" class="h-10 w-auto object-contain" />
			<span class="font-bold text-gray-900">Painel de Atendimento</span>
		</div>
		<div class="flex items-center gap-4">
			<span class="text-sm font-medium text-gray-700">Olá, Atendente</span>
			<button class="rounded-lg border border-red-500 px-4 py-2 text-sm font-medium text-red-500 transition-colors hover:bg-red-50">
				Sair
			</button>
		</div>
	</header>

	<main class="flex flex-1 overflow-hidden">
		{#if loading}
			<div class="flex h-full w-full items-center justify-center">
				<span class="text-sm text-gray-500">Carregando o sistema...</span>
			</div>
		{:else if error}
			<div class="flex h-full w-full items-center justify-center p-8 text-center text-red-600">
				<p>{error}</p>
			</div>
		{:else}
			<!-- Left Column: Sidebar -->
			<Sidebar />

			<!-- Center Column: Chat Area -->
			<ChatArea />

			<!-- Right Column: Contact Profile -->
			<!-- Passamos undefined (ou evitamos crash interno) se não houver chat ativo -->
			<ContactProfile />
		{/if}
	</main>
</div>
