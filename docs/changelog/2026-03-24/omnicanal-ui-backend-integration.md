# Omnichannel Svelte & NestJS Integration (Planeta Imaginário)

**Date:** 2026-03-24  
**Author:** Arthur Mendes (arthur@example.com)

## Summary
Completed the full-stack integration of the WhatsApp omnichannel SaaS tailoring both the backend state machine and the frontend interface to the new "Planeta Imaginário" brand identity. Resolved persistent message-loading reactivity bugs, restructured the global UI hierarchy, updated the Prisma schema, and fortified sidebar list rendering against WhatsApp's raw data anomalies. This single operation encapsulates changes across 39 interconnected components, API gateways, stores, and configuration setups.

## Changes

### Added
- **Global Application Header**: Introduced a persistent `<header>` in `+page.svelte` spanning the full width, featuring the Planeta Imaginário logo, title, and logout controls.
- **Svelte Empty & Loading States**: Deployed elegant `animate-pulse` skeletons and empty-list text fallbacks (`"Nenhuma mensagem..."`) within `ChatArea.svelte` to enhance UX transitions.
- **Backend Prisma Alterations**: Added `bot_state` column capabilities and completely updated the Chat Service `VALID_STATUS_TRANSITIONS` schema to seamlessly permit transitions between `BOT`, `ACTIVE`, and `WAITING` queues.

### Changed
- **Design System ("Planeta Imaginário")**: Terminated all legacy "Emerald" greens and rigorously implemented the new Blue-600 / Orange-500 palette.
- **Chat Bubbles Architecture**: Overhauled `ChatMessage.svelte` styling with modern `rounded-2xl` geometric tokens (e.g. `rounded-bl-none` and `rounded-br-none` directional cues) layered with `.shadow-sm` elevations.
- **Dynamic Avatars**: Converted flat background colors into rich `bg-gradient-to-br from-blue-500 to-blue-700` spheres displaying capitalized initials.
- **Reactivity Flow (Fetch Racing)**: Migrated the message fetching methodology in `ChatArea` & `Sidebar` from ambiguous `$effect` watchers back to explicit, deterministic `async` clicks wrapped in Svelte stores, curing the invisible chat array bug.

### Fixed
- **Status Blockade Exception**: Overrode the strict backend payload validator that previously blocked the "Assumir Atendimento" button by rejecting `BOT -> ACTIVE` translations.
- **Return to Bot Action**: Correctly wired the "Retornar ao Bot" panel button with the explicit `updateStatus(SessionStatus.BOT)` HTTP patch route.
- **Svelte Loop Crash Loop**: Null-proofed all internal avatar calculations with `(contact.name || contact.phone || '??').substring(0, 2)` guarding the Sidebars and Profile headers from silently exploding when processing unnamed WhatsApp leads.

## Files Modified
*(Overview of key structural changes out of all 39 touched files today)*
- `docs/design-system.md`
- `backend/.env`
- `backend/prisma/schema.prisma`
- `backend/src/chat/chat.service.ts`
- `backend/src/sessions/sessions.service.ts`
- `frontend/src/lib/types/index.ts`
- `frontend/src/lib/services/api.ts`
- `frontend/src/lib/stores/chat.ts`
- `frontend/src/lib/stores/sessions.ts`
- `frontend/src/routes/+page.svelte`
- `frontend/src/lib/components/ChatArea.svelte`
- `frontend/src/lib/components/Sidebar.svelte`
- `frontend/src/lib/components/ChatMessage.svelte`
- `frontend/src/lib/components/ContactProfile.svelte`
- `frontend/src/lib/components/ContactListItem.svelte`
