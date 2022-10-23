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
		.select('community_meeting_choices,other_community_meeting')
		.eq('id', session.user.id);
	if (profileError) {
		console.log('error profileEvents:', profileError);
		throw error(400, profileError.message);
	}
	if (profileData.length === 1) {
		const profileEvents = profileData[0];
		if (null == profileEvents.community_meeting_choices) {
			profileEvents.community_meeting_choices = [];
		}
		return {
			user: session.user,
			profileEvents: profileEvents
		};
	}
	throw error(400, 'Something went wrong retrieving the Profile Events data');
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
		const { data: profileData, profileError } = await supabaseClient
			.from('profile')
			.update({
				community_meeting_choices: formData.getAll('community_meeting_choices'),
				other_community_meeting: formData.get('other_community_meeting')
			})
			.eq('id', session.user.id)
			.select();
		if (profileError) {
			console.log('update error profileEvents:', profileError);
			throw error(400, profileError.message);
		}
		if (profileData.length === 1) {
			const profileEvents = profileData[0];
			return {
				user: session.user,
				profileEvents: profileEvents
			};
		}
		throw error(400, 'Could not POST Profile Events data');
	}
};
