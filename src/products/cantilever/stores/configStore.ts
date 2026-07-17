/**
 * Store the complete configuration of a rack
 */
import create from 'zustand';
import partsData from '../data/parts.json';
import offsetsData from '../data/offsets.json';
import type { ShelvingPart } from '../types';
import { useEditorStore } from './editorStore';

export type RackType = 'single' | 'double';

const typedParts = partsData as ShelvingPart[];

/** Find the matching leg part for a given arm size and rack type */
const findMatchingLegId = (armId: string, rackType: RackType): string => {
  const armPart = typedParts.find((p) => p.shelving_system_id === armId);
  const armSize = armPart?.size_mm ?? 350;
  const legCategory = rackType === 'single' ? 'single_leg' : 'double_leg';
  const leg = typedParts.find((p) => p.category === legCategory && p.size_mm === armSize);
  return leg?.shelving_system_id ?? `${legCategory}_${armSize}`;
};

// Initial defaults
const defaultColumn = typedParts.find(p => p.category === 'column')?.shelving_system_id || '';
const defaultArm = typedParts.find(p => p.category === 'arm')?.shelving_system_id || '';
const defaultBrace = typedParts.find(p => p.category === 'x_brace')?.shelving_system_id || '';

const defaultColumnPart = typedParts.find((p) => p.shelving_system_id === defaultColumn);
const defaultColumnHeightUnits = (defaultColumnPart?.size_mm ?? 2000) / 100;
const startY = (offsetsData as any).arm.start_y;
const defaultArmSpacing = 5;

const topLimit = defaultColumnHeightUnits - defaultArmSpacing;
const initialArmCount = topLimit < startY ? 0 : Math.floor((topLimit - startY) / defaultArmSpacing) + 1;

export interface RackConfigState {
  rackType: RackType;
  columnId: string;
  armId: string;
  braceId: string;
  armSpacing: number;
  armCount: number;
  armYOverrides: Record<string, number>; // key: `${columnIndex}-${side}-${armIndex}` or `row-${side}-${armIndex}`
  sectionWidthOverrides: Record<string, number>;
  sectionHeightOverrides: Record<string, string>;
  showArmStops: boolean;
  showArmDividers: boolean;
  armDividerCount: number;
  removeFirstColumn: boolean;
  removeLastColumn: boolean;
  metalMaterial: string;

  setRackType: (type: RackType) => void;
  setColumnId: (id: string) => void;
  setArmId: (id: string) => void;
  setBraceId: (id: string) => void;
  setArmSpacing: (spacing: number) => void;
  setArmCount: (count: number) => void;
  setArmYOverride: (armIndex: number, y: number, columnIndex?: number, side?: 'front' | 'back') => void;
  removeArmYOverride: (armIndex: number, columnIndex?: number, side?: 'front' | 'back') => void;
  clearArmYOverrides: () => void;
  setSectionWidthOverride: (id: string, width: number) => void;
  removeSectionWidthOverride: (id: string) => void;
  clearSectionWidthOverrides: () => void;
  setSectionHeightOverride: (id: string, columnId: string) => void;
  removeSectionHeightOverride: (id: string) => void;
  clearSectionHeightOverrides: () => void;
  toggleShowArmStops: () => void;
  toggleShowArmDividers: () => void;
  setArmDividerCount: (count: number) => void;
  toggleRemoveFirstColumn: () => void;
  toggleRemoveLastColumn: () => void;
}

/** Derived selector — leg is always computed from arm + rackType */
export const selectActiveLegId = (state: RackConfigState) =>
  findMatchingLegId(state.armId, state.rackType);

