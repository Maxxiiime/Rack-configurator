import create from "zustand";
import { mountStoreDevtool } from "simple-zustand-devtools";
import { NonFunctionProperties } from "@/helpers/types";

const isDevMode = import.meta.env.MODE === "development";

export interface AppState {
	isDevMode: boolean;
	update: (options: Partial<NonFunctionProperties<AppState>>) => void;
}

export const useAppStore = create<AppState>((set) => ({
	isDevMode,

	// function to update the different fields inside the store
	update: (options) => set((state) => ({ ...state, ...options })),
}));

// download the react devtools extension to debug your store -> https://chrome.google.com/webstore/detail/react-developer-tools/
// eslint-disable-next-line no-undef
if (isDevMode) {
	mountStoreDevtool("AppStore", useAppStore);
}
