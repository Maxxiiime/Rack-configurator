/**
 * Compute the maximum number of arms that can fit on a column
 * Arms are centered vertically if the count is less than the max capacity.
 */
export function getMaxArmCount(
  startY: number,
  columnHeight: number,
  spacing: number
): number {
  const topLimit = columnHeight - spacing;
  if (topLimit < startY) return 0;
  return Math.floor((topLimit - startY) / spacing) + 1;
}

/**
 * Compute the maximum allowed spacing to fit a given number of arms on a column.
 * Returns a value clamped between 2 and 10 (200mm to 1000mm).
 */
export function getMaxAllowedSpacing(
  startY: number,
  columnHeight: number,
  armCount: number
): number {
  const safeArmCount = Math.max(1, armCount);
  const maxAllowed = Math.floor((columnHeight - startY) / safeArmCount);
  return Math.max(2, Math.min(10, maxAllowed));
}

/**
 * Compute the Y positions of arms on a column.
 * All positions follow the pattern n + 0.45 (1.45, 2.45, 3.45, ...)
 */
export function computeArmPositions(
  startY: number,
  columnHeight: number,
  spacing: number,
  count: number
): number[] {
  const maxCount = getMaxArmCount(startY, columnHeight, spacing);
  const clampedCount = Math.max(0, Math.min(count, maxCount));

  if (clampedCount === 0) return [];

  const topLimit = columnHeight - spacing;
  const availableSpan = topLimit - startY;
  const armsTotalSpan = (clampedCount - 1) * spacing;

  const idealStartY = startY + (availableSpan - armsTotalSpan) / 2;
  let snappedStartY = Math.round(idealStartY - 0.45) + 0.45;

  if (snappedStartY + armsTotalSpan > topLimit) {
    snappedStartY -= 1;
  }
  
  if (snappedStartY < startY) {
    snappedStartY = startY;
  }

  const positions: number[] = [];
  for (let i = 0; i < clampedCount; i++) {
    positions.push(snappedStartY + i * spacing);
  }
  
  return positions;
}

/**
 * Apply per-arm Y-position overrides on top of computed base positions.
 * Only indices present in `overrides` are replaced; others keep the base value.
 */
export function applyArmYOverrides(
  basePositions: number[],
  overrides: Record<number, number>
): number[] {
  if (Object.keys(overrides).length === 0) return basePositions;
  return basePositions.map((y, i) => overrides[i] ?? y);
}