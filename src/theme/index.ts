import { extendTheme } from "@chakra-ui/react";

// 2. Extend the theme to include custom colors, fonts, etc -> https://chakra-ui.com/docs/styled-system/theme#colors
export const colors = {
	primary: {
		50: "#e4f2ff",
		100: "#bed5f5",
		200: "#97bae9",
		300: "#6f9edd",
		400: "#4782d2",
		500: "#2d68b8",
		600: "#215190",
		700: "#153a68",
		800: "#072341",
		900: "#000d1c",
	},
	secondary: {
		50: "#dcfbff",
		100: "#b7ecf5",
		200: "#90deec",
		300: "#68d0e2",
		400: "#40c2d8",
		500: "#27a9bf",
		600: "#178395",
		700: "#065f6b",
		800: "#003943",
		900: "#001519",
	},
	brand: {
		light_gray: "#d3d3d3",
	},
};

const theme = extendTheme({ colors });

export default theme;
