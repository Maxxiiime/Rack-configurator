/**
 * Cantilever rack — ProductDefinition plugin.
 *
 * This file wires together all cantilever-specific stores, hooks, components
 * and panels into a single ProductDefinition that the shell can consume.
 */

import type { ProductDefinition } from '@/products/types';
import type { RackConfigState } from './stores/configStore';
import type { CantileverEditorState } from './stores/editorStore';
import { useRackConfigStore } from './stores/configStore';
import { useRackSectionsStore } from './stores/sectionsStore';
import { useEditorStore } from './stores/editorStore';
import { usePricing } from './hooks/usePricing';
import { useBillOfMaterials } from './hooks/useBillOfMaterials';
import { RackSystem } from './components/CantileverRenderer';
import { Step1 } from './panels/Step1';
import { Step2 } from './panels/Step2';
import { Step3 } from './panels/Step3';
import offsets from './data/offsets.json';

export const cantileverProduct: ProductDefinition<RackConfigState, CantileverEditorState> = {
  id: 'cantilever',
  name: 'Rack Cantilever',

  // Stores
  useConfigStore: useRackConfigStore,
  useSectionsStore: useRackSectionsStore,
  useEditorStore: useEditorStore,

  // 3D Renderer
  Renderer: RackSystem,

  // Configuration steps
  steps: [
    { label: 'Dimensions', Component: Step1, showNext: true, showBack: false },
    { label: 'Arms', Component: Step2, showNext: true, showBack: true },
    { label: 'BOM', Component: Step3, showNext: false, showBack: true },
  ],

  shadowOffset: -offsets.bottom_bolt.y,

  // Pricing & BOM hooks
  usePricing,
  useBillOfMaterials,
};
