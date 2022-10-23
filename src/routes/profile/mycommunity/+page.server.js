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
		.select(
			'stay_in_touch_choices,postal_address_street,postal_address_suburb,postal_address_postcode,other_comments'
		)
		.eq('id', session.user.id);
	if (profileError) {
		console.log('error profileCommunity:', profileError);
		throw error(400, profileError.message);
	}
	if (profileData.length === 1) {
		const profileCommunity = profileData[0];
		if (null == profileCommunity.stay_in_touch_choices) {
			profileCommunity.stay_in_touch_choices = [];
		}
		return {
			user: session.user,
			profileCommunity: profileCommunity
		};
	}
	throw error(400, 'Something went wrong retrieving the Profile Community data');
};

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
				stay_in_touch_choices: formData.getAll('stay_in_touch_choices'),
				postal_address_street: formData.get('postal_address_street'),
				postal_address_suburb: formData.get('postal_address_suburb'),
				postal_address_postcode: formData.get('postal_address_postcode'),
				other_comments: formData.get('other_comments')
			})
			.eq('id', session.user.id)
			.select();
		if (profileError) {
			console.log('update error profileCommunity:', profileError);
			throw error(400, profileError.message);
		}
		if (profileData.length === 1) {
			const profileCommunity = profileData[0];
			return {
				user: session.user,
				profileCommunity: profileCommunity
			};
		}
		throw error(400, 'Could not POST Profile Community data');
	}
};
