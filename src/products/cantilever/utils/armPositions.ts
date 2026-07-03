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

/**
 * Compute the specific X, Y, Z positions for arm dividers taking slope into account.
 * When count > 1, dividers are distributed uniformly along the arm length.
 */
export function computeArmDividerPositions(
  armSizeUnits: number,
  yPosFront: number,
  yPosBack: number,
  armStopY: number,
  offsets: Record<string, any>,
  count: number = 1
) {
  const clampedCount = Math.max(1, count);
  const zOffset = offsets.arm_divider.z;
  const doubleArmDividerX = offsets.arm.double_x - (offsets.arm_divider?.x - offsets.arm.x || 0);
  const baseY = offsets.arm_divider.y;

  const singles: { x: number; y: number; z: number }[] = [];
  const doubles: { x: number; y: number; z: number }[] = [];

  for (let i = 0; i < clampedCount; i++) {
    // Distribute dividers uniformly: fraction goes from 1/(count+1) to count/(count+1)
    const fraction = (i + 1) / (clampedCount + 1);

    // Single face
    const armDividerZ = offsets.arm.z - armSizeUnits * fraction + zOffset;
    const singleRatio = (offsets.arm.z - armDividerZ) / armSizeUnits;
    const singleDividerY = yPosFront + baseY + (armStopY - baseY) * singleRatio;

    singles.push({
      x: offsets.arm_divider.x,
      y: singleDividerY,
      z: armDividerZ,
    });

    // Double face
    const doubleArmDividerZ = offsets.arm.double_z + armSizeUnits * fraction - zOffset;
    const doubleRatio = (doubleArmDividerZ - offsets.arm.double_z) / armSizeUnits;
    const doubleDividerY = yPosBack + baseY + (armStopY - baseY) * doubleRatio;

    doubles.push({
      x: doubleArmDividerX,
      y: doubleDividerY,
      z: doubleArmDividerZ,
    });
  }

  return { singles, doubles };
}