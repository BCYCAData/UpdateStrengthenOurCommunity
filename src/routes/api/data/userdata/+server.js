import { getSupabase } from '@supabase/auth-helpers-sveltekit';
import { error, json } from '@sveltejs/kit';

/** @type {import('./$types').RequestHandler} */
export const POST = async (event) => {
	const { session, supabaseClient } = await getSupabase(event);
	if (!session) {
		throw error(401, { message: 'Unauthorised' });
	}
	const { data: survey } = await supabaseClient.rpc('user_has_survey_results', {
		email_input: session.user.email
	});
	// return new Response(undefined, { status: 302, headers: { 'Content-Type': 'application/json',Location: '/profile' } });
	return json(
		{
			redirect: survey
		},
		{
			headers: {
				'Content-Type': 'application/json'
			}
		}
	);
};
