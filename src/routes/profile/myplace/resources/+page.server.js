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
			'static_water_available,have_stortz,stortz_size,fire_fighting_resources,fire_hazard_reduction'
		)
		.eq('id', session.user.id)
		.select();

	if (profileError) {
		console.log('error profileResources:', profileError);
		throw error(400, profileError.message);
	}
	if (profileData.length === 1) {
		const profileResources = profileData[0];
		if (null == profileResources.static_water_available) {
			profileResources.static_water_available = [];
		}
		if (null == profileResources.fire_fighting_resources) {
			profileResources.fire_fighting_resources = [];
		}
		if (null == profileResources.fire_hazard_reduction) {
			profileResources.fire_hazard_reduction = [];
		}
		return {
			user: session.user,
			profileResources: profileResources
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
				static_water_available: formData.getAll('static_water_available'),
				have_stortz: formData.get('have_stortz'),
				stortz_size: parseInt(formData.get('stortz_size')) || 0,
				fire_fighting_resources: formData.getAll('fire_fighting_resources'),
				fire_hazard_reduction: formData.getAll('fire_hazard_reduction')
			})
			.eq('id', session.user.id)
			.select();
		if (profileError) {
			console.log('update error profileResources:', profileError);
			throw error(400, profileError.message);
		}
		if (profileData.length === 1) {
			const profileResources = profileData[0];
			return {
				user: session.user,
				profileResources: profileResources
			};
		}
		throw error(400, 'Could not POST Profile Assets data');
	}
};
