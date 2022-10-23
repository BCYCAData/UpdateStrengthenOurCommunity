import { getSupabase } from '@supabase/auth-helpers-sveltekit';
import { error } from '@sveltejs/kit';

/** @type {import('./$types').PageServerLoad} */
export const load = async (event) => {
	const { session, supabaseClient } = await getSupabase(event);
	if (!session) {
		throw redirect(303, '/auth/signin');
	}
	const { data: profileData, error: profileError } = await supabaseClient
		.from('profile')
		.select('community_workshop_choices,other_community_workshop,will_run_community_workshops')
		.eq('id', session.user.id);
	if (profileError) {
		console.log('error profileWorkshops:', profileError);
		throw error(400, profileError.message);
	}
	if (profileData.length === 1) {
		const profileWorkshops = profileData[0];
		if (null == profileWorkshops.community_workshop_choices) {
			profileWorkshops.community_workshop_choices = [];
		}
		return {
			user: session.user,
			profileWorkshops: profileWorkshops
		};
	}
	throw error(400, 'Something went wrong retrieving the Profile My Community Workshops data');
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
				community_workshop_choices: formData.getAll('community_workshop_choices'),
				other_community_workshop: formData.get('other_community_workshop'),
				will_run_community_workshops: formData.get('will_run_community_workshops')
			})
			.eq('id', session.user.id)
			.select();
		if (profileError) {
			console.log('update error profileWorkshops:', profileError);
			throw error(400, profileError.message);
		}
		if (profileData.length === 1) {
			const profileWorkshops = profileData[0];
			return {
				user: session.user,
				profileWorkshops: profileWorkshops
			};
		}
		throw error(400, 'Could not POST Profile My Community Workshops data');
	}
};
