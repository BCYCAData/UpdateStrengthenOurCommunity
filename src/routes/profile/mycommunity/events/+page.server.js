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
				.select('community_meeting_choices,other_community_meeting')
				.eq('id', session.user.id);
			if (profileError) {
				console.log('error profileEvents:', profileError);
				throw error(400, profileError.message);
			}
			if (profileData.length === 1) {
				let profileEvents = profileData[0];
				if (null == profileEvents.community_meeting_choices) {
					profileEvents.community_meeting_choices = [];
				}
				return profileEvents;
			}
			throw error(400, 'Could not GET Profile Events data');
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
			const { data: profileData, profileError } = await supabaseClient
				.from('profile')
				.update({
					community_meeting_choices: body.getAll('community_meeting_choices'),
					other_community_meeting: formData.get('other_community_meeting')
				})
				.eq('id', session.user.id);
			if (profileError) {
				console.log('update error profileEvents:', profileError);
				throw error(400, profileError.message);
			}
			// if (profileData.length === 1) {
			// 	let profileEvents = profileData[0];
			// 	return {
			// 		status: 200,
			// 		body: { profileEvents }
			// 	};
			// }
			throw error(400, 'Could not POST Profile Events data');
		}
	);
