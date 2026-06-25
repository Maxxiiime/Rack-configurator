/**
 * Store the interactive state of the 3d editor and the display options
 */
import create from 'zustand';

interface EditorState {
  currentStep: 1 | 2 | 3;
  selectedArmIndex: number | null;
  selectedRackId: string | null;
  showDimensions: boolean;
  showWeightInfo: boolean;

  setCurrentStep: (step: 1 | 2 | 3) => void;
  setSelectedArmIndex: (index: number | null) => void;
  setSelectedRackId: (id: string | null) => void;
  setShowDimensions: (showDimensions: boolean) => void;
  setShowWeightInfo: (showWeightInfo: boolean) => void;
}

export const useEditorStore = create<EditorState>((set) => ({
  currentStep: 1,
  selectedArmIndex: null,
  selectedRackId: null,
  showDimensions: false,
  showWeightInfo: false,

  setCurrentStep: (step) => set({
    currentStep: step,
    selectedArmIndex: null,
    selectedRackId: null,
  }),
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
