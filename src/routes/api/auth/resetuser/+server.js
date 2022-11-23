import { getSupabase } from '@supabase/auth-helpers-sveltekit';
import { error } from '@sveltejs/kit';

/** @type {import('./$types').RequestHandler} */
export const POST = async (event) => {
	const { session, supabaseClient } = await getSupabase(event);
	if (!session) {
		throw error(401, { message: 'Invalid email address' });
	}
	const { error: supabaseError } = await supabaseClient.auth.updateUser({
		password: formData.get('password')
	});
	if (supabaseError) {
		console.log('update user error:', supabaseError.message);
		throw error(401, { message: supabaseError.message });
	}
	return new Response(undefined, { status: 302, headers: { Location: '/profile' } });
};
