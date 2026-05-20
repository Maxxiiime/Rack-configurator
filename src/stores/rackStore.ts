import create from 'zustand';
import partsData from '@/data/shelving_parts.json';
import type { ShelvingPart } from '@/types/shelving';

export type RackType = 'single' | 'double';

const typedParts = partsData as ShelvingPart[];

interface RackState {
  rackType: RackType;
  numLevels: number;
  activeColumnId: string;
  activeArmId: string;
  activeBraceId: string;
  activeLegId: string;
  setRackType: (type: RackType) => void;
  setNumLevels: (levels: number) => void;
  setActiveColumn: (id: string) => void;
  setActiveArm: (id: string) => void;
  setActiveBrace: (id: string) => void;
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
  numLevels: 3,
  activeColumnId: defaultColumn,
  activeArmId: defaultArm,
  activeBraceId: defaultBrace,
  activeLegId: defaultLeg,

  setRackType: (type) => set((state) => ({
    rackType: type,
    activeLegId: findMatchingLegId(state.activeArmId, type),
  })),

  setNumLevels: (levels) => set({ numLevels: levels }),
  setActiveColumn: (id) => set({ activeColumnId: id }),

  setActiveArm: (id) => set((state) => ({
    activeArmId: id,
    activeLegId: findMatchingLegId(id, state.rackType),
  })),

  setActiveBrace: (id) => set({ activeBraceId: id }),
}));