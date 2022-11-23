<script>
	import { page } from '$app/stores';
	import { supabaseClient } from '$lib/dbClient';
	import { invalidate } from '$app/navigation';
	import { onMount } from 'svelte';

	import Navbar from '$components/header/navbar/Navbar.svelte';

	import '../app.css';
	import 'uno.css';
	import '../../node_modules/leaflet/dist/leaflet.css';

	let showFooter = true;

	onMount(() => {
		const {
			data: { subscription }
		} = supabaseClient.auth.onAuthStateChange(() => {
			invalidate('supabase:auth');
		});

		return () => {
			subscription.unsubscribe();
		};
	});
</script>

<div class="grid w-11/12 mx-auto min-h-screen" id="wrapper">
	<header class="col-span-8 row-span-1">
		<Navbar />
	</header>
	<main class="col-span-8 row-span-21">
		<slot />
	</main>
	<div class="col-span-8 row-span-1">
		<div class="flex items-center text-center content-center justify-around w-full">
			<img
				class="ml-2 mb-2 md:ml-26"
				src="/ag.png"
				alt="Australian Government logo"
				width="auto"
				height="40"
			/>
			<p class="text-[0.6rem] md:text-sm">
				This is a Bushfire Community Recovery & Resilience Fund project through the joint
				Commonwealth/State Disaster Recovery Funding Arrangements
			</p>
			<img
				class="mr-2 mb-2 md:mr-26"
				src="/nswg.jpg"
				alt="NSW Government logo"
				width="auto"
				height="40"
			/>
		</div>
	</div>
	{#if showFooter}
		<footer class="col-span-8 row-span-1 sticky bottom-0">
			<div
				class="flex content-center items-center justify-around bg-orange-600 text-stone-100 w-full h-[45px]"
			>
				<a
					class:active={$page.url.pathname.endsWith('/policies/termsofservice')}
					data-sveltekit-prefetchprefetch
					href="/policies/termsofservice"
				>
					Terms of Service
				</a>
				<h3 id="footer-text">Prepare Connect Rebound</h3>
				<a
					class:active={$page.url.pathname.endsWith('/policies/privacy')}
					data-sveltekit-prefetchprefetch
					href="/policies/privacy"
				>
					Privacy Policy
				</a>
			</div>
		</footer>
	{/if}
</div>

<style>
	#wrapper {
		grid-template-rows: auto 1fr auto;
	}
	#footer-text {
		word-spacing: 30px;
	}
</style>
