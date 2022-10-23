import { getSupabase } from '@supabase/auth-helpers-sveltekit';

/** @type {import('./$types').Actions} */
export const actions = {
	default: async (event) => {
		const { request } = event;
		const { session, supabaseClient } = await getSupabase(event);
		if (!session) {
			throw error(403, { message: 'Unauthorized' });
		}
		const formData = await request.formData();
		const email = formData.get('email');
		let message = `Your email change request has been received. Check for the confirmation email at ${session.user.email}. `;
		message += '\r\n';
		message += `You will then need to check for a second confirmation email at ${email}`;
		// const { error } = await supabaseClient.auth.updateUser({
		// 	email: email
		// });
		const { error } = await supabaseClient.auth.updateUser({
			email: 'email'
		});
		if (error) {
			console.log('update email settings error:', error);
			return {
				errorMessage: error.message,
				successMessage: ''
			};
		}
		return {
			errorMessage: '',
			successMessage: message
		};
	}
};
