/**
 * Compute the maximum number of arms that can fit on a column
 * Arms are centered vertically if the count is less than the max capacity.
 */
export function getMaxArmCount(
  startY: number,
  endY: number,
  columnHeight: number,
  spacing: number
): number {
  const topLimit = columnHeight - spacing;
  if (topLimit < startY) return 0;
  return Math.floor((topLimit - startY) / spacing) + 1;
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