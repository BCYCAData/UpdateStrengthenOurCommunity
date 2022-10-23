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
		const { error } = await supabaseClient.auth.updateUser({
			password: formData.get('password')
		});
		if (error) {
			console.log('update password settings error:', error.message);
			return {
				errorMessage: error.message,
				successMessage: ''
			};
		}
		return {
			errorMessage: '',
			successMessage: 'Your password has been changed.'
		};
	}
};
