import { json as json$1 } from '@sveltejs/kit';
import { supabaseClient } from '$lib/dbClient';

export async function POST({ request }) {
	const data = await request.json();
	const { user } = await supabaseClient.auth.getUser(data.token);
	const { data: survey } = await supabaseClient.rpc('user_has_survey_results', {
		email_input: user.email
	});
	return json$1(
		{
			redirect: survey
		},
		{
			headers: {
				'Content-Type': 'application/json'
			}
		}
	);
}
