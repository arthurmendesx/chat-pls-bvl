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
	<aside class="flex h-full w-80 flex-col border-l border-gray-200 bg-white">
		<!-- Contact Info -->
		<div class="flex flex-col items-center border-b border-gray-200 px-6 py-6">
			<div
				class="bg-gradient-to-br from-blue-500 to-blue-700 flex h-20 w-20 items-center justify-center rounded-full text-2xl font-bold text-white"
			>
				{($chatStore.session.contact.name || $chatStore.session.contact.phone || '??').substring(0, 2).toUpperCase()}
			</div>
			<h2 class="mt-3 text-base font-semibold text-gray-900">{$chatStore.session.contact.name || 'Desconhecido'}</h2>
			<p class="text-sm text-gray-500">{$chatStore.session.contact.phone}</p>
		</div>

		<!-- Action Buttons -->
		<div class="space-y-3 border-b border-gray-200 px-6 py-5">
			<!-- Take over chat -->
			{#if $chatStore.session.status !== SessionStatus.ACTIVE}
				<button
					type="button"
					onclick={() => updateStatus(SessionStatus.ACTIVE)}
					disabled={isUpdating}
					class="flex w-full items-center justify-center gap-2 rounded-lg bg-blue-600 px-4 py-2.5 text-sm font-medium text-white transition-colors hover:bg-blue-700 disabled:opacity-50"
				>
					<svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
						<path
							stroke-linecap="round"
							stroke-linejoin="round"
							stroke-width="2"
							d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z"
						></path>
					</svg>
					{isUpdating ? 'Aguarde...' : 'Assumir Atendimento'}
				</button>
			{/if}

			<!-- Return to Bot -->
			<button
				type="button"
				onclick={() => updateStatus(SessionStatus.BOT)}
				disabled={isUpdating}
				class="flex w-full items-center justify-center gap-2 rounded-lg border border-gray-300 px-4 py-2.5 text-sm font-medium text-gray-700 transition-colors hover:bg-slate-50 disabled:opacity-50"
			>
				<svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
					<path
						stroke-linecap="round"
						stroke-linejoin="round"
						stroke-width="2"
						d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"
					></path>
				</svg>
				Retornar ao Bot
			</button>

			<!-- End Session -->
			{#if $chatStore.session.status !== SessionStatus.CLOSED}
				<button
					type="button"
					onclick={() => updateStatus(SessionStatus.CLOSED)}
					disabled={isUpdating}
					class="flex w-full items-center justify-center gap-2 rounded-lg border border-gray-300 px-4 py-2.5 text-sm font-medium text-red-500 transition-colors hover:bg-red-50 disabled:opacity-50"
				>
					<svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
						<path
							stroke-linecap="round"
							stroke-linejoin="round"
							stroke-width="2"
							d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z"
						></path>
					</svg>
					{isUpdating ? 'Aguarde...' : 'Encerrar Sessão'}
				</button>
			{/if}
		</div>

		<!-- Internal Notes -->
		<div class="flex flex-1 flex-col px-6 py-5">
			<h3 class="mb-1 text-sm font-semibold text-gray-900">Notas Internas (Não visível ao cliente)</h3>
			<textarea
				placeholder="Adicione notas sobre este atendimento..."
				class="flex-1 resize-none rounded-lg border border-gray-300 p-3 text-sm text-gray-700 placeholder-gray-400 focus:border-blue-600 focus:outline-none focus:ring-1 focus:ring-blue-600"
			></textarea>
			<button
				type="button"
				class="mt-3 w-full rounded-lg bg-gray-800 px-4 py-2.5 text-sm font-medium text-white transition-colors hover:bg-gray-900"
			>
				Salvar Nota
			</button>
		</div>
	</aside>
{/if}
