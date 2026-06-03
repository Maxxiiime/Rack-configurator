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
 * Arms are centered vertically if the count is less than the max capacity.
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

  const topLimit = columnHeight - endY;
  const availableSpan = topLimit - startY;

  const armsTotalSpan = (clampedCount - 1) * spacing;

  const offset = (availableSpan - armsTotalSpan) / 2;

  const centeredStartY = startY + offset;

  const positions: number[] = [];
  for (let i = 0; i < clampedCount; i++) {
    positions.push(centeredStartY + i * spacing);
  }
  
  return positions;
}