// import { supabaseClient, supabaseRedirectBase } from '$lib/dbClient';
import { invalid, redirect } from '@sveltejs/kit';
import { getSupabase } from '@supabase/auth-helpers-sveltekit';

export async function load({ locals }) {
	if (locals.user) {
		throw redirect(303, '/profile');
	}
	return;
}

/** @type {import('./$types').Actions} */
export const actions = {
	default: async (event) => {
		const { request } = event;
		const { supabaseClient } = await getSupabase(event);
		const formData = await request.formData();
		const email = formData.get('email');
		const password = formData.get('password');
		const { error } = await supabaseClient.auth.signInWithPassword({ email, password });
		if (error) {
			if (error && error.status === 400) {
				return invalid(400, {
					error: 'Invalid credentials.',
					values: {
						email
					}
				});
			}
			return invalid(500, {
				error: 'Server error. Try again later.',
				values: {
					email
				}
			});
		}

		throw redirect(303, '/profile');
	}
	// },

	// signout: async (event) => {
	// 	const { supabaseClient } = await getSupabase(event);
	// 	await supabaseClient.auth.signOut();
	// 	throw redirect(303, '/');
	// }
};

// export async function POST({ request }) {
// 	const data = await request.formData();
// 	const email = data.get('email');
// 	const password = data.get('password');
// 	const headers = { location: '/profile' };

// 	const { session, error: supabaseError } = await supabaseClient.auth.signIn({ email, password });

// 	if (supabaseError) {
// 		throw error(400, supabaseError.message);
// 	}

// 	if (session) {
// 		const response = await fetch(`${supabaseRedirectBase}/api/auth/callback`, {
// 			method: 'POST',
// 			headers: new Headers({ 'Content-Type': 'application/json' }),
// 			credentials: 'same-origin',
// 			body: JSON.stringify({ event: 'SIGNED_IN', session })
// 		});

// 		// TODO: Add helper inside of auth-helpers-sveltekit library to manage this better
// 		const cookies = response.headers
// 			.get('set-cookie')
// 			.split('SameSite=Lax, ')
// 			.map((cookie) => {
// 				if (!cookie.includes('SameSite=Lax')) {
// 					cookie += 'SameSite=Lax';
// 				}
// 				return cookie;
// 			});
// 		headers['Set-Cookie'] = cookies;
// 	}
// 	throw error(400, 'Sign In error');
// }
