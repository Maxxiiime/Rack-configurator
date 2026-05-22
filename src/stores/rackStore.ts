import create from 'zustand';
import partsData from '@/data/shelving_parts.json';
import type { ShelvingPart, RackConfig } from '@/types/shelving';

export type RackType = 'single' | 'double';

const typedParts = partsData as ShelvingPart[];

interface RackState {
  rackType: RackType;
  activeColumnId: string;
  activeArmId: string;
  activeBraceId: string;
  activeLegId: string;
  racks: RackConfig[];
  selectedRack: string | null;
  editAllRacks: boolean;
  metalMaterial: string;
  setRackType: (type: RackType) => void;
  setActiveColumn: (id: string) => void;
  setActiveArm: (id: string) => void;
  setActiveBrace: (id: string) => void;
  setSelectedRack: (id: string | null) => void;
  setEditAllRacks: (value: boolean) => void;
  addRackLeft: () => void;
  addRackRight: () => void;
  removeRack: (id: string) => void;
}

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
const defaultLeg = typedParts.find(p => p.category === 'single_leg')?.shelving_system_id || '';

export const useRackStore = create<RackState>((set) => ({
  rackType: 'single',
  activeColumnId: defaultColumn,
  activeArmId: defaultArm,
  activeBraceId: defaultBrace,
  activeLegId: defaultLeg,
  racks: [{ id: 'initial-rack', braceId: defaultBrace }],
  selectedRack: null,
  editAllRacks: true,
  metalMaterial: 'Blue',

  setRackType: (type) => set((state) => ({
    rackType: type,
    activeLegId: findMatchingLegId(state.activeArmId, type),
  })),

  setActiveColumn: (id) => set((state) => {
    if (state.editAllRacks) {
      // Edit all racks: update global + set override on all racks
      return {
        activeColumnId: id,
        racks: state.racks.map((rack) => ({ ...rack, columnId: id })),
      };
    }
    // Edit selected rack only
    if (state.selectedRack) {
      return {
        racks: state.racks.map((rack) =>
          rack.id === state.selectedRack ? { ...rack, columnId: id } : rack
        ),
      };
    }
    // No rack selected, just update global default
    return { activeColumnId: id };
  }),

  setActiveArm: (id) => set((state) => ({
    activeArmId: id,
    activeLegId: findMatchingLegId(id, state.rackType),
  })),

  setActiveBrace: (id) => set((state) => {
    if (state.editAllRacks) {
      // Edit all racks: update global + all racks
      return {
        activeBraceId: id,
        racks: state.racks.map((rack) => ({ ...rack, braceId: id })),
      };
    }
    // Edit selected rack only
    if (state.selectedRack) {
      return {
        racks: state.racks.map((rack) =>
          rack.id === state.selectedRack ? { ...rack, braceId: id } : rack
        ),
      };
    }
    // No rack selected, just update global default
    return { activeBraceId: id };
  }),

  setSelectedRack: (id) => set({ selectedRack: id }),

  setEditAllRacks: (value) => set({ editAllRacks: value }),

  addRackLeft: () => set((state) => {
    const adjacent = state.racks[0];
    const newRack: RackConfig = {
      id: crypto.randomUUID(),
      braceId: adjacent?.braceId ?? state.activeBraceId,
      columnId: adjacent?.columnId,
    };
    return { racks: [newRack, ...state.racks] };
  }),

  addRackRight: () => set((state) => {
    const adjacent = state.racks[state.racks.length - 1];
    const newRack: RackConfig = {
      id: crypto.randomUUID(),
      braceId: adjacent?.braceId ?? state.activeBraceId,
      columnId: adjacent?.columnId,
    };
    return { racks: [...state.racks, newRack] };
  }),

  removeRack: (id) => set((state) => {
    if (state.racks.length <= 1 || id === 'initial-rack') return {};
    return { racks: state.racks.filter((rack) => rack.id !== id) };
  }),
}));