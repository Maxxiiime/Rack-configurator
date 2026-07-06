/**
 * Product system — public API.
 *
 * Import everything from `@/products` rather than reaching into sub-modules.
 */

// Types
export type {
  ProductDefinition,
  ProductStep,
  BaseEditorState,
  SectionsState,
  PricingResult,
  BOMItem,
  BOMResult,
} from './types';

// Registry
export { registerProduct, getProduct, getProductIds, getAllProducts } from './registry';

// Context
export { ProductProvider, useActiveProduct } from './ProductContext';

// Register built-in products
import { cantileverProduct } from './cantilever';
import { registerProduct } from './registry';
registerProduct(cantileverProduct);
