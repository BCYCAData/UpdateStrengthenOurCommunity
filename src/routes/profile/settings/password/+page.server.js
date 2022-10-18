import { supabaseClient } from '$lib/dbClient';
import { error, redirect, invalid } from '@sveltejs/kit';

/** @type {import('./$types').Actions} */
export const actions = {
	default: () => {}
};

export const POST = async ({ locals, request }) => {
	const formData = await request.formData();
	supabaseClient.auth.setAuth(locals.accessToken);
	let password = body.get('password');
	const { error } = await supabaseClient.auth.update({
		password: password
	});
	if (error) {
		console.log('update password settings error:', error.message);
		throw new Error(
			'@migration task: Migrate this return statement (https://github.com/sveltejs/kit/discussions/5774#discussioncomment-3292699)'
		);
		return {
			status: 400,
			body: { errorMessage: error.message }
		};
	}
	throw new Error(
		'@migration task: Migrate this return statement (https://github.com/sveltejs/kit/discussions/5774#discussioncomment-3292699)'
	);
	return {
		status: 200,
		body: { successMessage: 'Your password has been changed.' }
	};
};
