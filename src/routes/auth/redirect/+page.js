import { page } from '$app/stores';

/** @type {import('./$types').PageLoad} */
export function load({ params }) {
	console.log('page', page.url);
	// if (page.url.hash && page.url.hash === '') {
	// 	const url = page.url;
	// 	return {
	// 		url
	// 	};
	// }

	// const url = new URLSearchParams(page.url.hash.substring(1));
	// return {
	// 	post: {
	// 		redirectType: url.getAll()
	// 	}
	// };
}
