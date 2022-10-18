import { getSupabase } from '@supabase/auth-helpers-sveltekit';
import { error, redirect } from '@sveltejs/kit';

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
				.select(
					'static_water_available,have_stortz,stortz_size,fire_fighting_resources,fire_hazard_reduction'
				)
				.eq('id', session.user.id);

			if (profileError) {
				console.log('error profileResources:', profileError);
				throw error(400, profileError.message);
			}
			if (profileData.length === 1) {
				let profileResources = profileData[0];
				if (null == profileResources.static_water_available) {
					profileResources.static_water_available = [];
				}
				if (null == profileResources.fire_fighting_resources) {
					profileResources.fire_fighting_resources = [];
				}
				if (null == profileResources.fire_hazard_reduction) {
					profileResources.fire_hazard_reduction = [];
				}
				return profileResources;
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
					static_water_available: body.getAll('static_water_available'),
					have_stortz: formData.get('have_stortz'),
					stortz_size: parseInt(formData.get('stortz_size')) || 0,
					fire_fighting_resources: body.getAll('fire_fighting_resources'),
					fire_hazard_reduction: body.getAll('fire_hazard_reduction')
				})
				.eq('id', session.user.id);
			if (profileError) {
				console.log('update error profileResources:', profileError);
				throw error(400, profileError.message);
			}
			// if (profileData.length === 1) {
			// 	let profileResources = profileData[0];
			// 	return {
			// 		status: 200,
			// 		body: { profileResources }
			// 	};
			// }
			throw error(400, 'Could not POST Profile Resources data');
		}
	);
