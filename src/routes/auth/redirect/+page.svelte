<script>
	import { page } from '$app/stores';
	import PasswordEntry from '$components/form/auth/PasswordEntry.svelte';
	import SignUpSuccess from '$components/form/auth/SignUpSuccess.svelte';
	import { onMount } from 'svelte';

	const url = new URLSearchParams($page.url.hash.substring(1));
	const redirectType = url.get('type');
	console.log(redirectType);
	const message = url.get('message');

	let haveSurvey = false;

	onMount(async () => {
		if (redirectType === 'signup') {
			const response = await fetch('/api/data/userdata', {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json'
				}
			});
			const data = await response.json();
			haveSurvey = data.redirect;
		}
	});
</script>

<svelte:head>
	<title>Redirect</title>
</svelte:head>

{#if redirectType === 'invite'}
	<PasswordEntry {redirectType} {url} />
{:else if redirectType === 'signup'}
	<SignUpSuccess {redirectType} {haveSurvey} />
{:else if redirectType === 'recovery'}
	<PasswordEntry {redirectType} />
{:else if message && redirectType === null}
	<section class="flex flex-col items-center text-center mt-5 sm:mt-1 mx-auto h-full max-w-3xl">
		<h1 class="title-font font-bold underline hidden sm:block sm:text-2xl text-orange-600">
			Strengthen OUR Community
		</h1>
		<div class="bg-green-100 rounded-lg mt-2 text-gray-900 items-center w-full">
			<p class="my-1 text-xl">You need to validate your new email address.</p>
			<p>{message}</p>
		</div>
	</section>
{:else if redirectType === 'email_change'}
	<section class="flex flex-col items-center text-center mt-5 sm:mt-1 mx-auto h-full max-w-3xl">
		<h1 class="title-font font-bold underline hidden sm:block sm:text-2xl text-orange-600">
			Strengthen OUR Community
		</h1>
		<div class="bg-green-100 rounded-lg mt-2 text-gray-900 items-center w-full">
			<p class="my-1 text-xl">Your login email has been changed.</p>
		</div>
	</section>
{:else}
	<section class="flex flex-col items-center text-center mt-5 sm:mt-1 mx-auto h-full max-w-3xl">
		<h1 class="title-font font-bold underline hidden sm:block sm:text-2xl text-orange-600">
			Strengthen OUR Community
		</h1>
		<div class="bg-green-100 rounded-lg mt-2 text-gray-900 items-center w-full">
			<p class="my-1 text-xl">Your request has been lodged.</p>
			<p class="my-1 text-xl">Please check you email inbox to confirm your details.</p>
			<p>You may need to 'Send/Receive'.</p>
			<p>If nothing is showing check your 'Spam' folder.</p>
		</div>
	</section>
{/if}
<h2>{$page.url.searchParams.get('redirect')}</h2>
