<script lang="ts">
	import './layout.css';
	import favicon from '$lib/assets/favicon.svg';
	import { auth } from '$lib/stores/auth.svelte';

	let { children } = $props();

	let mounted = $state(false);

	$effect(() => {
		mounted = true;

		// Client-side auth guard
		const isLoginPage = window.location.pathname === '/login';

		if (!auth.isAuthenticated && !isLoginPage) {
			window.location.href = '/login';
		}

		if (auth.isAuthenticated && isLoginPage) {
			window.location.href = '/';
		}
	});
</script>

<svelte:head><link rel="icon" href={favicon} /></svelte:head>

{#if mounted}
	{@render children()}
{:else}
	<!-- Prevents flash of content before auth check -->
	<div style="display:flex;align-items:center;justify-content:center;height:100vh;background:#f8fafc;">
		<span style="color:#94a3b8;font-size:0.875rem;">Carregando…</span>
	</div>
{/if}
