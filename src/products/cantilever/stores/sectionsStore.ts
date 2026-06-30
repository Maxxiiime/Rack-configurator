/**
 * Store an ordered list of rack sections.
 * Implements SectionsState for the product plugin interface.
 */
import create from 'zustand';
import type { SectionsState } from '@/products/types';

const INITIAL_RACK_ID = 'initial-rack';

interface RackSectionsState extends SectionsState {
  /** @deprecated Use sectionIds — kept for backward compat during migration */
  rackIds: string[];
  /** @deprecated Use addSectionLeft */
  addRackLeft: () => void;
  /** @deprecated Use addSectionRight */
  addRackRight: () => void;
  /** @deprecated Use removeSection */
  removeRack: (id: string) => void;
}

export const useRackSectionsStore = create<RackSectionsState>((set, get) => ({
  rackIds: [INITIAL_RACK_ID],

  // SectionsState conformance (canonical names)
  get sectionIds() { return get().rackIds; },
  addSectionLeft: () => set((state) => ({
    rackIds: [crypto.randomUUID(), ...state.rackIds],
  })),
  addSectionRight: () => set((state) => ({
    rackIds: [...state.rackIds, crypto.randomUUID()],
  })),
  removeSection: (id: string) => set((state) => {
    if (state.rackIds.length <= 1 || id === INITIAL_RACK_ID) return {};
    return { rackIds: state.rackIds.filter((rackId) => rackId !== id) };
  }),

  // Legacy aliases (backward compat)
  addRackLeft: () => get().addSectionLeft(),
  addRackRight: () => get().addSectionRight(),
  removeRack: (id: string) => get().removeSection(id),
}));
