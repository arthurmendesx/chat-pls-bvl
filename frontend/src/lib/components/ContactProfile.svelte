<script lang="ts">
	import type { Contact } from '$lib/types';

	interface Props {
		contact: Contact;
	}

	let { contact }: Props = $props();
</script>

<aside class="flex h-full w-80 flex-col border-l border-gray-200 bg-white">
	<!-- Contact Info -->
	<div class="flex flex-col items-center border-b border-gray-200 px-6 py-6">
		<div
			class="{contact.avatarColor} flex h-20 w-20 items-center justify-center rounded-full text-2xl font-bold text-white"
		>
			{contact.initials}
		</div>
		<h2 class="mt-3 text-base font-semibold text-gray-900">{contact.name}</h2>
		<p class="text-sm text-gray-500">{contact.phone}</p>
	</div>

	<!-- Action Buttons -->
	<div class="space-y-3 border-b border-gray-200 px-6 py-5">
		<!-- Take over chat -->
		<button
			type="button"
			class="flex w-full items-center justify-center gap-2 rounded-lg bg-emerald-600 px-4 py-2.5 text-sm font-medium text-white transition-colors hover:bg-emerald-700"
		>
			<svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
				<path
					stroke-linecap="round"
					stroke-linejoin="round"
					stroke-width="2"
					d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z"
				></path>
			</svg>
			Take over chat
		</button>

		<!-- Return to Bot -->
		<button
			type="button"
			class="flex w-full items-center justify-center gap-2 rounded-lg border border-gray-300 px-4 py-2.5 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-50"
		>
			<svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
				<path
					stroke-linecap="round"
					stroke-linejoin="round"
					stroke-width="2"
					d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"
				></path>
			</svg>
			Return to Bot
		</button>

		<!-- End Session -->
		<button
			type="button"
			class="flex w-full items-center justify-center gap-2 rounded-lg border border-gray-300 px-4 py-2.5 text-sm font-medium text-red-500 transition-colors hover:bg-red-50"
		>
			<svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
				<path
					stroke-linecap="round"
					stroke-linejoin="round"
					stroke-width="2"
					d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z"
				></path>
			</svg>
			End Session
		</button>
	</div>

	<!-- Internal Notes -->
	<div class="flex flex-1 flex-col px-6 py-5">
		<h3 class="mb-1 text-sm font-semibold text-gray-900">Internal Notes (Not visible to client)</h3>
		<textarea
			placeholder="Add notes about this conversation..."
			class="flex-1 resize-none rounded-lg border border-gray-300 p-3 text-sm text-gray-700 placeholder-gray-400 focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500"
		></textarea>
		<button
			type="button"
			class="mt-3 w-full rounded-lg bg-gray-800 px-4 py-2.5 text-sm font-medium text-white transition-colors hover:bg-gray-900"
		>
			Save Note
		</button>
	</div>
</aside>
