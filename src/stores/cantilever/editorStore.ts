/**
 * Store the interactive state of the 3d editor and the display options
 */
import create from 'zustand';

interface EditorState {
  currentStep: 1 | 2 | 3;
  selectedArm: { armIndex: number; columnIndex?: number } | null;
  selectedRackId: string | null;
  showDimensions: boolean;
  showWeightInfo: boolean;

  setCurrentStep: (step: 1 | 2 | 3) => void;
  setSelectedArm: (arm: { armIndex: number; columnIndex?: number } | null) => void;
  setSelectedRackId: (id: string | null) => void;
  setShowDimensions: (showDimensions: boolean) => void;
  setShowWeightInfo: (showWeightInfo: boolean) => void;
}

export const useEditorStore = create<EditorState>((set) => ({
  currentStep: 1,
  selectedArm: null,
  selectedRackId: null,
  showDimensions: false,
  showWeightInfo: false,

  setCurrentStep: (step) => set({
    currentStep: step,
    selectedArm: null,
    selectedRackId: null,
  }),
  setSelectedArm: (arm) => set(() => ({
    selectedArm: arm,
    ...(arm !== null ? { selectedRackId: null } : {})
  })),
  setSelectedRackId: (id) => set(() => ({
    selectedRackId: id,
    ...(id !== null ? { selectedArm: null } : {})
  })),
  setShowDimensions: (showDimensions) => set({ showDimensions }),
  setShowWeightInfo: (showWeightInfo) => set({ showWeightInfo }),
}));
