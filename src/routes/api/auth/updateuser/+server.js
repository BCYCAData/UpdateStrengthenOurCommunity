import { getSupabase } from '@supabase/auth-helpers-sveltekit';
import { error } from '@sveltejs/kit';

/** @type {import('./$types').RequestHandler} */
export const POST = async (event) => {
	const { session, supabaseClient } = await getSupabase(event);
	if (!session) {
		throw error(401, { message: 'Invalid email address' });
	}
	const formData = await event.request.formData();
	const { error: supabaseError } = await supabaseClient.auth.updateUser({
		password: formData.get('password')
	});
	if (supabaseError) {
		console.log('update user error:', supabaseError.message);
		throw error(401, { message: supabaseError.message });
	}
	if (formData.get('mode') === 'invite') {
		const { data: addressData, error: addressError } = await supabaseClient.rpc(
			'get_address_from_survey_email',
			{
				email_input: locals.user.email
			}
		);
		if (addressError) {
			console.log('addressError', addressError);
			throw error(400, 'Could not get metadata');
		} else {
			let resultData = addressData[0];
			const { error: updateMetadataError } = await supabaseClient.auth.updateUser({
				data: {
					gurasid: resultData.gurasid,
					principaladdresssiteoid: resultData.principaladdresssiteoid
				}
			});
			if (updateMetadataError) {
				console.log('updateMetadataError', updateMetadataError);
				throw error(400, 'Could not update metadata');
			}
		}
	}
	return new Response(undefined, { status: 302, headers: { Location: '/profile' } });
};
