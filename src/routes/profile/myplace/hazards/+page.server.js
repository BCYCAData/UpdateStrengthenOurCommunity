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
		.select('site_hazards,other_site_hazards,land_adjacent_hazard,other_hazards')
		.eq('id', session.user.id);
	if (profileError) {
		console.log('error profileHazards:', profileError);
		throw error(400, profileError.message);
	}
	if (profileData.length === 1) {
		const profileHazards = profileData[0];
		if (null == profileHazards.site_hazards) {
			profileHazards.site_hazards = [];
		}
		return {
			user: session.user,
			profileHazards: profileHazards
		};
	}
	throw error(400, 'Something went wrong retrieving the Profile Assets data.');
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
				site_hazards: formData.getAll('site_hazards'),
				other_site_hazards: formData.get('other_site_hazards'),
				land_adjacent_hazard: formData.get('land_adjacent_hazard'),
				other_hazards: formData.get('other_hazards')
			})
			.eq('id', session.user.id)
			.select();
		if (profileError) {
			console.log('update error profileAssets:', profileError);
			throw error(400, profileError.message);
		}
		if (profileData.length === 1) {
			const profileHazards = profileData[0];
			return {
				user: session.user,
				profileHazards: profileHazards
			};
		}
		throw error(400, 'Could not POST Profile Assets data');
	}
};