export const useRackConfigStore = create<RackConfigState>((set) => ({
  rackType: 'single',
  columnId: defaultColumn,
  armId: defaultArm,
  braceId: defaultBrace,
  armSpacing: defaultArmSpacing,
  armCount: initialArmCount,
  armYOverrides: {},
  sectionWidthOverrides: {},
  sectionHeightOverrides: {},
  showArmStops: false,
  showArmDividers: false,
  armDividerCount: 1,
  removeFirstColumn: false,
  removeLastColumn: false,
  metalMaterial: 'Blue',

  setRackType: (type) => set({ rackType: type }),

  setColumnId: (id) => {
    const columnPart = typedParts.find((p) => p.shelving_system_id === id);
    const columnHeightUnits = (columnPart?.size_mm ?? 2000) / 100;
    const topLim = columnHeightUnits - defaultArmSpacing;
    const newArmCount = topLim < startY ? 0 : Math.floor((topLim - startY) / defaultArmSpacing) + 1;

    set({ 
      columnId: id,
      armSpacing: defaultArmSpacing,
      armCount: newArmCount,
      armYOverrides: {}
    });
    useEditorStore.getState().setSelectedArm(null);
  },

  setArmId: (id) => set({ armId: id }),

  setBraceId: (id) => set({ braceId: id }),

  setArmSpacing: (spacing) => {
    set({ armSpacing: Math.max(2, spacing), armYOverrides: {} });
    useEditorStore.getState().setSelectedArm(null);
  },

  setArmCount: (count) => {
    set({ armCount: Math.max(1, count), armYOverrides: {} });
    useEditorStore.getState().setSelectedArm(null);
  },

  setArmYOverride: (armIndex, y, columnIndex, side = 'front') => set((state) => {
    const key = columnIndex !== undefined ? `${columnIndex}-${side}-${armIndex}` : `row-${side}-${armIndex}`;

    let newOverrides = { ...state.armYOverrides };
    if (columnIndex === undefined) {
      Object.keys(newOverrides).forEach(k => {
        if (k.endsWith(`-${side}-${armIndex}`)) {
          delete newOverrides[k];
        }
      });
    }

    return {
      armYOverrides: { ...newOverrides, [key]: y },
    };
  }),

  removeArmYOverride: (armIndex, columnIndex, side = 'front') => set((state) => {
    const key = columnIndex !== undefined ? `${columnIndex}-${side}-${armIndex}` : `row-${side}-${armIndex}`;
    const { [key]: _, ...rest } = state.armYOverrides;
    return { armYOverrides: rest };
  }),

  clearArmYOverrides: () => {
    set({ armYOverrides: {} });
    useEditorStore.getState().setSelectedArm(null);
  },

  setSectionWidthOverride: (id, width) => set((state) => ({
    sectionWidthOverrides: { ...state.sectionWidthOverrides, [id]: width },
  })),

  removeSectionWidthOverride: (id) => set((state) => {
    const { [id]: _, ...rest } = state.sectionWidthOverrides;
    return { sectionWidthOverrides: rest };
  }),

  clearSectionWidthOverrides: () => {
    set({ sectionWidthOverrides: {} });
    useEditorStore.getState().setSelectedRackId(null);
  },

  setSectionHeightOverride: (id, columnId) => set((state) => ({
    sectionHeightOverrides: { ...state.sectionHeightOverrides, [id]: columnId },
  })),

  removeSectionHeightOverride: (id) => set((state) => {
    const { [id]: _, ...rest } = state.sectionHeightOverrides;
    return { sectionHeightOverrides: rest };
  }),

  clearSectionHeightOverrides: () => {
    set({ sectionHeightOverrides: {} });
    useEditorStore.getState().setSelectedRackId(null);
  },

  toggleShowArmStops: () => set((state) => ({ showArmStops: !state.showArmStops })),
  toggleShowArmDividers: () => set((state) => ({ showArmDividers: !state.showArmDividers })),
  setArmDividerCount: (count) => set({ armDividerCount: Math.max(1, count) }),
  toggleRemoveFirstColumn: () => set((state) => ({ removeFirstColumn: !state.removeFirstColumn })),
  toggleRemoveLastColumn: () => set((state) => ({ removeLastColumn: !state.removeLastColumn })),
}));
