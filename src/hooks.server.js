import '$lib/dbClient';

/** @type {import('@sveltejs/kit').Handle} */
export async function handle({ event, resolve }) {
	const response = await resolve(event);
	// console.log('hooks event', event.url);
	return response;
}
