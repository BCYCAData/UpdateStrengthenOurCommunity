import { supabaseClient } from '$lib/dbClient';
import { invalid } from '@sveltejs/kit';

/** @type {import('./$types').Actions} */
export const actions = {
	default: async ({ request }) => {
		const values = await request.formData();
		const email = /** @type {string} */ (values.get('email'));
		supabaseClient.auth.setAuth(locals.accessToken);
		let message = `Your email change request has been received. Check for the confirmation email at ${locals.user.email}. `;
		message += '\r\n';
		message += `You will then need to check for a second confirmation email at ${email}`;

		const { error: supabaseError } = await supabaseClient.auth.update({
			email: email
		});
		if (supabaseError) {
			console.log('update email settings error:', supabaseError);
			// throw new Error(
			// 	'@migration task: Migrate this return statement (https://github.com/sveltejs/kit/discussions/5774#discussioncomment-3292699)'
			// );
			return invalid(400, { error: supabaseError.message });
		}

		// throw new Error(
		// 	'@migration task: Migrate this return statement (https://github.com/sveltejs/kit/discussions/5774#discussioncomment-3292699)'
		// );
		return { success: message };
	}
};
