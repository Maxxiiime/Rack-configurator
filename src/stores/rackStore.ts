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
  metalMaterial: string;
  setRackType: (type: RackType) => void;
  setActiveColumn: (id: string) => void;
  setActiveArm: (id: string) => void;
  setActiveBrace: (id: string) => void;
  setSelectedRack: (id: string | null) => void;
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
  metalMaterial: 'Blue',

  setRackType: (type) => set((state) => ({
    rackType: type,
    activeLegId: findMatchingLegId(state.activeArmId, type),
  })),

  setActiveColumn: (id) => set({ activeColumnId: id }),

  setActiveArm: (id) => set((state) => ({
    activeArmId: id,
    activeLegId: findMatchingLegId(id, state.rackType),
  })),

  setActiveBrace: (id) => set((state) => ({
    activeBraceId: id,
    racks: state.racks.map((rack) => ({ ...rack, braceId: id })),
  })),

  setSelectedRack: (id) => set({ selectedRack : id }),

  addRackLeft: () => set((state) => {
    const newRack: RackConfig = {
      id: crypto.randomUUID(),
      braceId: state.activeBraceId,
    };
    return { racks: [newRack, ...state.racks] };
  }),

  addRackRight: () => set((state) => {
    const newRack: RackConfig = {
      id: crypto.randomUUID(),
      braceId: state.activeBraceId,
    };
    return { racks: [...state.racks, newRack] };
  }),

  removeRack: (id) => set((state) => {
    if (state.racks.length <= 1 || id === 'initial-rack') return {};
    return { racks: state.racks.filter((rack) => rack.id !== id) };
  }),
}));