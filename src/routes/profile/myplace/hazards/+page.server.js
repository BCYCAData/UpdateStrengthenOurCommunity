import { getSupabase } from '@supabase/auth-helpers-sveltekit';
import { error, redirect } from '@sveltejs/kit';

/** @type {import('./$types').Actions} */
export const actions = {
	default: () => {}
};

/** @type {import('./$types').PageServerLoad} */
export const load = async ({ locals, request }) =>
	withApiAuth(
		{
			redirectTo: '/auth/signin',
			user: locals.user
		},
		async () => {
			const { data: profileData, error: profileError } = await supabaseClient
				.from('profile')
				.select('site_hazards,other_site_hazards,land_adjacent_hazard,other_hazards')
				.eq('id', session.user.id);
			if (profileError) {
				console.log('error profileHazards:', profileError);
				throw error(400, profileError.message);
			}
			if (profileData.length === 1) {
				let profileHazards = profileData[0];
				if (null == profileHazards.site_hazards) {
					profileHazards.site_hazards = [];
				}
				return profileHazards;
			}
			throw error(400, 'Could not GET Profile Hazards data');
		}
	);

export const POST = async ({ locals, request }) =>
	withApiAuth(
		{
			redirectTo: '/auth/signin',
			user: locals.user
		},
		async () => {
			const formData = await request.formData();
			const { data: profileData, error: profileError } = await supabaseClient
				.from('profile')
				.update({
					site_hazards: body.getAll('site_hazards'),
					other_site_hazards: formData.get('other_site_hazards'),
					land_adjacent_hazard: formData.get('land_adjacent_hazard'),
					other_hazards: formData.get('other_hazards')
				})
				.eq('id', session.user.id);
			if (profileError) {
				console.log('update error profileHazards:', profileError);
				throw error(400, profileError.message);
			}
			// if (profileData.length === 1) {
			// 	let profileHazards = profileData[0];
			// 	return {
			// 		status: 200,
			// 		body: { profileHazards }
			// 	};
			// }
			throw error(400, 'Could not POST Profile Hazards data');
		}
	);
