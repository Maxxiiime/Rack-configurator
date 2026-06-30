/**
 * Product registry — a simple Map that holds every registered ProductDefinition.
 *
 * Plugins call `registerProduct()` at import time so the registry is populated
 * before the React tree mounts.  The router / context reads the registry to
 * resolve a product from its URL id.
 */

import type { ProductDefinition } from './types';

const registry = new Map<string, ProductDefinition>();

/** Register a product plugin.  Typically called at module scope. */
export function registerProduct(product: ProductDefinition): void {
  if (registry.has(product.id)) {
    console.warn(`[ProductRegistry] Product "${product.id}" is already registered — overwriting.`);
  }
  registry.set(product.id, product);
}

/** Retrieve a product by its URL-safe id. */
export function getProduct(id: string): ProductDefinition | undefined {
  return registry.get(id);
}

/** List all registered product ids. */
export function getProductIds(): string[] {
  return Array.from(registry.keys());
}

/** List all registered products. */
export function getAllProducts(): ProductDefinition[] {
  return Array.from(registry.values());
}
