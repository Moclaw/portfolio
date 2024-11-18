/** @type {import('tailwindcss').Config} */
export const content = ["./src/**/*.{js,jsx}"];
export const mode = "jit";
export const theme = {
	extend: {
		colors: {
			primary: "#043DA8",
			secondary: "#aaa6c3",
			tertiary: "#2D4A7F",
			"black-100": "#23222E",
			"black-200": "#4E4A5F",
			"white-100": "#f3f3f3",
		},
		boxShadow: {
			card: "0px 35px 120px -15px #403D50",
		},
		screens: {
			xs: "450px",
		},
	},
};
export const plugins = [];