import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";

// https://vitejs.dev/config/
export default defineConfig({
	plugins: [react()],
	resolve: {
		alias: {
			// eslint-disable-next-line no-undef
			"@": path.resolve(__dirname, "./src"),
		},
	},
	build: {
		// generate manifest.json in outDir
		rollupOptions: {
			output: {
				entryFileNames: `assets/entry.js`,
				chunkFileNames: `assets/script.js`,
				assetFileNames: `assets/[name].[ext]`,
			},
		},
	},
	server: {
		host: true,
		port: 5173,
		origin: "http://localhost:5173",
	},
});
