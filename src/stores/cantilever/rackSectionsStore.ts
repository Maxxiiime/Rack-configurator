/**
 * Store an ordered list of rack sections
 */
import create from 'zustand';

const INITIAL_RACK_ID = 'initial-rack';

interface RackSectionsState {
  rackIds: string[];

  addRackLeft: () => void;
  addRackRight: () => void;
  removeRack: (id: string) => void;
}

export const useRackSectionsStore = create<RackSectionsState>((set) => ({
  rackIds: [INITIAL_RACK_ID],

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
}));
