import { getSupabase } from '@supabase/auth-helpers-sveltekit';
import { error } from '@sveltejs/kit';

/** @type {import('./$types').RequestHandler} */
export const POST = async (event) => {
	const { session, supabaseClient } = await getSupabase(event);
	if (!session) {
		throw error(401, { message: 'Invalid email address' });
	}
	const formData = await event.request.formData();
	let password = formData.get('password');
	let email = formData.get('email');
	if (password) {
		const { error: supabaseError } = await supabaseClient.auth.updateUser({
			password: formData.get('password')
		});
		if (supabaseError) {
			console.log('update user error:', supabaseError);
			throw error(401, { message: supabaseError.message });
		}
		return new Response('Your password has been changed.', {
			status: 302,
			headers: { Location: '/profile/settings/password' }
		});
	} else if (email) {
		const { error: supabaseError } = await supabaseClient.auth.updateUser({
			email: email
		});
		if (supabaseError) {
			console.log('update email settings error:', supabaseError);
			throw error(401, { message: supabaseError.message });
		}
		return new Response('Your email has been changed.', {
			status: 302,
			headers: { Location: '/profile/settings/email' }
		});
	}

	return new Response(undefined, { status: 302, headers: { Location: '/profile/settings' } });
};
