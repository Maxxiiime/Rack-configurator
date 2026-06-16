import create from 'zustand';

interface EditorState {
  selectedArmIndex: number | null;
  selectedRackId: string | null;
  showDimensions: boolean;

  setSelectedArmIndex: (index: number | null) => void;
  setSelectedRackId: (id: string | null) => void;
  setShowDimensions: (showDimensions: boolean) => void;
}

export const useEditorStore = create<EditorState>((set) => ({
  selectedArmIndex: null,
  selectedRackId: null,
  showDimensions: false,

  setSelectedArmIndex: (index) => set({ selectedArmIndex: index }),
  setSelectedRackId: (id) => set({ selectedRackId: id }),
  setShowDimensions: (showDimensions) => set({ showDimensions }),
}));
