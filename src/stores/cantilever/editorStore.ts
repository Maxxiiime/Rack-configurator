import create from 'zustand';

interface EditorState {
  selectedArmIndex: number | null;
  showDimensions: boolean;

  setSelectedArmIndex: (index: number | null) => void;
  setShowDimensions: (showDimensions: boolean) => void;
}

export const useEditorStore = create<EditorState>((set) => ({
  selectedArmIndex: null,
  showDimensions: false,

  setSelectedArmIndex: (index) => set({ selectedArmIndex: index }),
  setShowDimensions: (showDimensions) => set({ showDimensions }),
}));
