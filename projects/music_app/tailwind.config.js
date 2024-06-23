/** @type {import('tailwindcss').Config} */
export default {
	content: ['./src/**/*.{html,js,svelte,ts}'],
	theme: {
		extend: {
			colors: {
				primary: '#000000', // 黒色
				secondary: '#1C1C1C', // 暗い灰色
				tertiary: '#333333', // さらに暗い灰色
				quaternary: '#4D4D4D' // 淡い灰色
			}
		}
	},
	plugins: []
};
