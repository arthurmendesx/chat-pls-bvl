<script lang="ts">
	import type { Message } from '$lib/types';
	import { SenderType } from '$lib/types';

	interface Props {
		message: Message;
	}

	let { message }: Props = $props();

	const isContact = $derived(message.senderType === SenderType.CONTACT);
	const isBot = $derived(message.senderType === SenderType.BOT);
	const isAgent = $derived(message.senderType === SenderType.AGENT);

	const displayTime = $derived(
		new Date(message.createdAt).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })
	);

	/**
	 * Detects the "type" of content to render.
	 * Since your backend currently stores `message.content` as a string,
	 * interactive replies (list_reply / button_reply) from the user
	 * will arrive as plain text. For future extensibility we check if
	 * the content is JSON-parseable and contains known keys.
	 */
	const parsed = $derived.by(() => {
		const raw = message.content;

		// Fast path: plain text
		if (!raw.startsWith('{')) {
			return { type: 'text' as const, body: raw };
		}

		try {
			const obj = JSON.parse(raw);

			// Interactive list reply (user picked a list option)
			if (obj.list_reply) {
				return {
					type: 'interactive_list' as const,
					title: obj.list_reply.title ?? '',
					description: obj.list_reply.description ?? '',
					id: obj.list_reply.id ?? ''
				};
			}

			// Interactive button reply
			if (obj.button_reply) {
				return {
					type: 'interactive_button' as const,
					title: obj.button_reply.title ?? '',
					id: obj.button_reply.id ?? ''
				};
			}

			// Location
			if (obj.latitude && obj.longitude) {
				return {
					type: 'location' as const,
					latitude: obj.latitude,
					longitude: obj.longitude,
					name: obj.name ?? '',
					address: obj.address ?? ''
				};
			}

			// Image / Video / Audio / Document / Sticker (media)
			if (obj.mime_type || obj.media_url || obj.url) {
				const mime: string = obj.mime_type ?? '';
				let mediaType: 'image' | 'video' | 'audio' | 'document' | 'sticker' = 'document';
				if (mime.startsWith('image') || obj.type === 'image') mediaType = 'image';
				else if (mime.startsWith('video') || obj.type === 'video') mediaType = 'video';
				else if (mime.startsWith('audio') || obj.type === 'audio') mediaType = 'audio';
				else if (obj.type === 'sticker') mediaType = 'sticker';

				return {
					type: mediaType,
					url: obj.media_url || obj.url || obj.link || '',
					caption: obj.caption ?? '',
					filename: obj.filename ?? ''
				};
			}

			// Contacts shared
			if (obj.contacts || Array.isArray(obj)) {
				const contacts = obj.contacts ?? obj;
				return { type: 'contacts' as const, contacts };
			}

			// Reaction
			if (obj.emoji) {
				return { type: 'reaction' as const, emoji: obj.emoji };
			}

			// Fallback — just render as text
			return { type: 'text' as const, body: raw };
		} catch {
			return { type: 'text' as const, body: raw };
		}
	});
</script>

