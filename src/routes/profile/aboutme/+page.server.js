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
			'first_name,family_name,mobile,phone,mobile_reception,rfs_survival_plan,send_rfs_survival_plan,fire_fighting_experience,fire_trauma,plan_to_leave_before_fire,plan_to_leave_before_flood'
		)
		.eq('id', session.user.id);
	if (profileError) {
		throw error(400, profileError.message);
	}
	if (profileData.length === 1) {
		let profileAboutMe = profileData[0];
		return {
			user: session.user,
			profileAboutMe
		};
	}
	throw error(400, 'Something went wrong retrieving the Profile About Me data.');
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
				first_name: formData.get('first_name'),
				family_name: formData.get('family_name'),
				phone: formData.get('phone'),
				mobile: formData.get('mobile'),
				mobile_reception: parseInt(formData.get('mobile_reception')),
				rfs_survival_plan: formData.get('rfs_survival_plan'),
				fire_fighting_experience: formData.get('fire_fighting_experience'),
				fire_trauma: formData.get('fire_trauma'),
				plan_to_leave_before_fire: formData.get('plan_to_leave_before_fire'),
				plan_to_leave_before_flood: formData.get('plan_to_leave_before_flood')
			})
			.eq('id', session.user.id)
			.select();
		const profileAboutMe = profileData[0];
		if (profileError) {
			console.log('update error profileAboutMe:', profileError);
			throw error(400, profileError.message);
		}
		return {
			user: session.user,
			profileAboutMe: profileAboutMe
		};
	}
};
