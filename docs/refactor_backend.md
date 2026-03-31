<context>
You are an expert Backend Engineer specializing in NestJS, Prisma, and Event-Driven Architectures. 
The project is a Customer Service SaaS with a WhatsApp Chatbot (Meta API) integrated via n8n.
The chatbot operates as a State Machine. Since n8n is stateless per event, the state and session history are managed in a Supabase (PostgreSQL) database.
The project language (logs, variable names for business logic, and database content) is Brazilian Portuguese (pt-BR).
The project already includes a "skills" directory containing NestJS best practices (Module Sharing, Repository Pattern, Exception Filters, etc.) which MUST be strictly followed.
</context>

<project_structure>
- Framework: NestJS
- ORM: Prisma
- Database: Supabase (PostgreSQL)
- Workflow: n8n (Webhook receiver/State Machine)
- Frontend: Svelte (Communication via API)
- File Structure: \\wsl.localhost\Ubuntu-24.04\home\arthurmendes\projetos\chat-pls-blv\docs\file-structure.md
</project_structure>

<database_schema>
(The schema includes User, Contact, Session, and Message models)
- SessionStatus: BOT, WAITING, ACTIVE, CLOSED.
- SenderType: CONTACT, AGENT, BOT.
- Session model tracks `bot_state` to maintain the State Machine position.
</database_schema>

<task>
Refactor the NestJS Backend to solve two critical issues and implement a simple Auth system:

1. MESSAGE & STATE SYNCHRONIZATION:
   - Ensure that when n8n receives a message, the Backend correctly updates the `Message` table and syncs with the Frontend.
   - Implement a robust logic to verify if a message is from a new or existing user.
   - Refactor the "Switch to Human" logic: When an agent clicks "Assume Attendance", the Session status must change from `BOT` to `ACTIVE` and `userId` must be assigned. The bot must stop responding in n8n when status != `BOT`.

2. AGENT AUTHENTICATION SYSTEM:
   - Implement a simple Login/Password system for Agents.
   - Only the Owner (Admin) can create new Agent accounts.
   - Use JWT for session management (referencing `security-auth-jwt.md` in skills).

3. REPOSITORY & SERVICE PATTERN:
   - Move all database logic from Controllers to Repositories/Services as per the attached skill rules.
</task>

<rules>
- Follow the Repository Pattern (`arch-use-repository-pattern.md`).
- Use Exception Filters for error handling (`error-use-exception-filters.md`).
- Ensure Graceful Shutdown and proper logging (`devops-graceful-shutdown.md`).
- Validate all incoming Data (DTOs) using `security-validate-all-input.md`.
- Keep the code clean, modular, and well-documented in English, but respect the Brazilian Portuguese context for business logic.
</rules>

<expected_output>
- A clear folder structure for the refactored modules (Auth, Messages, Sessions).
- Implementation of the `AuthService` and `AuthStrategy`.
- The logic for the `SessionService` to handle status transitions (BOT <-> ACTIVE).
- Prisma service updates to handle message persistence.
</expected_output>