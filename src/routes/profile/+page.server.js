import { getSupabase } from '@supabase/auth-helpers-sveltekit';
import { resetProfile } from '$lib/utils';
import { error, redirect } from '@sveltejs/kit';

/** @type {import('./$types').PageServerLoad} */
export const load = async (event) => {
	const { session, supabaseClient } = await getSupabase(event);
	if (!session) {
		throw redirect(303, '/auth/signin');
	}
	const { data: survey, error: errorSurvey } = await supabaseClient
		.from('survey_responses')
		.select('*')
		.eq('email_address', session.user.email)
		.is('invited', null);
	if (errorSurvey) {
		throw error(400, errorSurvey.message);
	}
	if (survey[0]) {
		await resetProfile(survey[0], event);
	}
	const { data: profileComments, error: errorComments } = await supabaseClient
		.from('profile')
		.select('other_comments')
		.eq('id', session.user.id);
	if (errorComments) {
		console.log('error Get Other Comments:', errorComments);
		throw error(400, errorComments);
	}
	// return profileComments;
	return {
		user: session.user,
		profileComments
	};
};
// export const load = async ({ locals, request }) =>
// 	withApiAuth(
// 		{
// 			redirectTo: '/auth/signin',
// 			user: locals.user
// 		},
// 		async () => {
// 			const { data: survey, error: errorSurvey } = await supabaseClient
// 				.from('survey_responses')
// 				.select('*')
// 				.eq('email_address', locals.user.email)
// 				.is('invited', null);
// 			if (errorSurvey) {
// 				throw error(400, errorSurvey.message);
// 			}
// 			if (survey[0]) {
// 				await resetProfile(survey[0], locals, request);
// 			}
// 			const { data: profileComments, error: errorComments } = await supabaseClient
// 				.from('profile')
// 				.select('other_comments')
// 				.eq('id', session.user.id);
// 			if (errorComments) {
// 				console.log('error Get Other Comments:', errorComments);
// 				throw error(400, errorComments);
// 			}
// 			return profileComments;
// 		}
// 	);
