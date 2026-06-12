import create from 'zustand';

interface AppState {
  sidePanelOpen: boolean;
  setSidePanelOpen: (open: boolean) => void;
  toggleSidePanel: () => void;
}

export const useAppStore = create<AppState>((set) => ({
  sidePanelOpen: true,

  setSidePanelOpen: (open) => set({ sidePanelOpen: open }),
  toggleSidePanel: () => set((state) => ({ sidePanelOpen: !state.sidePanelOpen })),
}));
