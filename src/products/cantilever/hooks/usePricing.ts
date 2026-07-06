import { useMemo } from 'react';
import { useRackConfigStore, selectActiveLegId } from '../stores/configStore';
import { useRackSectionsStore } from '../stores/sectionsStore';
import { getPartData, getPartSize, findPartId, getColumnHeight, getMaxArmsByWeight, offsets } from '../utils/shelfParts';
import { getMaxArmCount } from '../utils/armPositions';
import braceLayouts from '../data/brace_layouts.json';
import type { BraceElement } from '../types';

const typedLayouts = braceLayouts as Record<string, BraceElement[]>;

export const usePricing = () => {
  const rackType = useRackConfigStore((s) => s.rackType);
  const columnId = useRackConfigStore((s) => s.columnId);
  const armId = useRackConfigStore((s) => s.armId);
  const braceId = useRackConfigStore((s) => s.braceId);
  const sectionWidthOverrides = useRackConfigStore((s) => s.sectionWidthOverrides);
  const sectionHeightOverrides = useRackConfigStore((s) => s.sectionHeightOverrides);
  const armCount = useRackConfigStore((s) => s.armCount);
  const armSpacing = useRackConfigStore((s) => s.armSpacing);
  const showArmStops = useRackConfigStore((s) => s.showArmStops);
  const showArmDividers = useRackConfigStore((s) => s.showArmDividers);
  const armDividerCount = useRackConfigStore((s) => s.armDividerCount);
  const removeFirstColumn = useRackConfigStore((s) => s.removeFirstColumn);
  const removeLastColumn = useRackConfigStore((s) => s.removeLastColumn);

  // Selector for derived state
  const activeLegId = useRackConfigStore(selectActiveLegId);

  const sectionIds = useRackSectionsStore((s) => s.sectionIds);


  return useMemo(() => {
    let totalPrice = 0;

    // 1. Calculate columns, legs, and their prices
    let columnsTotalPrice = 0;
    let legsTotalPrice = 0;
    
    const numSections = sectionIds.length;
    const columnCountTotal = numSections + 1;
    let actualColumnCount = 0;

    let totalArms = 0;

    for (let index = 0; index < columnCountTotal; index++) {
      if (removeLastColumn && index === 0) continue;
      if (removeFirstColumn && index === columnCountTotal - 1) continue;

      actualColumnCount++;

      const leftSectionId = index > 0 ? sectionIds[index - 1] : null;
      const rightSectionId = index < numSections ? sectionIds[index] : null;

      let currentColumnId = columnId;
      if (leftSectionId || rightSectionId) {
        const leftHeightId = leftSectionId ? (sectionHeightOverrides[leftSectionId] ?? columnId) : columnId;
        const rightHeightId = rightSectionId ? (sectionHeightOverrides[rightSectionId] ?? columnId) : columnId;
        
        const leftHeight = getPartSize(leftHeightId);
        const rightHeight = getPartSize(rightHeightId);
        currentColumnId = leftHeight > rightHeight ? leftHeightId : rightHeightId;
      }

      const currentColumnPrice = getPartData(currentColumnId)?.price || 0;
      columnsTotalPrice += currentColumnPrice;
      
      const currentLegPrice = getPartData(activeLegId)?.price || 0;
      legsTotalPrice += currentLegPrice;

      const currentColumnHeightUnits = getColumnHeight(currentColumnId);
      let currentArmCount = armCount;
      if (currentColumnId !== columnId) {
        currentArmCount = getMaxArmCount(offsets.arm.start_y, currentColumnHeightUnits, armSpacing);
      }
      totalArms += currentArmCount * (rackType === 'double' ? 2 : 1);
    }

    // 2. Fetch prices
    const armPrice = getPartData(armId)?.price || 0;
    const armStopPrice = getPartData('arm_stop')?.price || 0;
    const armDividerPrice = getPartData('arm_divider')?.price || 0;

    // Add Columns & Legs
    totalPrice += columnsTotalPrice;
    totalPrice += legsTotalPrice;

    // Add Arms & Arm Stops
    totalPrice += totalArms * armPrice;
    if (showArmStops) {
      totalPrice += totalArms * armStopPrice;
    }
    if (showArmDividers) {
      totalPrice += totalArms * armDividerCount * armDividerPrice;
    }

    // 3. Add Braces
    const defaultBraceSize = getPartSize(braceId);

    sectionIds.forEach((rackId, index) => {
      const currentHeightId = sectionHeightOverrides[rackId] ?? columnId;
      const columnSizeMm = getPartSize(currentHeightId);
      const layout = typedLayouts[String(columnSizeMm)] || [];

      const currentBraceSize = sectionWidthOverrides[rackId] ?? defaultBraceSize;
      const hBraceId = findPartId('h_brace', currentBraceSize) || '';
      const xBraceId = findPartId('x_brace', currentBraceSize) || '';

      const hBracePrice = getPartData(hBraceId)?.price || 0;
      const xBracePrice = getPartData(xBraceId)?.price || 0;

      const hasXBrace = (sectionIds.length - 1 - index) % 3 === 0;

      layout.forEach((element) => {
        if (element.type === 'h_brace') {
          totalPrice += hBracePrice;
        } else if (element.type === 'x_brace' && hasXBrace) {
          totalPrice += xBracePrice;
        }
      });
    });

    return {
      totalPrice,
      breakdown: {
        columns: columnsTotalPrice,
        legs: legsTotalPrice,
        arms: totalArms * armPrice,
        armStops: showArmStops ? totalArms * armStopPrice : 0,
        armDividers: showArmDividers ? totalArms * armDividerCount * armDividerPrice : 0,
      }
    };
  }, [
    rackType, columnId, armId, braceId, activeLegId,
    sectionWidthOverrides, sectionHeightOverrides, armCount, armSpacing, showArmStops, showArmDividers, armDividerCount,
    removeFirstColumn, removeLastColumn,
    sectionIds, getPartData, getPartSize, findPartId, getColumnHeight, getMaxArmsByWeight, offsets.arm.start_y
  ]);
};
