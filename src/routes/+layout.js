import { getSupabase } from '@supabase/auth-helpers-sveltekit';

/** @type {import('./$types').LayoutServerLoad} */
export const load = async (event) => {
	const { session } = await getSupabase(event);
	return { session };
};
