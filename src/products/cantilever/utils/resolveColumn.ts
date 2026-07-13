import { getPartSize } from './shelfParts';

/**
 * Resolves the effective column ID for a given column index.
 * The effective column is determined by checking the sections to its left and right.
 * If both sections exist, it picks the column with the greater height.
 */
export function resolveEffectiveColumnId(
  columnIndex: number,
  sectionIds: string[],
  defaultColumnId: string,
  sectionHeightOverrides: Record<string, string>
): string {
  const leftSectionId = columnIndex > 0 ? sectionIds[columnIndex - 1] : null;
  const rightSectionId = columnIndex < sectionIds.length ? sectionIds[columnIndex] : null;

  let currentColumnId = defaultColumnId;

  if (leftSectionId && rightSectionId) {
    const leftHeightId = sectionHeightOverrides[leftSectionId] ?? defaultColumnId;
    const rightHeightId = sectionHeightOverrides[rightSectionId] ?? defaultColumnId;
    const leftHeight = getPartSize(leftHeightId);
    const rightHeight = getPartSize(rightHeightId);
    currentColumnId = leftHeight > rightHeight ? leftHeightId : rightHeightId;
  } else if (leftSectionId) {
    currentColumnId = sectionHeightOverrides[leftSectionId] ?? defaultColumnId;
  } else if (rightSectionId) {
    currentColumnId = sectionHeightOverrides[rightSectionId] ?? defaultColumnId;
  }

  return currentColumnId;
}
