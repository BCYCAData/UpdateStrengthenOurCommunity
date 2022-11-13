import { json } from '@sveltejs/kit';
import { supabaseClient } from '$lib/dbClient';

// export const POST = async ({ request }) => {
export const POST = async ({ locals, request }) => {
	const formData = await request.formData();
	const { error } = await supabaseClient.auth.api.updateUser(formData.get('token'), {
		password: formData.get('password')
	});
	if (error) {
		console.log('update user error:', error);
		return json(
			{ error },
			{
				status: 400
			}
		);
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
			return json(
				{ message: 'Could not get metadata' },
				{
					status: 400
				}
			);
		} else {
			let resultData = addressData[0];
			const { error: updateMetadataError } = await supabaseClient.auth.api.updateUser(
				formData.get('token'),
				{
					data: {
						gurasid: resultData.gurasid,
						principaladdresssiteoid: resultData.principaladdresssiteoid
					}
				}
			);
			if (updateMetadataError) {
				console.log('updateMetadataError', updateMetadataError);
				return json(
					{ message: 'Could not update metadata' },
					{
						status: 400
					}
				);
			}
		}
	}
	return new Response(undefined, { status: 302, headers: { Location: '/profile' } });
};
