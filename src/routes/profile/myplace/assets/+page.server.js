import { getSupabase } from '@supabase/auth-helpers-sveltekit';
import { error, redirect } from '@sveltejs/kit';

/** @type {import('./$types').PageServerLoad} */
export const load = async (event) => {
	const { session, supabaseClient } = await getSupabase(event);
	if (!session) {
		throw redirect(303, '/auth/signin');
	}
	const { data: profileData, error: errorProfile } = await supabaseClient
		.from('profile')
		.select(
			'number_dogs,number_cats,number_birds,number_other_pets,live_stock_present,live_stock_safe_area,share_livestock_safe_area,other_essential_assets'
		)
		.eq('id', session.user.id);
	if (errorProfile) {
		console.log('error profileAssets:', errorProfile);
		throw error(400, errorProfile.message);
	}
	if (profileData.length === 1) {
		let profileAssets = profileData[0];
		return profileAssets;
	}
	throw error(400, 'Could not GET Profile Assets data');
};

export const POST = async ({ locals, request }) =>
	withApiAuth(
		{
			redirectTo: '/auth/signin',
			user: locals.user
		},
		async () => {
			const formData = await request.formData();
			const { data: profileData, error: errorProfile } = await supabaseClient
				.from('profile')
				.update({
					number_dogs: parseInt(formData.get('number_dogs')) || 0,
					number_cats: parseInt(formData.get('number_cats')) || 0,
					number_birds: parseInt(formData.get('number_birds')) || 0,
					number_other_pets: parseInt(formData.get('number_other_pets')) || 0,
					live_stock_present: formData.get('live_stock_present'),
					live_stock_safe_area: formData.get('live_stock_safe_area'),
					share_livestock_safe_area: formData.get('share_livestock_safe_area'),
					other_essential_assets: formData.get('other_essential_assets')
				})
				.eq('id', session.user.id);
			if (errorProfile) {
				console.log('update error profileAssets:', errorProfile);
				throw error(400, errorProfile.message);
			}
			// if (profileData.length === 1) {
			// 	let profileAssets = profileData[0];
			// 	return {
			// 		status: 200,
			// 		body: { profileAssets }
			// 	};
			// }
			throw error(400, 'Could not POST Profile Assets data');
		}
	);
