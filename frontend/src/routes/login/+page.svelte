<script lang="ts">
	import { auth } from '$lib/stores/auth.svelte';
	import { api } from '$lib/services/api';

	let email = $state('');
	let password = $state('');
	let error = $state('');
	let loading = $state(false);
	let showPassword = $state(false);

	async function handleLogin(e: SubmitEvent) {
		e.preventDefault();
		error = '';

		if (!email.trim() || !password.trim()) {
			error = 'Preencha todos os campos.';
			return;
		}

		loading = true;

		try {
			const response = await api.login(email, password);
			auth.login(response.accessToken, response.user);

			// Redirect to dashboard
			window.location.href = '/';
		} catch (err) {
			error = err instanceof Error ? err.message : 'Erro ao fazer login. Tente novamente.';
		} finally {
			loading = false;
		}
	}
</script>

<svelte:head>
	<title>Login — ChatSupport</title>
	<meta name="description" content="Faça login na plataforma de atendimento" />
</svelte:head>

<div class="login-page">
	<!-- Background decoration -->
	<div class="bg-orbs">
		<div class="orb orb-1"></div>
		<div class="orb orb-2"></div>
		<div class="orb orb-3"></div>
	</div>

	<div class="login-container">
		<!-- Brand Section -->
		<div class="brand-section">
			<div class="brand-icon">
				<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" class="planet-icon">
					<circle cx="12" cy="12" r="10" />
					<ellipse cx="12" cy="12" rx="14" ry="4" transform="rotate(-30 12 12)" />
					<circle cx="8" cy="9" r="1.5" fill="currentColor" opacity="0.3" />
					<circle cx="15" cy="13" r="1" fill="currentColor" opacity="0.2" />
				</svg>
			</div>
			<h1 class="brand-title">Planeta Imaginário</h1>
			<p class="brand-subtitle">Painel de Atendimento</p>
		</div>

		<!-- Login Form Card -->
		<div class="login-card">
			<div class="card-header">
				<h2>Bem-vindo de volta</h2>
				<p>Entre com suas credenciais para acessar o painel</p>
			</div>

			<form onsubmit={handleLogin} class="login-form">
				{#if error}
					<div class="error-banner" role="alert">
						<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" class="error-icon">
							<path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a.75.75 0 000 1.5h.253a.25.25 0 01.244.304l-.459 2.066A1.75 1.75 0 0010.747 15H11a.75.75 0 000-1.5h-.253a.25.25 0 01-.244-.304l.459-2.066A1.75 1.75 0 009.253 9H9z" clip-rule="evenodd" />
						</svg>
						<span>{error}</span>
					</div>
				{/if}

				<div class="form-group">
					<label for="login-email" class="form-label">E-mail</label>
					<div class="input-wrapper">
						<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" class="input-icon">
							<path d="M3 4a2 2 0 00-2 2v1.161l8.441 4.221a1.25 1.25 0 001.118 0L19 7.162V6a2 2 0 00-2-2H3z" />
							<path d="M19 8.839l-7.77 3.885a2.75 2.75 0 01-2.46 0L1 8.839V14a2 2 0 002 2h14a2 2 0 002-2V8.839z" />
						</svg>
						<input
							id="login-email"
							type="email"
							placeholder="seu@email.com"
							bind:value={email}
							autocomplete="email"
							required
							disabled={loading}
						/>
					</div>
				</div>

				<div class="form-group">
					<label for="login-password" class="form-label">Senha</label>
					<div class="input-wrapper">
						<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" class="input-icon">
							<path fill-rule="evenodd" d="M10 1a4.5 4.5 0 00-4.5 4.5V9H5a2 2 0 00-2 2v6a2 2 0 002 2h10a2 2 0 002-2v-6a2 2 0 00-2-2h-.5V5.5A4.5 4.5 0 0010 1zm3 8V5.5a3 3 0 10-6 0V9h6z" clip-rule="evenodd" />
						</svg>
						<input
							id="login-password"
							type={showPassword ? 'text' : 'password'}
							placeholder="••••••••"
							bind:value={password}
							autocomplete="current-password"
							required
							disabled={loading}
						/>
						<button
							type="button"
							class="toggle-password"
							onclick={() => (showPassword = !showPassword)}
							tabindex={-1}
							aria-label={showPassword ? 'Ocultar senha' : 'Mostrar senha'}
						>
							{#if showPassword}
								<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" class="eye-icon">
									<path fill-rule="evenodd" d="M3.28 2.22a.75.75 0 00-1.06 1.06l14.5 14.5a.75.75 0 101.06-1.06l-1.745-1.745a10.029 10.029 0 003.3-4.38 1.651 1.651 0 000-1.185A10.004 10.004 0 009.999 3a9.956 9.956 0 00-4.744 1.194L3.28 2.22zM7.752 6.69l1.092 1.092a2.5 2.5 0 013.374 3.373l1.092 1.092a4 4 0 00-5.558-5.558z" clip-rule="evenodd" />
									<path d="M10.748 13.93l2.523 2.523a9.987 9.987 0 01-3.27.547c-4.258 0-7.894-2.66-9.337-6.41a1.651 1.651 0 010-1.186A10.007 10.007 0 012.839 6.02L6.07 9.252a4 4 0 004.678 4.678z" />
								</svg>
							{:else}
								<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" class="eye-icon">
									<path d="M10 12.5a2.5 2.5 0 100-5 2.5 2.5 0 000 5z" />
									<path fill-rule="evenodd" d="M.664 10.59a1.651 1.651 0 010-1.186A10.004 10.004 0 0110 3c4.257 0 7.893 2.66 9.336 6.41.147.381.146.804 0 1.186A10.004 10.004 0 0110 17c-4.257 0-7.893-2.66-9.336-6.41zM14 10a4 4 0 11-8 0 4 4 0 018 0z" clip-rule="evenodd" />
								</svg>
							{/if}
						</button>
					</div>
				</div>

				<button
					id="login-submit"
					type="submit"
					class="submit-btn"
					disabled={loading}
				>
					{#if loading}
						<div class="spinner"></div>
						Entrando…
					{:else}
						Entrar
					{/if}
				</button>
			</form>
		</div>

		<p class="footer-text">© 2026 Planeta Imaginário — Todos os direitos reservados</p>
	</div>
</div>

<style>
	/* ───── Page Background ───── */
	.login-page {
		position: relative;
		display: flex;
		align-items: center;
		justify-content: center;
		min-height: 100vh;
		overflow: hidden;
		background: linear-gradient(135deg, #0f0c29 0%, #1a1245 30%, #302b63 60%, #24243e 100%);
	}

	/* Floating orb decorations */
	.bg-orbs {
		position: absolute;
		inset: 0;
		pointer-events: none;
		overflow: hidden;
	}

	.orb {
		position: absolute;
		border-radius: 50%;
		filter: blur(80px);
		opacity: 0.25;
	}

	.orb-1 {
		width: 500px;
		height: 500px;
		background: #7c3aed;
		top: -120px;
		right: -60px;
		animation: float-1 18s ease-in-out infinite;
	}

	.orb-2 {
		width: 400px;
		height: 400px;
		background: #2dd4bf;
		bottom: -100px;
		left: -80px;
		animation: float-2 22s ease-in-out infinite;
	}

	.orb-3 {
		width: 300px;
		height: 300px;
		background: #f472b6;
		top: 50%;
		left: 50%;
		transform: translate(-50%, -50%);
		animation: float-3 15s ease-in-out infinite;
	}

	@keyframes float-1 {
		0%, 100% { transform: translate(0, 0) scale(1); }
		50% { transform: translate(-40px, 60px) scale(1.1); }
	}

	@keyframes float-2 {
		0%, 100% { transform: translate(0, 0) scale(1); }
		50% { transform: translate(50px, -40px) scale(1.15); }
	}

	@keyframes float-3 {
		0%, 100% { transform: translate(-50%, -50%) scale(1); }
		50% { transform: translate(-50%, -55%) scale(0.9); }
	}

	/* ───── Container ───── */
	.login-container {
		position: relative;
		z-index: 1;
		display: flex;
		flex-direction: column;
		align-items: center;
		width: 100%;
		max-width: 420px;
		padding: 2rem 1.5rem;
	}

	/* ───── Brand Header ───── */
	.brand-section {
		text-align: center;
		margin-bottom: 2rem;
	}

	.brand-icon {
		display: inline-flex;
		align-items: center;
		justify-content: center;
		width: 72px;
		height: 72px;
		border-radius: 20px;
		background: linear-gradient(135deg, rgba(124, 58, 237, 0.3), rgba(45, 212, 191, 0.2));
		border: 1px solid rgba(255, 255, 255, 0.1);
		backdrop-filter: blur(12px);
		margin-bottom: 1rem;
	}

	.planet-icon {
		width: 40px;
		height: 40px;
		color: #c4b5fd;
	}

	.brand-title {
		font-size: 1.75rem;
		font-weight: 700;
		color: #ffffff;
		letter-spacing: -0.02em;
		margin: 0;
	}

	.brand-subtitle {
		font-size: 0.875rem;
		color: rgba(255, 255, 255, 0.55);
		margin-top: 0.375rem;
		font-weight: 500;
		letter-spacing: 0.04em;
		text-transform: uppercase;
	}

	/* ───── Card ───── */
	.login-card {
		width: 100%;
		padding: 2rem;
		background: rgba(255, 255, 255, 0.06);
		border: 1px solid rgba(255, 255, 255, 0.1);
		border-radius: 20px;
		backdrop-filter: blur(24px);
		box-shadow:
			0 8px 32px rgba(0, 0, 0, 0.3),
			inset 0 1px 0 rgba(255, 255, 255, 0.06);
	}

	.card-header {
		text-align: center;
		margin-bottom: 1.75rem;
	}

	.card-header h2 {
		font-size: 1.25rem;
		font-weight: 600;
		color: #f1f5f9;
		margin: 0 0 0.375rem;
	}

	.card-header p {
		font-size: 0.8125rem;
		color: rgba(255, 255, 255, 0.45);
		margin: 0;
	}

	/* ───── Form ───── */
	.login-form {
		display: flex;
		flex-direction: column;
		gap: 1.25rem;
	}

	.form-group {
		display: flex;
		flex-direction: column;
		gap: 0.5rem;
	}

	.form-label {
		font-size: 0.8125rem;
		font-weight: 500;
		color: rgba(255, 255, 255, 0.7);
	}

	.input-wrapper {
		position: relative;
		display: flex;
		align-items: center;
	}

	.input-icon {
		position: absolute;
		left: 14px;
		width: 18px;
		height: 18px;
		color: rgba(255, 255, 255, 0.3);
		pointer-events: none;
	}

	.input-wrapper input {
		width: 100%;
		padding: 0.75rem 0.875rem 0.75rem 2.75rem;
		font-size: 0.875rem;
		color: #f1f5f9;
		background: rgba(255, 255, 255, 0.06);
		border: 1px solid rgba(255, 255, 255, 0.12);
		border-radius: 12px;
		outline: none;
		transition: all 0.2s ease;
		font-family: inherit;
	}

	.input-wrapper input::placeholder {
		color: rgba(255, 255, 255, 0.25);
	}

	.input-wrapper input:focus {
		border-color: rgba(124, 58, 237, 0.6);
		box-shadow: 0 0 0 3px rgba(124, 58, 237, 0.15);
		background: rgba(255, 255, 255, 0.08);
	}

	.input-wrapper input:disabled {
		opacity: 0.5;
		cursor: not-allowed;
	}

	.toggle-password {
		position: absolute;
		right: 12px;
		display: flex;
		align-items: center;
		justify-content: center;
		padding: 4px;
		background: none;
		border: none;
		cursor: pointer;
		color: rgba(255, 255, 255, 0.35);
		transition: color 0.2s;
	}

	.toggle-password:hover {
		color: rgba(255, 255, 255, 0.65);
	}

	.eye-icon {
		width: 18px;
		height: 18px;
	}

	/* ───── Submit Button ───── */
	.submit-btn {
		display: flex;
		align-items: center;
		justify-content: center;
		gap: 0.5rem;
		width: 100%;
		padding: 0.8rem;
		margin-top: 0.25rem;
		font-size: 0.9375rem;
		font-weight: 600;
		font-family: inherit;
		color: #ffffff;
		background: linear-gradient(135deg, #7c3aed, #6d28d9);
		border: none;
		border-radius: 12px;
		cursor: pointer;
		transition: all 0.25s ease;
		box-shadow: 0 4px 14px rgba(124, 58, 237, 0.35);
	}

	.submit-btn:hover:not(:disabled) {
		background: linear-gradient(135deg, #8b5cf6, #7c3aed);
		box-shadow: 0 6px 20px rgba(124, 58, 237, 0.45);
		transform: translateY(-1px);
	}

	.submit-btn:active:not(:disabled) {
		transform: translateY(0);
	}

	.submit-btn:disabled {
		opacity: 0.6;
		cursor: not-allowed;
	}

	/* ───── Error Banner ───── */
	.error-banner {
		display: flex;
		align-items: center;
		gap: 0.5rem;
		padding: 0.75rem 1rem;
		font-size: 0.8125rem;
		color: #fca5a5;
		background: rgba(239, 68, 68, 0.12);
		border: 1px solid rgba(239, 68, 68, 0.25);
		border-radius: 10px;
	}

	.error-icon {
		width: 18px;
		height: 18px;
		flex-shrink: 0;
		color: #ef4444;
	}

	/* ───── Spinner ───── */
	.spinner {
		width: 18px;
		height: 18px;
		border: 2px solid rgba(255, 255, 255, 0.25);
		border-top-color: #ffffff;
		border-radius: 50%;
		animation: spin 0.7s linear infinite;
	}

	@keyframes spin {
		to { transform: rotate(360deg); }
	}

	/* ───── Footer ───── */
	.footer-text {
		margin-top: 2rem;
		font-size: 0.6875rem;
		color: rgba(255, 255, 255, 0.25);
		text-align: center;
	}
</style>
