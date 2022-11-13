import { getSupabase } from '@supabase/auth-helpers-sveltekit';
import { redirect, error } from '@sveltejs/kit';

let validations = [];

export const passwordStrength = (password) => {
	validations = [
		password.length > 8,
		password.search(/[A-Z]/) > -1,
		password.search(/[0-9]/) > -1,
		password.search(/[$&+,:;=?@#!]/) > -1
	];
	let strength = validations.reduce((acc, cur) => acc + cur, 0);
};

export const formatMobile = (mobileNumber, digit) => {
	mobileNumber += digit;
	if (mobileNumber.length == 4) {
		mobileNumber += ' ';
	}
	if (mobileNumber.length == 8) {
		mobileNumber += ' ';
	}
	return mobileNumber;
};

export const formatPhone = (phoneNumber, digit) => {
	phoneNumber += digit;
	if (phoneNumber.length == 4) {
		phoneNumber += ' ';
	}
	return phoneNumber;
};

export const getFormBody = (body) => {
	return [...body.entries()].reduce((data, [k, v]) => {
		let value = v;
		if (value === 'true') value = true;
		if (value === 'false') value = false;
		if (k in data) data[k] = Array.isArray(data[k]) ? [...data[k], value] : [data[k], value];
		else data[k] = value;
		return data;
	}, {});
};

export const resetProfile = async (survey, event) => {
	const { session, supabaseClient } = await getSupabase(event);
	if (!session) {
		throw redirect(303, '/auth/signin');
	}
	const { error: profileErrorUpdate } = await supabaseClient(event)
		.from('profile')
		.update({
			property_address_street: survey.property_address,
			property_address_suburb: survey.suburb,
			residency_profile: survey.residencyProfile,
			sign_posted: survey.signPosted,
			truck_access: survey.truckAccess,
			truck_access_other_information: survey.truckAccessOther,
			mobile: survey.mobile,
			phone: survey.phone,
			mobile_reception: survey.mobileReception,
			residents0_18: survey.residents0_18,
			residents19_50: survey.residents19_50,
			residents51_70: survey.residents51_70,
			residents71_: survey.residents71_,
			vulnerable_residents: survey.vulnerableResidents,
			number_dogs: survey.numberDogs === 'More' ? 6 : survey.numberDogs,
			number_cats: survey.numberCats === 'More' ? 6 : survey.numberCats,
			number_birds: survey.numberBirds === 'More' ? 6 : survey.numberBirds,
			number_other_pets: survey.numberOtherPets === 'More' ? 6 : survey.numberOtherPets,
			live_stock_present: survey.liveStockPresent,
			live_stock_safe_area: survey.liveStockSafeArea,
			share_livestock_safe_area: survey.shareLiveStockSafeArea,
			static_water_available: setArray(survey.staticWaterAvailable),
			have_stortz: survey.haveStortz,
			stortz_size: survey.stortzSize,
			fire_fighting_resources: setArray(survey.fireFightingResources),
			site_hazards: setArray(survey.explosiveHazards),
			other_site_hazards: survey.otherSiteHazards,
			fire_hazard_reduction: setArray(survey.fireHazardReduction),
			land_adjacent_hazard: survey.landAdjacentHazard,
			other_hazards: survey.otherHazards,
			rfs_survival_plan: survey.rfsSurvivalPlan === 'Y' ? true : false,
			send_rfs_survival_plan: survey.rfsSurvivalPlan === 'S' ? true : false,
			fire_fighting_experience: survey.fireFightingExperience,
			plan_to_leave_before_fire: survey.planToLeaveBeforeFire,
			plan_to_leave_before_flood: survey.planToLeaveBeforeFlood,
			community_workshop_choices: setArray(survey.communityWorkshopChoices),
			other_community_workshop: survey.otherCommunityWorkshop,
			will_run_community_workshops: survey.willRunCommunityWorkshops,
			information_sheet_choices: setArray(survey.informationSheetChoices),
			other_information_sheet: survey.otherInformationSheet,
			community_meeting_choices: setArray(survey.communityMeetingChoices),
			other_community_meeting: survey.communityMeeting,
			stay_in_touch_choices: setArray(survey.stayInTouchChoices),
			other_comments: survey.otherComments
		})
		.eq('id', session.user.id);
	if (profileErrorUpdate) {
		console.log('error Update Profile from Survey:', profileErrorUpdate);
		throw error(400, profileErrorUpdate.message);
	}
	const { error: errorSurveyUpdate } = await supabaseClient(request)
		.from('survey_responses')
		.update({
			invited: session.user.id
		})
		.eq('email_address', session.user.email);
	console.log('updated survey_responses', session.user.email, session.user.id);
	if (errorSurveyUpdate) {
		console.log('error Update Survey Responses:', errorSurveyUpdate);
		throw error(400, errorSurveyUpdate.message);
	}
};

function setArray(value) {
	if (value == null) {
		return [];
	} else if (Array.isArray(value)) {
		return value;
	}
	let result = new Array();
	result[0] = value;
	return result;
}
