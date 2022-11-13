import { supabaseClient } from '$lib/dbClient';
import { error } from '@sveltejs/kit';

let mapData = { jsonLayers: [] };

/** @type {import('./$types').Actions} */
export const actions = {
	default: () => {}
};

export const load = async () => {
	const { data: allPoints, error: errorAll } = await supabaseClient
		.from('address_point_extract_wgs84')
		.select('geom,addresspointtype');
	if (errorAll) {
		console.log('error get Addresspoints:', errorAll);
		throw error(400, errorAll);
	}
	if (allPoints.length > 0) {
		mapData.jsonLayers[0] = allPoints;
	}
	const { data: registeredPoints, error: errorRegistered } = await supabaseClient.rpc(
		'get_registered_addresspoints'
	);
	if (errorRegistered) {
		console.log('error get registetred Addresspoints:', errorRegistered);
		throw error(400, errorRegistered);
	}
	if (registeredPoints.length > 0) {
		mapData.jsonLayers[1] = registeredPoints;
	}
	if (mapData.jsonLayers.length > 0) {
		return { mapData };
	}
	throw error(400, 'Something went wrong with the map');
};
