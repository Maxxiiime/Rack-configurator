/**
 * Store the complete configuration of a rack
 */
import create from 'zustand';
import partsData from '@/data/shelving_parts.json';
import type { ShelvingPart } from '@/types/shelving';
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

interface RackConfigState {
  rackType: RackType;
  columnId: string;
  armId: string;
  braceId: string;
  armSpacing: number;
  armCount: number;
  armYOverrides: Record<string, number>; // key: `${columnIndex}-${armIndex}`
  sectionWidthOverrides: Record<string, number>;
  showArmStops: boolean;
  removeFirstColumn: boolean;
  removeLastColumn: boolean;
  metalMaterial: string;

  setRackType: (type: RackType) => void;
  setColumnId: (id: string) => void;
  setArmId: (id: string) => void;
  setBraceId: (id: string) => void;
  setArmSpacing: (spacing: number) => void;
  setArmCount: (count: number) => void;
  setArmYOverride: (armIndex: number, y: number, columnIndex?: number) => void;
  removeArmYOverride: (armIndex: number, columnIndex?: number) => void;
  clearArmYOverrides: () => void;
  setSectionWidthOverride: (id: string, width: number) => void;
  removeSectionWidthOverride: (id: string) => void;
  clearSectionWidthOverrides: () => void;
  toggleShowArmStops: () => void;
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
  armSpacing: 3,
  armCount: 99,
  armYOverrides: {},
  sectionWidthOverrides: {},
  showArmStops: false,
  removeFirstColumn: false,
  removeLastColumn: false,
  metalMaterial: 'Blue',

  setRackType: (type) => set({ rackType: type }),

  setColumnId: (id) => set({ columnId: id }),

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

  setArmYOverride: (armIndex, y, columnIndex) => set((state) => {
    const key = columnIndex !== undefined ? `${columnIndex}-${armIndex}` : `row-${armIndex}`;

    let newOverrides = { ...state.armYOverrides };
    if (columnIndex === undefined) {
      Object.keys(newOverrides).forEach(k => {
        if (k.endsWith(`-${armIndex}`)) {
          delete newOverrides[k];
        }
      });
    }

    return {
      armYOverrides: { ...newOverrides, [key]: y },
    };
  }),

  removeArmYOverride: (armIndex, columnIndex) => set((state) => {
    const key = columnIndex !== undefined ? `${columnIndex}-${armIndex}` : `row-${armIndex}`;
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

  toggleShowArmStops: () => set((state) => ({ showArmStops: !state.showArmStops })),
  toggleRemoveFirstColumn: () => set((state) => ({ removeFirstColumn: !state.removeFirstColumn })),
  toggleRemoveLastColumn: () => set((state) => ({ removeLastColumn: !state.removeLastColumn })),
}));
