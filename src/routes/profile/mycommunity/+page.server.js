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
				.select(
					'stay_in_touch_choices,postal_address_street,postal_address_suburb,postal_address_postcode,other_comments'
				)
				.eq('id', session.user.id);
			if (profileError) {
				console.log('error profileCommunity:', profileError);
				throw error(400, profileError.message);
			}
			if (profileData.length === 1) {
				let profileCommunity = profileData[0];
				if (null == profileCommunity.stay_in_touch_choices) {
					profileCommunity.stay_in_touch_choices = [];
				}
				return profileCommunity;
			}
			throw error(400, 'Could not GET Profile Community data');
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
					stay_in_touch_choices: body.getAll('stay_in_touch_choices'),
					postal_address_street: formData.get('postal_address_street'),
					postal_address_suburb: formData.get('postal_address_suburb'),
					postal_address_postcode: formData.get('postal_address_postcode'),
					other_comments: formData.get('other_comments')
				})
				.eq('id', session.user.id);
			if (profileError) {
				console.log('update error profileCommunity:', profileError);
				throw error(400, profileError.message);
			}
			// if (profileData.length === 1) {
			// 	let profileCommunity = profileData[0];
			// 	return {
			// 		status: 200,
			// 		body: { profileCommunity }
			// 	};
			// }
			throw error(400, 'Could not POST Profile Community');
		}
	);
