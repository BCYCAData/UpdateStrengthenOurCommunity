import { getSupabase } from '@supabase/auth-helpers-sveltekit';
import { error } from '@sveltejs/kit';

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
				.select('community_workshop_choices,other_community_workshop,will_run_community_workshops')
				.eq('id', session.user.id);
			if (profileError) {
				console.log('error profileWorkshops:', profileError);
				throw error(400, profileError.message);
			}
			if (profileData.length === 1) {
				let profileWorkshops = profileData[0];
				if (null == profileWorkshops.community_workshop_choices) {
					profileWorkshops.community_workshop_choices = [];
				}
				return profileWorkshops;
			}
			return {
				status: 400,
				body: {}
			};
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
					community_workshop_choices: body.getAll('community_workshop_choices'),
					other_community_workshop: formData.get('other_community_workshop'),
					will_run_community_workshops: formData.get('will_run_community_workshops')
				})
				.eq('id', session.user.id);
			if (profileError) {
				console.log('update error profileWorkshops:', profileError);
				throw error(400, profileError.message);
			}
			// if (profileData.length === 1) {
			// 	let profileWorkshops = profileData[0];
			// 	return {
			// 		status: 200,
			// 		body: { profileWorkshops }
			// 	};
			// }
			throw error(400, 'Could not POST Profile Workshops data');
		}
	);
