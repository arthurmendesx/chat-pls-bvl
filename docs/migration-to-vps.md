<context>
You are a Senior DevOps and Software Architect. The user has a Hostinger VPS (MvN2) running multiple Docker containers. 
There is a Traefik instance (Container: root-traefik-1) managing ports 80/443. 
The goal is to deploy a NestJS Backend for a Customer Service SaaS that will act as the "intelligence" between the Meta API (WhatsApp) and n8n.
The project follows specific NestJS "skills" (Repository Pattern, DTOs, Prisma).
</context>

<infrastructure_details>
- Orchestration: Docker Compose.
- Proxy/SSL: Traefik (already running).
- Database: Supabase (Remote).
- Core Services: n8n (already running), Evolution API (running separately).
- New Service: NestJS Backend (Port 3000).
</infrastructure_details>

<task>
Provide a complete guide to containerize and deploy the NestJS backend using Docker Compose, integrating it with the existing Traefik proxy:

1. DOCKERIZATION:
   - Create an optimized `Dockerfile` for NestJS (multi-stage build to reduce image size for MvN2).
   - Ensure `npm install`, `prisma generate`, and `npm run build` are handled correctly.

2. DOCKER COMPOSE CONFIGURATION:
   - Create a `docker-compose.yml` snippet for the NestJS service.
   - ADD TRAEFIK LABELS: Provide the specific labels required for Traefik to recognize the container and route traffic (e.g., `traefik.http.routers.nestjs.rule=Host('your-ip-or-domain')`).
   - Define environment variables for Database connection and JWT.

3. TRAEFIK ROUTING:
   - Explain how to expose the NestJS backend under a specific path (e.g., `/api`) or use the existing SSL configuration so the Meta API (HTTPS) can reach the webhook.

4. N8N & INTERNAL NETWORKING:
   - Explain how to connect the `root-n8n-1` container to the new NestJS container using the Docker internal network (avoiding external latency).

5. NESTJS SETUP:
   - Code for `main.ts` to enable CORS for the Vercel frontend.
   - Script to run Prisma migrations inside the container.
</task>

<rules>
- DO NOT disrupt the existing Evolution API or n8n containers.
- Use the internal Docker network for n8n <-> NestJS communication.
- Respect the Brazilian Portuguese business logic but keep technical documentation in English.
- Optimize for MvN2 resources (limit CPU/RAM in docker-compose).
</rules>

<expected_output>
- A production-ready `Dockerfile`.
- A `docker-compose.yml` configuration with Traefik labels.
- Terminal commands to deploy (`docker-compose up -d`).
- A connectivity test plan to ensure Meta -> Traefik -> NestJS -> Supabase is working.
</expected_output>