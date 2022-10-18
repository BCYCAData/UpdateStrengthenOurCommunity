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
				.select('information_sheet_choices,other_information_sheet')
				.eq('id', session.user.id);
			if (profileError) {
				console.log('error profileInformation:', profileError);
				throw error(400, profileError.message);
			}
			if (profileData.length === 1) {
				let profileInformation = profileData[0];
				if (null == profileInformation.information_sheet_choices) {
					profileInformation.information_sheet_choices = [];
				}
				return profileInformation;
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
					information_sheet_choices: body.getAll('information_sheet_choices'),
					other_information_sheet: formData.get('other_information_sheet')
				})
				.eq('id', session.user.id);
			if (profileError) {
				console.log('update error profileInformation:', profileError);
				throw error(400, profileError.message);
			}
			// if (profileData.length === 1) {
			// 	let profileInformation = profileData[0];
			// 	return {
			// 		status: 200,
			// 		body: { profileInformation }
			// 	};
			// }
			throw error(400, 'Could not POST Profile Information data');
		}
	);
