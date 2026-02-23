# Project Foundation & Full-Stack Setup

**Date:** 2026-02-23  
**Author:** Arthur Mendes

## Summary
Initial setup of the omnichannel customer service system (chat-pls-blv). Established the monorepo structure with a SvelteKit frontend, NestJS backend, and full project documentation. Built the static 3-column dashboard layout and connected the backend to Supabase via Prisma v7 with the driver adapter pattern.

## Changes

### Added

**Documentation (`/docs`)**
- `design-system.md` — Color palette (emerald-600 brand), typography (Inter), spacing, radii, shadows, and reusable component patterns (filter pills, contact list items, chat bubbles, action buttons, input bar)
- `best-practices.md` — Coding standards for TypeScript (strict mode), Svelte 5 (runes API), NestJS (module-controller-service), naming conventions, commit standards (Conventional Commits), `lucide-svelte` for icons, Supabase + Prisma for database
- `file-structure.md` — Monorepo architecture map for `/frontend`, `/backend`, `/docs`
- `change-logs.md` — Changelog template with naming conventions and folder organization

**Frontend (`/frontend`) — SvelteKit + Tailwind CSS v4**
- `src/lib/components/Sidebar.svelte` — Left column with logo, search bar, filter pills, contact list
- `src/lib/components/ContactListItem.svelte` — Individual contact row with avatar, name, last message, timestamp, unread badge
- `src/lib/components/ChatArea.svelte` — Center column with chat header, message display area, input bar
- `src/lib/components/ChatMessage.svelte` — Reusable chat bubble for user/bot messages
- `src/lib/components/ContactProfile.svelte` — Right column with contact details, action buttons, internal notes
- `src/lib/types/index.ts` — TypeScript interfaces and enums (Contact, Message, Conversation, status/filter types)
- `src/lib/data/mockData.ts` — Mock data for contacts and messages
- `src/routes/+page.svelte` — Main dashboard layout wiring components with mock data
- `src/routes/layout.css` — Tailwind theme with Inter font and custom scrollbar styles

**Backend (`/backend`) — NestJS 11 + Prisma v7**
- `prisma/schema.prisma` — Database schema with 4 models (User, Contact, Session, Message) and 2 enums (SessionStatus, SenderType)
- `prisma.config.ts` — Prisma migration config pointing to `DIRECT_URL`
- `src/prisma/prisma.module.ts` — Global NestJS module exporting PrismaService
- `src/prisma/prisma.service.ts` — PrismaClient with `@prisma/adapter-pg` driver adapter for Prisma v7 compatibility
- `src/contacts/contacts.module.ts` — Contacts feature module
- `src/contacts/contacts.controller.ts` — REST controller with `POST /contacts` and `GET /contacts`
- `src/contacts/contacts.service.ts` — Service with create (duplicate phone check) and findAll (ordered by createdAt desc)
- `src/main.ts` — Updated with `dotenv/config` import for environment variable loading
- `.env` — Supabase connection strings (DATABASE_URL pooled + DIRECT_URL direct)

### Changed
- `src/app.module.ts` — Added PrismaModule and ContactsModule imports

## Files Modified
- `docs/design-system.md` [NEW]
- `docs/best-practices.md` [NEW]
- `docs/file-structure.md` [NEW]
- `docs/change-logs.md` [NEW]
- `frontend/src/lib/components/Sidebar.svelte` [NEW]
- `frontend/src/lib/components/ContactListItem.svelte` [NEW]
- `frontend/src/lib/components/ChatArea.svelte` [NEW]
- `frontend/src/lib/components/ChatMessage.svelte` [NEW]
- `frontend/src/lib/components/ContactProfile.svelte` [NEW]
- `frontend/src/lib/types/index.ts` [NEW]
- `frontend/src/lib/data/mockData.ts` [NEW]
- `frontend/src/routes/+page.svelte` [MODIFIED]
- `frontend/src/routes/layout.css` [MODIFIED]
- `backend/prisma/schema.prisma` [MODIFIED]
- `backend/prisma.config.ts` [MODIFIED]
- `backend/src/prisma/prisma.module.ts` [NEW]
- `backend/src/prisma/prisma.service.ts` [NEW]
- `backend/src/contacts/contacts.module.ts` [NEW]
- `backend/src/contacts/contacts.controller.ts` [MODIFIED]
- `backend/src/contacts/contacts.service.ts` [MODIFIED]
- `backend/src/app.module.ts` [MODIFIED]
- `backend/src/main.ts` [MODIFIED]
- `backend/.env` [NEW]
