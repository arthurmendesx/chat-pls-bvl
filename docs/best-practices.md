# Best Practices — ChatSupport

> **Mandatory rules** for every developer and AI prompt. No exceptions.

---

## 1. TypeScript — Strict Typing

### Rules

- **`strict: true`** must be enabled in every `tsconfig.json`.
- **`any` is forbidden.** Use `unknown` + type guards when the type is truly unknown.
- Every function must have explicit return types.
- All data structures must be defined as `interface` (prefer) or `type`.
- Use `readonly` for properties that should not be mutated.
- Prefer `const` over `let`; never use `var`.

### Example

```typescript
// ✅ CORRECT
interface Contact {
  readonly id: string;
  name: string;
  phone: string;
  isOnline: boolean;
}

function getContactById(contacts: Contact[], id: string): Contact | undefined {
  return contacts.find((c) => c.id === id);
}

// ❌ WRONG
function getContact(contacts: any, id: any) {
  return contacts.find((c: any) => c.id === id);
}
```

---

## 2. Svelte 5 — Component Patterns

### Script Block

- Always use `<script lang="ts">`.
- Use the Svelte 5 runes API: `$state`, `$derived`, `$effect`, `$props`.
- Keep component scripts short — extract complex logic into separate `.ts` files in `src/lib/utils/` or `src/lib/services/`.

### Props

```svelte
<script lang="ts">
  import type { Contact } from '$lib/types';

  interface Props {
    contact: Contact;
    isActive?: boolean;
    onclick?: (contact: Contact) => void;
  }

  let { contact, isActive = false, onclick }: Props = $props();
</script>
```

### State Management

- **Local state:** use `$state()` rune inside the component.
- **Global/shared state:** use Svelte stores in `src/lib/stores/` (writable, readable, derived).
- **Avoid prop drilling:** if data needs to pass through 3+ levels, use a store or Svelte context.

### File Organization

- One component per file. File name = PascalCase (e.g., `ChatMessage.svelte`).
- Co-locate closely related components in feature folders when needed.

---

## 3. Icons — `lucide-svelte`

- **All SVG icons** must come from the [`lucide-svelte`](https://lucide.dev/) library.
- **Never** add loose `.svg` files to `src/lib/assets/` for icons. The `assets/` folder is reserved exclusively for non-icon assets (e.g., `favicon.svg`).
- Import icons individually to benefit from tree-shaking.

```svelte
<script lang="ts">
  import { Send, Paperclip, Search, X } from 'lucide-svelte';
</script>

<button>
  <Send class="h-4 w-4" />
  Send
</button>
```

---

## 4. NestJS — Backend Patterns

### Architecture

- Follow the **Module → Controller → Service** pattern strictly.
- Each domain gets its own module (e.g., `ChatModule`, `ContactsModule`, `WhatsAppModule`).

### Controllers

- Only handle HTTP concerns: parse request, validate, delegate to service, return response.
- Always use DTOs for request/response bodies.
- Never put business logic in controllers.

```typescript
@Controller('contacts')
export class ContactsController {
  constructor(private readonly contactsService: ContactsService) {}

  @Get(':id')
  async findOne(@Param('id') id: string): Promise<ContactResponseDto> {
    return this.contactsService.findOne(id);
  }
}
```

### Services

- Contain all business logic.
- Injected via constructor using NestJS DI.
- Return typed objects; never return raw DB entities directly to controllers.

### DTOs & Validation

- Use `class-validator` + `class-transformer` for all incoming data.
- DTOs live in `src/<module>/dto/` directory.

```typescript
import { IsString, IsNotEmpty, IsPhoneNumber } from 'class-validator';

export class CreateContactDto {
  @IsString()
  @IsNotEmpty()
  name!: string;

  @IsPhoneNumber()
  phone!: string;
}
```

### Error Handling

- Use NestJS built-in exceptions (`NotFoundException`, `BadRequestException`, etc.).
- Create custom exceptions only when built-in ones don't fit.

---

## 5. Database — Supabase + Prisma

### Stack

- **Database host:** [Supabase](https://supabase.com/) (managed PostgreSQL).
- **ORM:** [Prisma](https://www.prisma.io/) — the **only** way the NestJS backend interacts with the database.

### Rules

- **All models and relations** must be defined in `prisma/schema.prisma`. Never create tables manually via the Supabase dashboard.
- **All schema changes** go through Prisma migrations (`npx prisma migrate dev`). Never use raw SQL migration files outside of Prisma.
- The `DATABASE_URL` environment variable (Supabase connection string) must be stored in `.env` and documented in `.env.example`.
- Use the `PrismaService` (in `src/prisma/`) for dependency injection — never instantiate `PrismaClient` directly in services.
- Always use Prisma's generated types for type safety. Never duplicate model types manually.

### Example — PrismaService

```typescript
import { Injectable, OnModuleInit, OnModuleDestroy } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';

@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit, OnModuleDestroy {
  async onModuleInit(): Promise<void> {
    await this.$connect();
  }

  async onModuleDestroy(): Promise<void> {
    await this.$disconnect();
  }
}
```

---

## 6. Naming Conventions

### Files

| Type                | Convention         | Example                       |
|---------------------|--------------------|-------------------------------|
| Svelte component    | PascalCase         | `ChatMessage.svelte`          |
| TypeScript file     | camelCase          | `mockData.ts`                 |
| NestJS module       | kebab-case folder  | `src/contacts/`               |
| NestJS class        | PascalCase         | `ContactsService`             |
| DTOs                | PascalCase         | `CreateContactDto`            |
| Stores              | camelCase          | `activeContact.ts`            |
| CSS / style         | kebab-case         | `layout.css`                  |

### Variables & Functions

| Type              | Convention  | Example                    |
|-------------------|-------------|----------------------------|
| Variables         | camelCase   | `activeContactId`          |
| Functions         | camelCase   | `getContactById()`         |
| Constants         | UPPER_SNAKE | `MAX_MESSAGE_LENGTH`       |
| Interfaces/Types  | PascalCase  | `ChatMessage`              |
| Enums             | PascalCase  | `MessageSender`            |
| Enum values       | UPPER_SNAKE | `MessageSender.BOT`        |
| Boolean vars      | `is`/`has`  | `isOnline`, `hasUnread`    |

---

## 7. Commit Standards

Follow **Conventional Commits**:

```
<type>(<scope>): <short description>

[optional body]
```

### Types

| Type       | Usage                                       |
|------------|---------------------------------------------|
| `feat`     | New feature                                 |
| `fix`      | Bug fix                                     |
| `docs`     | Documentation only                          |
| `style`    | Formatting, no logic change                 |
| `refactor` | Code restructuring, no feature/fix          |
| `test`     | Adding or updating tests                    |
| `chore`    | Build, tooling, dependencies                |

### Scopes

Use the application area: `frontend`, `backend`, `docs`, `shared`.

### Examples

```
feat(frontend): add ChatMessage component with bot/user variants
fix(backend): validate phone format in CreateContactDto
docs(docs): create design-system.md with Tailwind tokens
```

---

## 8. General Rules

1. **No magic strings.** Use constants or enums.
2. **No commented-out code** in committed files.
3. **No `console.log`** in production code — use a proper logger on the backend.
4. **Keep components under 150 lines.** Extract sub-components if larger.
5. **Write self-documenting code.** Comments explain *why*, not *what*.
6. **Always handle loading and error states** in the UI.
