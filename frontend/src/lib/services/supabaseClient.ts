import { createClient } from '@supabase/supabase-js';

// Usamos as variáveis públicas do SvelteKit ($env/static/public)
// Elas são preenchidas a partir do arquivo .env começando com PUBLIC_
import { PUBLIC_SUPABASE_URL, PUBLIC_SUPABASE_ANON_KEY } from '$env/static/public';

/**
 * Cliente Supabase utilizado EXCLUSIVAMENTE para Realtime (WebSockets).
 * Todo o CRUD (leitura/escrita no banco) passa pela nossa API NestJS.
 */
export const supabase = createClient(PUBLIC_SUPABASE_URL, PUBLIC_SUPABASE_ANON_KEY);
