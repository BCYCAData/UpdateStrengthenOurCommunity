import adapter from '@sveltejs/adapter-auto';

/** @type {import('@sveltejs/kit').Config} */
const config = {
	kit: {
		// default options are shown
		adapter: adapter(),
		alias: {
			$components: 'src/components',
			$stores: './src/stores'
		}
	},
	vitePlugin: {
		emitCss: false,
		experimental: {
			inspector: true
		}
	},
	compilerOptions: {
		css: 'injected'
	}
};

export default config;
