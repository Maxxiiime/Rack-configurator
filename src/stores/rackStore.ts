import create from 'zustand';
import partsData from '@/data/shelving_parts.json';

export type RackType = 'single' | 'double';

interface RackState {
  rackType: RackType;
  numLevels: number;
  activeColumnId: string;
  activeArmId: string;
  activeBraceId: string;
  activeLegId: string; // Changes based on rackType and length
  setRackType: (type: RackType) => void;
  setNumLevels: (levels: number) => void;
  setActiveColumn: (id: string) => void;
  setActiveArm: (id: string) => void;
  setActiveBrace: (id: string) => void;
  updateLegSizing: (armId: string) => void;
}

// Initial defaults
const defaultColumn = partsData.find(p => p.shelving_system_id.startsWith('column_'))?.shelving_system_id || '';
const defaultArm = partsData.find(p => p.shelving_system_id.startsWith('arm_'))?.shelving_system_id || '';
const defaultBrace = partsData.find(p => p.shelving_system_id.startsWith('x_braces_'))?.shelving_system_id || '';
const defaultLeg = partsData.find(p => p.shelving_system_id.startsWith('single_leg_'))?.shelving_system_id || '';

export const useRackStore = create<RackState>((set) => ({
  rackType: 'single',
  numLevels: 3,
  activeColumnId: defaultColumn,
  activeArmId: defaultArm,
  activeBraceId: defaultBrace,
  activeLegId: defaultLeg,

  setRackType: (type) => set((state) => {
    // Automatically match leg type with arm size when changing rack type
    // In a real scenario, we'd extract the size from the arm ID and find the matching single/double leg
    const sizeMatch = state.activeArmId.match(/_(\d+)$/);
    const size = sizeMatch ? sizeMatch[1] : '350';
    const prefix = type === 'single' ? 'single_leg_' : 'double_leg_';
    const newLegId = `${prefix}${size}`;
    
    return { rackType: type, activeLegId: newLegId };
  }),
  
  setNumLevels: (levels) => set({ numLevels: levels }),
  setActiveColumn: (id) => set({ activeColumnId: id }),
  
  setActiveArm: (id) => set((state) => {
    const sizeMatch = id.match(/_(\d+)$/);
    const size = sizeMatch ? sizeMatch[1] : '350';
    const prefix = state.rackType === 'single' ? 'single_leg_' : 'double_leg_';
    
    return { 
      activeArmId: id,
      activeLegId: `${prefix}${size}`
    };
  }),
  
  setActiveBrace: (id) => set({ activeBraceId: id }),
  updateLegSizing: (armId) => set((state) => {
     return {};
  })
}));