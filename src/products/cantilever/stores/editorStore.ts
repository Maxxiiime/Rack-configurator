/**
 * Store the interactive state of the 3d editor and the display options
 */
import create from 'zustand';
import type { BaseEditorState } from '@/products/types';

export interface CantileverEditorState extends BaseEditorState {
  currentStep: 1 | 2 | 3;
  selectedArm: { armIndex: number; columnIndex?: number; side?: 'front' | 'back' } | null;
  selectedRackId: string | null;
  showDimensions: boolean;
  showWeightInfo: boolean;

  setCurrentStep: (step: number) => void;
  setSelectedArm: (arm: { armIndex: number; columnIndex?: number; side?: 'front' | 'back' } | null) => void;
  setSelectedRackId: (id: string | null) => void;
  setShowDimensions: (showDimensions: boolean) => void;
  setShowWeightInfo: (showWeightInfo: boolean) => void;
  clearSelection: () => void;
}

export const useEditorStore = create<CantileverEditorState>((set) => ({
  currentStep: 1,
  selectedArm: null,
  selectedRackId: null,
  showDimensions: false,
  showWeightInfo: false,

  setCurrentStep: (step) => set({
    currentStep: step as 1 | 2 | 3,
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
  clearSelection: () => set({ selectedArm: null, selectedRackId: null }),
}));
