/**
 * Compute the maximum number of arms that can fit on a column
 * given the spacing between arms.
 */
export function getMaxArmCount(
  startY: number,
  endY: number,
  columnHeight: number,
  spacing: number
): number {
  const maxY = columnHeight - endY;
  if (maxY < startY) return 0;
  return Math.floor((maxY - startY) / spacing) + 1;
}

/**
 * Compute the Y positions of arms on a column.
 * All positions follow the pattern n + 0.45 (1.45, 2.45, 3.45, ...)
 */
export function computeArmPositions(
  startY: number,
  endY: number,
  columnHeight: number,
  spacing: number,
  count: number
): number[] {
  const maxCount = getMaxArmCount(startY, endY, columnHeight, spacing);
  const clampedCount = Math.max(0, Math.min(count, maxCount));

  const positions: number[] = [];
  for (let i = 0; i < clampedCount; i++) {
    positions.push(startY + i * spacing);
  }
  return positions;
}
