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
			'number_dogs,number_cats,number_birds,number_other_pets,live_stock_present,live_stock_safe_area,share_livestock_safe_area,other_essential_assets'
		)
		.eq('id', session.user.id);
	if (profileError) {
		console.log('error profileAssets:', profileError);
		throw error(400, profileError.message);
	}
	if (profileData.length === 1) {
		const profileAssets = profileData[0];
		return {
			user: session.user,
			profileAssets: profileAssets
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
				number_dogs: parseInt(formData.get('number_dogs')) || 0,
				number_cats: parseInt(formData.get('number_cats')) || 0,
				number_birds: parseInt(formData.get('number_birds')) || 0,
				number_other_pets: parseInt(formData.get('number_other_pets')) || 0,
				live_stock_present: formData.get('live_stock_present'),
				live_stock_safe_area: formData.get('live_stock_safe_area'),
				share_livestock_safe_area: formData.get('share_livestock_safe_area'),
				other_essential_assets: formData.get('other_essential_assets')
			})
			.eq('id', session.user.id)
			.select();
		if (profileError) {
			console.log('update error profileAssets:', profileError);
			throw error(400, profileError.message);
		}
		if (profileData.length === 1) {
			const profileAssets = profileData[0];
			return {
				user: session.user,
				profileAssets: profileAssets
			};
		}
		throw error(400, 'Could not POST Profile Assets data');
	}
};
