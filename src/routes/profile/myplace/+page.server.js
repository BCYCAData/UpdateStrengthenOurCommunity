import { getSupabase } from '@supabase/auth-helpers-sveltekit';
import { error, redirect } from '@sveltejs/kit';

/** @type {import('./$types').PageServerLoad} */
export const load = async (event) => {
	const { session, supabaseClient } = await getSupabase(event);
	if (!session) {
		throw redirect(303, '/auth/signin');
	}
	const { data: profileData, error: profileError } = await supabaseClient
		.from('profile')
		.select(
			'property_address_street,property_address_suburb,property_address_postcode,residency_profile,property_rented,agent_name,agent_mobile,agent_phone,sign_posted,truck_access,truck_access_other_information,residents0_18,residents19_50,residents51_70,residents71_,vulnerable_residents'
		)
		.eq('id', session.user.id);
	if (profileError) {
		console.log('error profileMyPlace:', profileError);
		throw error(400, profileError.message);
	}
	if (profileData.length === 1) {
		let profileMyPlace = profileData[0];
		return {
			user: session.user,
			profileMyPlace
		};
	}
	throw error(400, 'Something went wrong retrieving the Profile About Me data.');
};

/** @type {import('./$types').Actions} */
export const actions = {
	default: async (event) => {
		const { request } = event;
		const { session, supabaseClient } = await getSupabase(event);
		if (!session) {
			throw error(403, { message: 'Unauthorized' });
		}
		const formData = await request.formData();
		const { data: profileData, error: profileError } = await supabaseClient
			.from('profile')
			.update({
				property_address_street: formData.get('property_address_street'),
				property_address_suburb: formData.get('property_address_suburb'),
				property_address_postcode: formData.get('property_address_postcode'),
				residency_profile: formData.get('residency_profile'),
				property_rented: formData.get('property_rented'),
				agent_name: formData.get('agent_name'),
				agent_mobile: formData.get('agent_mobile'),
				agent_phone: formData.get('agent_phone'),
				sign_posted: formData.get('sign_posted'),
				truck_access: parseInt(formData.get('truck_access')),
				truck_access_other_information: formData.get('truck_access_other_information'),
				residents0_18: parseInt(formData.get('residents0_18') || 0),
				residents19_50: parseInt(formData.get('residents19_50') || 0),
				residents51_70: parseInt(formData.get('residents51_70') || 0),
				residents71_: parseInt(formData.get('residents71_') || 0),
				vulnerable_residents: formData.get('vulnerable_residents')
			})
			.eq('id', session.user.id);
		const profileMyPlace = profileData[0];
		if (profileError) {
			console.log('update error profileMyPlace:', profileError);
			throw error(400, profileError.message);
		}
		return {
			user: session.user,
			profileMyPlace: profileMyPlace
		};
	}
};