<div class="msg-row" class:outgoing={!isContact}>
	<!-- Bubble -->
	<div class="bubble" class:bubble-incoming={isContact} class:bubble-outgoing={!isContact} class:bubble-bot={isBot}>
		<!-- Sender label for bot -->
		{#if isBot}
			<div class="sender-label bot-label">
				<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" class="label-icon">
					<path stroke-linecap="round" stroke-linejoin="round" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"></path>
				</svg>
				Bot
			</div>
		{:else if isAgent}
			<div class="sender-label agent-label">
				<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" class="label-icon">
					<path d="M10 8a3 3 0 100-6 3 3 0 000 6zM3.465 14.493a1.23 1.23 0 00.41 1.412A9.957 9.957 0 0010 18c2.31 0 4.438-.784 6.131-2.1.43-.333.604-.903.408-1.41a7.002 7.002 0 00-13.074.003z" />
				</svg>
				Atendente
			</div>
		{/if}

		<!-- Content based on type -->
		{#if parsed.type === 'text'}
			<p class="msg-text">{parsed.body}</p>

		{:else if parsed.type === 'interactive_list'}
			<div class="interactive-card">
				<div class="interactive-icon">📋</div>
				<div class="interactive-body">
					<span class="interactive-title">{parsed.title}</span>
					{#if parsed.description}
						<span class="interactive-desc">{parsed.description}</span>
					{/if}
				</div>
			</div>

		{:else if parsed.type === 'interactive_button'}
			<div class="interactive-card">
				<div class="interactive-icon">🔘</div>
				<div class="interactive-body">
					<span class="interactive-title">{parsed.title}</span>
				</div>
			</div>

		{:else if parsed.type === 'location'}
			<div class="location-card">
				<a
					href="https://maps.google.com/?q={parsed.latitude},{parsed.longitude}"
					target="_blank"
					rel="noopener noreferrer"
					class="location-link"
				>
					<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" class="location-pin">
						<path fill-rule="evenodd" d="m9.69 18.933.003.001C9.89 19.02 10 19 10 19s.11.02.308-.066l.002-.001.006-.003.018-.008a5.741 5.741 0 00.281-.14c.186-.096.446-.24.757-.433.62-.384 1.445-.966 2.274-1.765C15.302 14.988 17 12.493 17 9A7 7 0 103 9c0 3.492 1.698 5.988 3.355 7.584a13.731 13.731 0 002.273 1.765 11.842 11.842 0 00.976.544l.062.029.018.008.006.003zM10 11.25a2.25 2.25 0 100-4.5 2.25 2.25 0 000 4.5z" clip-rule="evenodd" />
					</svg>
					<div>
						{#if parsed.name}<span class="location-name">{parsed.name}</span>{/if}
						{#if parsed.address}<span class="location-addr">{parsed.address}</span>{/if}
						{#if !parsed.name && !parsed.address}
							<span class="location-name">📍 Ver localização</span>
						{/if}
					</div>
				</a>
			</div>

		{:else if parsed.type === 'image' || parsed.type === 'sticker'}
			<div class="media-card">
				{#if parsed.url}
					<img src={parsed.url} alt={parsed.caption || 'Imagem'} class="media-img" />
				{:else}
					<div class="media-placeholder">🖼️ Imagem não disponível</div>
				{/if}
				{#if parsed.caption}<p class="media-caption">{parsed.caption}</p>{/if}
			</div>

		{:else if parsed.type === 'video'}
			<div class="media-card">
				{#if parsed.url}
					<video controls class="media-video" preload="metadata">
						<source src={parsed.url} />
						<track kind="captions" />
					</video>
				{:else}
					<div class="media-placeholder">🎬 Vídeo não disponível</div>
				{/if}
				{#if parsed.caption}<p class="media-caption">{parsed.caption}</p>{/if}
			</div>

		{:else if parsed.type === 'audio'}
			<div class="audio-card">
				{#if parsed.url}
					<audio controls preload="metadata" class="audio-player">
						<source src={parsed.url} />
						<track kind="captions" />
					</audio>
				{:else}
					<div class="media-placeholder">🎵 Áudio não disponível</div>
				{/if}
			</div>

		{:else if parsed.type === 'document'}
			<div class="document-card">
				<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" class="doc-icon">
					<path d="M3 3.5A1.5 1.5 0 014.5 2h6.879a1.5 1.5 0 011.06.44l4.122 4.12A1.5 1.5 0 0117 7.622V16.5a1.5 1.5 0 01-1.5 1.5h-11A1.5 1.5 0 013 16.5v-13z" />
				</svg>
				<div class="doc-info">
					<span class="doc-filename">{parsed.filename || 'Documento'}</span>
					{#if parsed.url}
						<a href={parsed.url} target="_blank" rel="noopener noreferrer" class="doc-download">Abrir arquivo ↗</a>
					{/if}
				</div>
			</div>

		{:else if parsed.type === 'contacts'}
			<div class="contacts-card">
				<span class="contacts-label">👤 Contato compartilhado</span>
			</div>

		{:else if parsed.type === 'reaction'}
			<div class="reaction-bubble">
				{parsed.emoji}
			</div>

		{:else}
			<p class="msg-text">{message.content}</p>
		{/if}

		<span class="msg-time">{displayTime}</span>
	</div>
</div>

<style>
	/* ─── Row alignment ─── */
	.msg-row {
		display: flex;
		flex-direction: column;
		align-items: flex-start;
	}

	.msg-row.outgoing {
		align-items: flex-end;
	}

	/* ─── Bubble Base ─── */
	.bubble {
		max-width: 420px;
		padding: 0.625rem 0.875rem;
		border-radius: 14px;
		position: relative;
	}

	.bubble-incoming {
		background: rgba(255, 255, 255, 0.06);
		border: 1px solid rgba(255, 255, 255, 0.08);
		border-bottom-left-radius: 4px;
	}

	.bubble-outgoing {
		background: linear-gradient(135deg, rgba(124, 58, 237, 0.25), rgba(109, 40, 217, 0.2));
		border: 1px solid rgba(124, 58, 237, 0.2);
		border-bottom-right-radius: 4px;
	}

	.bubble-bot {
		background: linear-gradient(135deg, rgba(45, 212, 191, 0.1), rgba(124, 58, 237, 0.1));
		border: 1px solid rgba(45, 212, 191, 0.15);
	}

	/* ─── Sender Label ─── */
	.sender-label {
		display: inline-flex;
		align-items: center;
		gap: 0.25rem;
		font-size: 0.625rem;
		font-weight: 700;
		text-transform: uppercase;
		letter-spacing: 0.05em;
		margin-bottom: 0.375rem;
	}

	.bot-label {
		color: #2dd4bf;
	}

	.agent-label {
		color: #a78bfa;
	}

	.label-icon {
		width: 12px;
		height: 12px;
	}

	/* ─── Text ─── */
	.msg-text {
		font-size: 0.8125rem;
		line-height: 1.55;
		color: #e2e8f0;
		margin: 0;
		word-wrap: break-word;
		white-space: pre-wrap;
	}

	/* ─── Timestamp ─── */
	.msg-time {
		display: block;
		text-align: right;
		font-size: 0.5625rem;
		color: rgba(255, 255, 255, 0.2);
		margin-top: 0.375rem;
	}

	/* ─── Interactive Cards (list/button reply) ─── */
	.interactive-card {
		display: flex;
		align-items: flex-start;
		gap: 0.5rem;
		padding: 0.5rem 0.625rem;
		background: rgba(255, 255, 255, 0.04);
		border-radius: 8px;
		border: 1px solid rgba(255, 255, 255, 0.06);
	}

	.interactive-icon {
		font-size: 1.125rem;
		flex-shrink: 0;
		margin-top: 1px;
	}

	.interactive-body {
		display: flex;
		flex-direction: column;
		gap: 0.125rem;
	}

	.interactive-title {
		font-size: 0.8125rem;
		font-weight: 600;
		color: #c4b5fd;
	}

	.interactive-desc {
		font-size: 0.6875rem;
		color: rgba(255, 255, 255, 0.35);
	}

	/* ─── Location ─── */
	.location-card {
		border-radius: 8px;
		overflow: hidden;
	}

	.location-link {
		display: flex;
		align-items: center;
		gap: 0.5rem;
		padding: 0.5rem 0.625rem;
		background: rgba(52, 211, 153, 0.08);
		border: 1px solid rgba(52, 211, 153, 0.15);
		border-radius: 8px;
		text-decoration: none;
		transition: background 0.2s;
	}

	.location-link:hover {
		background: rgba(52, 211, 153, 0.12);
	}

	.location-pin {
		width: 20px;
		height: 20px;
		color: #34d399;
		flex-shrink: 0;
	}

	.location-name {
		font-size: 0.8125rem;
		font-weight: 600;
		color: #34d399;
	}

	.location-addr {
		font-size: 0.6875rem;
		color: rgba(255, 255, 255, 0.35);
		display: block;
	}

	/* ─── Media ─── */
	.media-card {
		border-radius: 8px;
		overflow: hidden;
	}

	.media-img {
		max-width: 100%;
		border-radius: 8px;
		display: block;
	}

	.media-video {
		max-width: 100%;
		border-radius: 8px;
		display: block;
	}

	.media-placeholder {
		padding: 1.25rem;
		text-align: center;
		font-size: 0.8125rem;
		color: rgba(255, 255, 255, 0.3);
		background: rgba(255, 255, 255, 0.03);
		border-radius: 8px;
	}

	.media-caption {
		font-size: 0.75rem;
		color: rgba(255, 255, 255, 0.5);
		margin: 0.375rem 0 0;
	}

	/* ─── Audio ─── */
	.audio-card {
		min-width: 200px;
	}

	.audio-player {
		width: 100%;
		height: 36px;
		border-radius: 8px;
	}

	/* ─── Document ─── */
	.document-card {
		display: flex;
		align-items: center;
		gap: 0.625rem;
		padding: 0.5rem 0.625rem;
		background: rgba(255, 255, 255, 0.04);
		border: 1px solid rgba(255, 255, 255, 0.06);
		border-radius: 8px;
	}

	.doc-icon {
		width: 28px;
		height: 28px;
		color: #a78bfa;
		flex-shrink: 0;
	}

	.doc-info {
		display: flex;
		flex-direction: column;
		gap: 0.125rem;
	}

	.doc-filename {
		font-size: 0.8125rem;
		font-weight: 600;
		color: #e2e8f0;
	}

	.doc-download {
		font-size: 0.6875rem;
		color: #a78bfa;
		text-decoration: none;
	}

	.doc-download:hover {
		text-decoration: underline;
	}

	/* ─── Contacts ─── */
	.contacts-card {
		padding: 0.5rem 0.625rem;
		font-size: 0.8125rem;
		color: #e2e8f0;
	}

	.contacts-label {
		font-weight: 600;
	}

	/* ─── Reaction ─── */
	.reaction-bubble {
		font-size: 1.75rem;
		line-height: 1;
	}
</style>
