<script>
	import { page } from '$app/stores';
	import Icon from '@iconify/svelte';
	import Breadcrumbs from '$components/Breadcrumbs.svelte';

	let pathLables = {
		admin: ['Administration', 'carbon:user-admin'],
		reports: ['Reports', 'carbon:report-data'],
		emergency: ['Emergency', 'carbon:report-data'],
		rfs: ['RFS Information', 'carbon:report-data']
	};
</script>

<div class="wrapper h-full grid bg-orange-100">
	<header class="main-head grid grid-cols-1 max-h-[45px] min-h-[45px] place-items-center ">
		<h3 class="font-bold text-orange-900">Burrell Creek Youth & Community Association Inc.</h3>
	</header>
	<section class="crumbs p-0 max-h-[35px] bg-stone-200">
		<Breadcrumbs path={$page.url.pathname} {pathLables} />
	</section>
	<section class="content min-h-full text-orange-900 bg-orange-300">
		<slot />
	</section>
	<aside class="side p-1 flex flex-col bg-stone-200">
		<div class="flex flex-row justify-around pt-2 text-xl">Administration Menu</div>
		<div class="flex flex-col rounded-lg bg-orange-600">
			<ul
				class="flex flex-row justify-around mx-0 px-2 sm:flex-1 sm:flex-nowrap sm:flex-col list-none"
				id="mainMenu"
			>
				<li class="sm:mt-2 hover:bg-orange-300 rounded items-center">
					<div class="flex flex-row items-center justify-start">
						<a class="flex items-center" href="/admin/reports">
							<Icon icon="carbon:report-data" style="font-size: 24px" />
							<span class="hidden px-2 mt-1 font-semibold sm:inline">Reports</span>
						</a>
					</div>
					<ul class="list-none bg-orange-600">
						<li class="hover:bg-orange-300 rounded mt-1">
							<a href="/admin/reports/emergency">Emergency</a>
						</li>
						<ul class="list-none bg-orange-600">
							<li class="hover:bg-orange-300 rounded mt-1">
								<a href="/admin/reports/emergency/rfs">RFS Information</a>
							</li>
						</ul>
					</ul>
				</li>
			</ul>
		</div>
		<p class="ml-2 ">
			Please make sure you click every heading in the menu on the left <br />
			<b>and</b>
			check your answers to all the questions.
		</p>
		<p class="ml-2 ">
			Remember this is <b>your</b>
			data. To help keep
			<b>you</b>
			prepared.
		</p>
	</aside>
	<div class="messaging bg-stone-200">
		<div class="flex flex-row justify-around pt-2 text-xl">Messages</div>
		<div class="flex flex-col h-full my-4 mx-4">
			<p class="m-2">Congratulations you are now eligible for your FREE Emergency Starter Kit.</p>
			<p class="m-2">We will be in touch soon.</p>
		</div>
	</div>
</div>

<style>
	.main-head {
		grid-area: header;
	}
	.crumbs {
		grid-area: crumbs;
	}
	.side {
		grid-area: sidebar;
	}
	.messaging {
		grid-area: messaging;
	}
	/* .main-footer {
		grid-area: footer;
	} */
	.wrapper {
		display: grid;
		/* grid-template-rows: 45px auto 1fr 0.25fr 45px; */
		grid-auto-rows: min-content;
		grid-template-areas:
			'header'
			'sidebar'
			'crumbs'
			'content'
			'messaging';
	}
	@media (min-width: 640px) {
		.wrapper {
			grid-template-columns: 1fr 3fr;
			grid-template-rows: 45px auto 1fr 0.5fr;
			grid-template-areas:
				'header  header'
				'sidebar     crumbs'
				'sidebar content'
				'messaging      messaging';
		}
	}
	@media (min-width: 1024px) {
		.wrapper {
			grid-template-columns: 1fr 4fr 1fr;
			grid-template-rows: 45px auto 1fr;
			grid-template-areas:
				'header header header'
				'sidebar crumbs messaging'
				'sidebar content messaging';
		}
	}
</style>
