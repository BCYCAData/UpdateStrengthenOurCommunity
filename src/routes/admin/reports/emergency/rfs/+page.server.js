import { getSupabase } from '@supabase/auth-helpers-sveltekit';
import { error, redirect } from '@sveltejs/kit';

/** @type {import('./$types').PageServerLoad} */
export const load = async (event) => {
	const { session, supabaseClient } = await getSupabase(event);
	if (!session) {
		throw redirect(303, '/auth/signin');
	}
	const { data: dataStreets, error: errorStreets } = await supabaseClient.rpc('get_street_list');
	if (errorStreets) {
		console.log('error errorStreets:', errorStreets);
		throw error(400, errorStreets.message);
	}
	if (dataStreets.length > 0) {
		let streetList = dataStreets.map(({ streets }) => streets);
		return {
			user: session.user,
			streetList: streetList
		};
	}
	throw error(400, 'Something went wrong retrieving the Street List data');
};

export const actions = {
	default: async (event) => {
		const { request } = event;
		const { session, supabaseClient } = await getSupabase(event);
		if (!session) {
			throw error(403, { message: 'Unauthorized' });
		}
		const formData = await request.formData();
		const street = formData.get('property_address_street');
		const { data: streetData, error: streetError } = await supabaseClient.rpc(
			'get_rfs_data_for_street',
			{
				street_input: street
			}
		);
		if (streetError) {
			console.log('update error streetData:', streetError);
			throw error(400, streetError.message);
		}
		if (streetData.length === 1) {
			return {
				user: session.user,
				reportStreet: street,
				streetData: streetData
			};
		}
		throw error(400, 'Could not POST Street data');
	}
};
