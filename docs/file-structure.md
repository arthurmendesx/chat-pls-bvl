# File Structure — ChatSupport Monorepo

> **Mandatory reference** for all file creation. Every new file must live in the correct directory.

---

## Root

```
chat-pls-blv/
├── frontend/          # SvelteKit application
├── backend/           # NestJS application
├── docs/              # Project documentation (AI context)
├── prototype_v1-chat-pls-blv.png  # Design prototype reference
└── README.md          # Project overview (to be added)
```

---

## `/docs` — Documentation

```
docs/
├── design-system.md   # Tailwind tokens, colors, typography, component patterns
├── best-practices.md  # TypeScript, Svelte, NestJS conventions & rules
└── file-structure.md  # This file — monorepo directory map
```

**Responsibility:** Serve as mandatory AI context and developer onboarding reference.

---

## `/frontend` — SvelteKit Application

```
frontend/
├── src/
│   ├── app.html                  # HTML shell (fonts, meta)
│   ├── app.d.ts                  # SvelteKit global type declarations
│   │
│   ├── lib/
│   │   ├── components/           # Reusable UI components
│   │   │   ├── Sidebar.svelte          # Left column: logo, search, filters, contact list
│   │   │   ├── ContactListItem.svelte  # Single contact row in sidebar
│   │   │   ├── ChatArea.svelte         # Center column: header, messages, input
│   │   │   ├── ChatMessage.svelte      # Individual chat bubble (bot/user/agent)
│   │   │   └── ContactProfile.svelte   # Right column: contact info, actions, notes
│   │   │
│   │   ├── stores/               # Svelte stores for global state
│   │   │   ├── contacts.ts             # Contact list, active contact, filters
│   │   │   └── chat.ts                 # Active conversation, messages
│   │   │
│   │   ├── types/                # Shared TypeScript interfaces
│   │   │   └── index.ts                # Contact, Message, Conversation, etc.
│   │   │
│   │   ├── data/                 # Mock data for development
│   │   │   └── mockData.ts             # Fake contacts, messages, conversations
│   │   │
│   │   ├── services/             # API client / business logic
│   │   │   └── api.ts                  # HTTP calls to backend
│   │   │
│   │   ├── utils/                # Pure utility functions
│   │   │   └── formatters.ts           # Date formatting, phone formatting
│   │   │
│   │   ├── assets/               # Static assets (favicon only — icons via lucide-svelte)
│   │   │   └── favicon.svg
│   │   │
│   │   └── index.ts              # Barrel exports
│   │
│   └── routes/
│       ├── +layout.svelte              # Root layout (imports global CSS)
│       ├── layout.css                  # Tailwind imports + theme config
│       └── +page.svelte                # Main dashboard (3-column layout)
│
├── static/                       # Public static assets
│   └── favicon.png
│
├── .env.example                  # Environment variables template (e.g., PUBLIC_SUPABASE_URL)
├── svelte.config.js              # SvelteKit configuration
├── vite.config.ts                # Vite + Tailwind plugin
├── tsconfig.json                 # TypeScript configuration
├── package.json                  # Dependencies & scripts
└── eslint.config.js              # ESLint configuration
```

### Directory Responsibilities

| Directory             | Responsibility                                                      |
|-----------------------|---------------------------------------------------------------------|
| `lib/components/`     | Reusable, presentational Svelte components. No direct API calls.    |
| `lib/stores/`         | Global reactive state using Svelte writable/readable/derived.       |
| `lib/types/`          | Shared TypeScript interfaces and type definitions.                  |
| `lib/data/`           | Static mock data for development and prototyping.                   |
| `lib/services/`       | API client functions that communicate with the backend.             |
| `lib/utils/`          | Pure utility functions (formatters, validators, helpers).           |
| `routes/`             | SvelteKit pages and layouts. Each `+page.svelte` is a route.        |

---

## `/backend` — NestJS Application

```
backend/
├── prisma/
│   └── schema.prisma             # Database models, relations, migrations
│
├── src/
│   ├── main.ts                   # Application bootstrap
│   ├── app.module.ts             # Root module (imports all feature modules)
│   ├── app.controller.ts         # Health check / root endpoint
│   ├── app.service.ts            # Root service
│   │
│   ├── prisma/                   # Prisma Client DI module
│   │   ├── prisma.module.ts            # Global module exporting PrismaService
│   │   └── prisma.service.ts           # Extends PrismaClient, handles lifecycle
│   │
│   ├── chat/                     # Chat module
│   │   ├── chat.module.ts
│   │   ├── chat.controller.ts          # REST endpoints for conversations
│   │   ├── chat.service.ts             # Chat business logic
│   │   ├── chat.gateway.ts             # WebSocket gateway for real-time messaging
│   │   ├── dto/
│   │   │   ├── create-message.dto.ts
│   │   │   └── conversation-response.dto.ts
│   │   └── entities/
│   │       ├── message.entity.ts
│   │       └── conversation.entity.ts
│   │
│   ├── contacts/                 # Contacts module
│   │   ├── contacts.module.ts
│   │   ├── contacts.controller.ts      # CRUD endpoints for contacts
│   │   ├── contacts.service.ts         # Contact business logic
│   │   ├── dto/
│   │   │   ├── create-contact.dto.ts
│   │   │   └── contact-response.dto.ts
│   │   └── entities/
│   │       └── contact.entity.ts
│   │
│   ├── whatsapp/                 # WhatsApp integration module
│   │   ├── whatsapp.module.ts
│   │   ├── whatsapp.controller.ts      # Webhook endpoint for WhatsApp
│   │   ├── whatsapp.service.ts         # WhatsApp API integration
│   │   └── dto/
│   │       └── webhook-payload.dto.ts
│   │
│   └── common/                   # Shared utilities, guards, pipes
│       ├── filters/
│       │   └── http-exception.filter.ts
│       ├── pipes/
│       │   └── validation.pipe.ts
│       └── interceptors/
│           └── logging.interceptor.ts
│
├── test/
│   ├── app.e2e-spec.ts           # E2E tests
│   └── jest-e2e.json             # Jest E2E config
│
├── .env.example                  # Environment variables template (DATABASE_URL, EVOLUTION_API_TOKEN, etc.)
├── nest-cli.json                 # NestJS CLI configuration
├── tsconfig.json                 # TypeScript configuration
├── tsconfig.build.json           # Build-specific TS config
├── package.json                  # Dependencies & scripts
└── eslint.config.mjs             # ESLint configuration
```

### Module Responsibilities

| Module          | Responsibility                                                        |
|-----------------|-----------------------------------------------------------------------|
| `prisma/`       | Prisma Client dependency injection and lifecycle management.          |
| `chat/`         | Manage conversations and messages. WebSocket gateway for real-time.   |
| `contacts/`     | CRUD operations for customer contacts.                                |
| `whatsapp/`     | Receive/send WhatsApp messages via webhook and API integration.       |
| `common/`       | Shared exception filters, validation pipes, logging interceptors.     |
