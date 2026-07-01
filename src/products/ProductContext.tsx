/**
 * ProductContext — provides the active product definition to the component tree.
 *
 * The `<ProductProvider>` reads the product id from the URL (via React Router)
 * and resolves it from the registry.  All children can then access the active
 * product without importing any plugin directly.
 */

import React, { createContext, useContext, useMemo } from 'react';
import { useParams } from 'react-router-dom';
import { getProduct } from './registry';
import type { ProductDefinition } from './types';

/* ────────────────────────────────────────────────────────────────────────── */
/*  Context                                                                 */
/* ────────────────────────────────────────────────────────────────────────── */

const ProductContext = createContext<ProductDefinition | null>(null);

/* ────────────────────────────────────────────────────────────────────────── */
/*  Provider                                                                */
/* ────────────────────────────────────────────────────────────────────────── */

interface ProductProviderProps {
  children: React.ReactNode;
}

/**
 * Reads `:productId` from the URL and provides the matching
 * `ProductDefinition` to all descendants.
 */
export const ProductProvider: React.FC<ProductProviderProps> = ({ children }) => {
  const params = useParams<{ productId: string }>();
  /**
   * TODO: Remove this temporary default value when we have a product selector
   */
  const productId = params.productId ?? 'cantilever';

  const product = useMemo(() => {
    if (!productId) return null;
    return getProduct(productId) ?? null;
  }, [productId]);

  if (!product) {
    return (
      <div style={{ padding: 40, textAlign: 'center', color: '#888' }}>
        <h2>Product not found</h2>
        <p>
          No product registered for <code>{productId ?? '(empty)'}</code>.
        </p>
      </div>
    );
  }

  return (
    <ProductContext.Provider value={product}>
      {children}
    </ProductContext.Provider>
  );
};

/* ────────────────────────────────────────────────────────────────────────── */
/*  Hook                                                                    */
/* ────────────────────────────────────────────────────────────────────────── */

/**
 * Access the active `ProductDefinition` from anywhere in the tree.
 * Throws if used outside a `<ProductProvider>`.
 */
export function useActiveProduct(): ProductDefinition {
  const ctx = useContext(ProductContext);
  if (!ctx) {
    throw new Error(
      'useActiveProduct() must be used inside a <ProductProvider>. ' +
      'Make sure the route includes a :productId param.'
    );
  }
  return ctx;
}
