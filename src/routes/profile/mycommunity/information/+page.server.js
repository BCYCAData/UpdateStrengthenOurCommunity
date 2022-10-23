import { getSupabase } from '@supabase/auth-helpers-sveltekit';
import { error, redirect } from '@sveltejs/kit';

/** @type {import('./$types').PageServerLoad} */
export const load = async (event) => {
	const { session, supabaseClient } = await getSupabase(event);
	if (!session) {
		throw redirect(303, '/auth/signin');
	}
	const { data: profileData, error: profileError } = await supabaseClient
		.from('profile')
		.select('information_sheet_choices,other_information_sheet')
		.eq('id', session.user.id);
	if (profileError) {
		console.log('error profileInformation:', profileError);
		throw error(400, profileError.message);
	}
	if (profileData.length === 1) {
		const profileInformation = profileData[0];
		if (null == profileInformation.information_sheet_choices) {
			profileInformation.information_sheet_choices = [];
		}
		return {
			user: session.user,
			profileInformation: profileInformation
		};
	}
	throw error(400, 'Something went wrong retrieving the Profile My Community Information data.');
};
/** @type {import('./$types').Actions} */
export const actions = {
	default: async (event) => {
		const { request } = event;
		const { session, supabaseClient } = await getSupabase(event);
		if (!session) {
			throw error(403, { message: 'Unauthorized' });
		}
		const formData = await request.formData();
		const { data: profileData, error: profileError } = await supabaseClient
			.from('profile')
			.update({
				information_sheet_choices: formData.getAll('information_sheet_choices'),
				other_information_sheet: formData.get('other_information_sheet')
			})
			.eq('id', session.user.id)
			.select();
		if (profileError) {
			console.log('update error profileInformation:', profileError);
			throw error(400, profileError.message);
		}
		if (profileData.length === 1) {
			const profileInformation = profileData[0];
			return {
				user: session.user,
				profileInformation: profileInformation
			};
		}
		throw error(400, 'Could not POST Profile Information data');
	}
};
