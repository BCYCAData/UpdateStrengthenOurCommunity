import { json as json$1 } from '@sveltejs/kit';
import { supabaseClient } from '$lib/dbClient';

export async function POST({ request }) {
	const body = await request.json();
	const { data: addressData, error: addressError } = await supabaseClient.rpc(
		'get_addresspoint_from_address',
		{
			address_text: body.streetAddress.toUpperCase(),
			given_suburb: body.suburb.toUpperCase(),
			in_srid_value: 3857,
			out_srid_value: 4326
		}
	);
	if (addressError) {
		console.log('addressError', addressError);
		return json$1({ message: 'Not part of an eligible community.' }, {
			status: 400
		});
	} else {
		let resultData = addressData[0];
		return json$1({
			community_name: resultData.community,
			principaladdresssiteoid: resultData.principaladdresssiteoid,
			address: resultData.valid_address,
			addressPoint: resultData.addresspoint_geom,
			gurasid: resultData.gurasid,
			message: resultData.message
		}, {
			status: resultData.return_status
		});
	}
}
