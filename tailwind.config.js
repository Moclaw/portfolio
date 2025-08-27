/** @type {import('tailwindcss').Config} */
export const content = ["./src/**/*.{js,jsx}"];
export const mode = "jit";
export const theme = {
	extend: {
		colors: {
			primary: "#043DA8",
			secondary: "#aaa6c3",
			tertiary: "#042A70",
			"black-100": "#1a2332",
			"black-200": "#4E4A5F",
			"white-100": "#f3f3f3",
		},
		boxShadow: {
			card: "0px 35px 120px -15px #403D50",
		},
		screens: {
			'xs': '450px',
			'sm': '640px',
			'md': '768px',
			'lg': '1024px',
			'xl': '1280px',
			'2xl': '1536px',
			// Additional breakpoints for better responsive design
			'3xl': '1920px',
			// Touch device breakpoints
			'touch': { 'raw': '(hover: none)' },
			'mouse': { 'raw': '(hover: hover)' },
		},
	},
};
export const plugins = [];