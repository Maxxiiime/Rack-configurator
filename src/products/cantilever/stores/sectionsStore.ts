/**
 * Store an ordered list of rack sections.
 * Implements SectionsState for the product plugin interface.
 */
import create from 'zustand';
import type { SectionsState } from '@/products/types';

const INITIAL_SECTION_ID = 'initial-section';

export const useRackSectionsStore = create<SectionsState>((set, get) => ({
  sectionIds: [INITIAL_SECTION_ID],

  addSectionLeft: () => set((state) => ({
    sectionIds: [crypto.randomUUID(), ...state.sectionIds],
  })),
  addSectionRight: () => set((state) => ({
    sectionIds: [...state.sectionIds, crypto.randomUUID()],
  })),
  removeSection: (id: string) => set((state) => {
    if (state.sectionIds.length <= 1 || id === INITIAL_SECTION_ID) return {};
    return { sectionIds: state.sectionIds.filter((sectionId) => sectionId !== id) };
  }),
}));
