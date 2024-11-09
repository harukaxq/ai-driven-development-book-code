import { sveltekit } from '@sveltejs/kit/vite';
import { defineConfig } from 'vitest/config';
import {svelteTesting} from '@testing-library/svelte/vite'

export default defineConfig({
	server: {
		fs: {
			allow: ['./static'],
		},
	},
	plugins: [sveltekit(), svelteTesting()],
	test: {
		include: ['src/**/*.{test,spec}.{js,ts}'],
		globals: true,
		environment: 'jsdom',
		setupFiles: ['./vitest-setup.js'],
		fileParallelism: false
	}
});
