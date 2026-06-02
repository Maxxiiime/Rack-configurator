import create from 'zustand';
import partsData from '@/data/shelving_parts.json';
import type { ShelvingPart } from '@/types/shelving';

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

const INITIAL_RACK_ID = 'initial-rack';

interface RackState {
  rackType: RackType;
  columnId: string;
  armId: string;
  braceId: string;
  armSpacing: number;
  armCount: number;
  rackIds: string[];
  metalMaterial: string;
  showDimensions: boolean;

  setRackType: (type: RackType) => void;
  setColumnId: (id: string) => void;
  setArmId: (id: string) => void;
  setBraceId: (id: string) => void;
  setArmSpacing: (spacing: number) => void;
  setArmCount: (count: number) => void;
  addRackLeft: () => void;
  addRackRight: () => void;
  removeRack: (id: string) => void;
  setShowDimensions: (showDimensions: boolean) => void;
}

/** Derived selector — leg is always computed from arm + rackType */
export const selectActiveLegId = (state: RackState) =>
  findMatchingLegId(state.armId, state.rackType);

export const useRackStore = create<RackState>((set) => ({
  rackType: 'single',
  columnId: defaultColumn,
  armId: defaultArm,
  braceId: defaultBrace,
  armSpacing: 3,
  armCount: 99,
  rackIds: [INITIAL_RACK_ID],
  metalMaterial: 'Blue',
  showDimensions: false,

  setRackType: (type) => set({ rackType: type }),

  setColumnId: (id) => set({ columnId: id }),

  setArmId: (id) => set({ armId: id }),

  setBraceId: (id) => set({ braceId: id }),

  setArmSpacing: (spacing) => set({ armSpacing: Math.max(2, spacing) }),

  setArmCount: (count) => set({ armCount: Math.max(1, count) }),

  addRackLeft: () => set((state) => ({
    rackIds: [crypto.randomUUID(), ...state.rackIds],
  })),

  addRackRight: () => set((state) => ({
    rackIds: [...state.rackIds, crypto.randomUUID()],
  })),

  removeRack: (id) => set((state) => {
    if (state.rackIds.length <= 1 || id === INITIAL_RACK_ID) return {};
    return { rackIds: state.rackIds.filter((rackId) => rackId !== id) };
  }),

  setShowDimensions: (showDimensions) => set({ showDimensions }),
}));