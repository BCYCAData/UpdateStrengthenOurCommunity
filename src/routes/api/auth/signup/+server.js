import { json } from '@sveltejs/kit';
import { supabaseClient, supabaseRedirectBase } from '$lib/dbClient';

export const POST = async ({ request }) => {
	const formData = await request.formData();
	let password = body.get('password');
	let email = body.get('email');
	let gid = body.get('gid');
	let oid = body.get('oid');
	const { error: errorSignUp } = await supabaseClient.auth.signUp(
		{
			email: email,
			password: password
		},
		{
			data: {
				gurasid: parseInt(gid),
				principaladdresssiteoid: parseInt(oid)
			}
		},
		{
			redirectTo: `${supabaseRedirectBase}/auth/redirect`
		}
	);
	if (errorSignUp) {
		console.log('signup error:', errorSignUp);
		return json(
			{ errorSignUp },
			{
				status: 400
			}
		);
	}
	return new Response(undefined, { status: 302, headers: { Location: '/auth/redirect' } });
};
