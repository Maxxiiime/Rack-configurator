/**
 * Shared hover-highlight store.
 * Any product can use this to highlight 3D parts on pointer-over.
 * The store holds a single `hoveredId` string; parts whose `hoverId`
 * matches will render with the SelectedMaterial.
 */
import create from 'zustand';

interface HoverState {
  hoveredId: string | null;
  setHoveredId: (id: string | null) => void;
}

export const useHoverStore = create<HoverState>((set) => ({
  hoveredId: null,
  setHoveredId: (id) => set({ hoveredId: id }),
}));
