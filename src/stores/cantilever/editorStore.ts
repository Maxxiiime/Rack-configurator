/**
 * Store the interactive state of the 3d editor and the display options
 */
import create from 'zustand';

interface EditorState {
  selectedArmIndex: number | null;
  selectedRackId: string | null;
  showDimensions: boolean;
  showWeightInfo: boolean;

  setSelectedArmIndex: (index: number | null) => void;
  setSelectedRackId: (id: string | null) => void;
  setShowDimensions: (showDimensions: boolean) => void;
  setShowWeightInfo: (showWeightInfo: boolean) => void;
}

export const useEditorStore = create<EditorState>((set) => ({
  selectedArmIndex: null,
  selectedRackId: null,
  showDimensions: false,
  showWeightInfo: false,

  setSelectedArmIndex: (index) => set(() => ({
    selectedArmIndex: index,
    ...(index !== null ? { selectedRackId: null } : {})
  })),
  setSelectedRackId: (id) => set(() => ({
    selectedRackId: id,
    ...(id !== null ? { selectedArmIndex: null } : {})
  })),
  setShowDimensions: (showDimensions) => set({ showDimensions }),
  setShowWeightInfo: (showWeightInfo) => set({ showWeightInfo }),
}));
