/**
 * Core product abstraction types.
 *
 * Each rack type (cantilever, pallet, drive-in …) is described by a
 * `ProductDefinition`.  The shell (Sidepanel, ThreeCanvas, Router) only
 * depends on these interfaces — never on a concrete product implementation.
 *
 * Individual plugins use generics for full type-safety internally, while the
 * shell consumes the minimal `BaseEditorState` / `PricingResult` contracts.
 */

import type React from 'react';
import type { StoreApi, UseBoundStore } from 'zustand';

/* ────────────────────────────────────────────────────────────────────────── */
/*  Minimal contracts that the shell depends on                             */
/* ────────────────────────────────────────────────────────────────────────── */

/** Every product's editor store must expose at least these fields. */
export interface BaseEditorState {
  currentStep: number;
  setCurrentStep: (step: number) => void;

  /** Common UI toggle for dimension lines */
  showDimensions?: boolean;
  setShowDimensions?: (show: boolean) => void;

  /** Common UI toggle for weight overlay */
  showWeightInfo?: boolean;
  setShowWeightInfo?: (show: boolean) => void;

  /** Hook for the shell to clear any product-specific selection (e.g. when clicking the background) */
  clearSelection?: () => void;
}

/** Standardised section list — most rack types have a notion of "bays". */
export interface SectionsState {
  sectionIds: string[];
  addSectionLeft: () => void;
  addSectionRight: () => void;
  removeSection: (id: string) => void;
}

/* ────────────────────────────────────────────────────────────────────────── */
/*  Pricing / BOM contracts                                                 */
/* ────────────────────────────────────────────────────────────────────────── */

export interface PricingResult {
  totalPrice: number;
  breakdown: Record<string, number>;
}

export interface BOMItem {
  partId: string;
  name: string;
  code?: string;
  quantity: number;
  unitPrice: number;
  totalPrice: number;
}

export interface BOMResult {
  items: BOMItem[];
  totalPrice: number;
}

/* ────────────────────────────────────────────────────────────────────────── */
/*  Product step (one panel in the Sidepanel wizard)                        */
/* ────────────────────────────────────────────────────────────────────────── */

export interface ProductStep {
  label: string;
  /** The React component rendered for this step. */
  Component: React.ComponentType<{ onNext?: () => void; onBack?: () => void }>;
}

/* ────────────────────────────────────────────────────────────────────────── */
/*  ProductDefinition — the main plugin interface                           */
/* ────────────────────────────────────────────────────────────────────────── */

/**
 * Describes a single rack type.  Plugins provide a concrete implementation of
 * this interface; the shell consumes it through `ProductContext`.
 *
 * Generic parameters are only needed inside the plugin — the shell accesses
 * stores through the `Base*` contracts.
 */
export interface ProductDefinition<
  TConfig = unknown,
  TEditor extends BaseEditorState = BaseEditorState,
> {
  /** Unique URL-safe identifier (e.g. "cantilever", "pallet"). */
  id: string;

  /** Human-readable display name (e.g. "Rack Cantilever", "Rack à Palettes"). */
  name: string;

  /* ── Stores ───────────────────────────────────────────────────────────── */

  /** Zustand store for product-specific configuration. */
  useConfigStore: UseBoundStore<StoreApi<TConfig>>;

  /** Zustand store for section/bay management. */
  useSectionsStore: UseBoundStore<StoreApi<SectionsState>>;

  /** Zustand store for editor / UI state (must extend BaseEditorState). */
  useEditorStore: UseBoundStore<StoreApi<TEditor>>;

  /* ── Components ───────────────────────────────────────────────────────── */

  /** The 3D renderer placed inside the R3F `<Canvas>` scene. */
  Renderer: React.ComponentType;

  /** Ordered configuration steps rendered in the Sidepanel wizard. */
  steps: ProductStep[];

  /** Optional vertical offset for the Stage shadows (e.g. to align shadow with ground plane). */
  shadowOffset?: number;

  /* ── Hooks ────────────────────────────────────────────────────────────── */

  /** Returns live pricing derived from the current configuration. */
  usePricing: () => PricingResult;

  /** Returns the bill of materials for the current configuration. */
  useBillOfMaterials: () => BOMResult;
}
