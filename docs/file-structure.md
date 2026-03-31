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
├── refactor_backend.md # Backend refactoring instructions
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
│   ├── schema.prisma             # Database models, relations, migrations
│   └── seed.ts                   # Admin user seed script
│
├── src/
│   ├── main.ts                   # Application bootstrap (prefix, CORS, shutdown hooks)
│   ├── app.module.ts             # Root module (imports all feature modules)
│   │
│   ├── prisma/                   # Prisma Client DI module
│   │   ├── prisma.module.ts            # Global module exporting PrismaService
│   │   └── prisma.service.ts           # Extends PrismaClient, handles lifecycle
│   │
│   ├── common/                   # Shared utilities, guards, pipes
│   │   ├── common.module.ts            # Registers global exception filter via DI
│   │   ├── enums/
│   │   │   └── session-status.enum.ts  # SessionStatus enum + valid transitions
│   │   └── filters/
│   │       └── http-exception.filter.ts # Global exception filter (pt-BR)
│   │
│   ├── auth/                     # Authentication module
│   │   ├── auth.module.ts              # PassportModule, JwtModule, strategy, guards
│   │   ├── auth.controller.ts          # POST /api/auth/login (public)
│   │   ├── auth.service.ts             # Login validation, JWT generation
│   │   ├── dto/
│   │   │   └── login.dto.ts            # Email + password validation
│   │   ├── strategies/
│   │   │   └── jwt.strategy.ts         # Passport JWT strategy
│   │   ├── guards/
│   │   │   ├── jwt-auth.guard.ts       # JWT authentication guard
│   │   │   └── roles.guard.ts          # RBAC authorization guard
│   │   └── decorators/
│   │       ├── current-user.decorator.ts # @CurrentUser() param decorator
│   │       └── roles.decorator.ts       # @Roles() metadata decorator
│   │
│   ├── users/                    # User management module
│   │   ├── users.module.ts             # Exports UsersService
│   │   ├── users.controller.ts         # CRUD for agents (admin-only)
│   │   ├── users.service.ts            # User business logic, password hashing
│   │   ├── users.repository.ts         # User database operations
│   │   └── dto/
│   │       └── create-user.dto.ts      # Name, email, password validation
│   │
│   ├── contacts/                 # Contacts module
│   │   ├── contacts.module.ts          # Exports ContactsService
│   │   ├── contacts.controller.ts      # CRUD endpoints for contacts
│   │   ├── contacts.service.ts         # Contact business logic
│   │   ├── contacts.repository.ts      # Contact database operations
│   │   └── dto/
│   │       └── create-contact.dto.ts   # Name, phone, avatar, notes validation
│   │
│   ├── sessions/                 # Sessions module
│   │   ├── sessions.module.ts          # Exports SessionsService
│   │   ├── sessions.controller.ts      # List, status, assume, return-to-bot
│   │   ├── sessions.service.ts         # Session business logic & transitions
│   │   ├── sessions.repository.ts      # Session database operations
│   │   └── dto/
│   │       ├── session-filter.dto.ts   # Query filter for listing sessions
│   │       └── update-status.dto.ts    # Status transition validation
│   │
│   ├── chat/                     # Chat/Messages module
│   │   ├── chat.module.ts              # Imports MessagesModule, WhatsAppModule, SessionsModule
│   │   ├── chat.controller.ts          # Get messages, send message
│   │   ├── chat.service.ts             # Chat business logic
│   │   ├── messages.module.ts          # Shared MessagesRepository module
│   │   ├── messages.repository.ts      # Message database operations
│   │   └── dto/
│   │       └── send-message.dto.ts     # Message content validation
│   │
│   └── whatsapp/                 # WhatsApp integration module
│       ├── whatsapp.module.ts          # Imports Contacts, Sessions, MessagesModule
│       ├── whatsapp.controller.ts      # POST /api/webhook/incoming
│       ├── whatsapp.service.ts         # Meta API + incoming message processing
│       ├── dto/
│       │   └── webhook-payload.dto.ts  # Raw Meta Cloud API payload validation
│       └── guards/
│           └── webhook-auth.guard.ts   # Webhook secret header validation
│
├── test/
│   ├── app.e2e-spec.ts           # E2E tests
│   └── jest-e2e.json             # Jest E2E config
│
├── .env.example                  # Environment variables template
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
| `common/`       | Shared exception filters, enums, validation pipes.                    |
| `auth/`         | JWT authentication, login, RBAC guards, decorators.                   |
| `users/`        | User (agent/admin) CRUD and password management.                      |
| `contacts/`     | CRUD operations for customer contacts.                                |
| `sessions/`     | Session lifecycle: BOT ↔ ACTIVE, assume, return-to-bot.              |
| `chat/`         | Message history retrieval and agent message sending.                  |
| `whatsapp/`     | Receive/send WhatsApp messages via webhook and Meta API.              |

### Module Dependency Graph

```
AppModule
├── ConfigModule (global)
├── PrismaModule (global)
├── CommonModule (global filter)
├── AuthModule → UsersModule
├── UsersModule
├── ContactsModule
├── SessionsModule
├── ChatModule → MessagesModule, WhatsAppModule, SessionsModule
└── WhatsAppModule → ContactsModule, SessionsModule, MessagesModule
```
