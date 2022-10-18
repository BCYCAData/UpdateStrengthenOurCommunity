import { json } from '@sveltejs/kit';
import { supabaseClient } from '$lib/dbClient';

export const POST = async ({ request }) => {
	const formData = await request.formData();
	const { error } = await supabaseClient.auth.api.updateUser(body.get('token'), {
		password: formData.get('password')
	});
	if (error) {
		console.log('reset user error:', error);
		return json(
			{ error },
			{
				status: 400
			}
		);
	}
	return new Response(undefined, { status: 302, headers: { Location: '/about' } });
};
