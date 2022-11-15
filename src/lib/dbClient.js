import { createClient } from '@supabase/auth-helpers-sveltekit';
import { env } from '$env/dynamic/public';

export const supabaseRedirectBase = env.PUBLIC_SUPABASE_REDIRECT_URL_BASE;

console.log('env', env);

export const supabaseClient = createClient(env.PUBLIC_SUPABASE_URL, env.PUBLIC_SUPABASE_ANON_KEY);
