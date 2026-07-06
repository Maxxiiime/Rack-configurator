import { useMemo } from 'react';
import { useRackConfigStore, selectActiveLegId } from '../stores/configStore';
import { useRackSectionsStore } from '../stores/sectionsStore';
import { getPartSize, findPartId, getPartData, getColumnHeight, offsets } from '../utils/shelfParts';
import { useArmPositions } from './useArmPositions';
import { getMaxArmCount } from '../utils/armPositions';
import braceLayouts from '../data/brace_layouts.json';
import partsData from '../data/parts.json';

export interface BOMItem {
  partId: string;
  name: string;
  code?: string;
  quantity: number;
  unitPrice: number;
  totalPrice: number;
}

export const useBillOfMaterials = () => {
  const rackType = useRackConfigStore((s) => s.rackType);
  const columnId = useRackConfigStore((s) => s.columnId);
  const armId = useRackConfigStore((s) => s.armId);
  const braceId = useRackConfigStore((s) => s.braceId);
  const sectionWidthOverrides = useRackConfigStore((s) => s.sectionWidthOverrides);
  const sectionHeightOverrides = useRackConfigStore((s) => s.sectionHeightOverrides);
  const removeFirstColumn = useRackConfigStore((s) => s.removeFirstColumn);
  const removeLastColumn = useRackConfigStore((s) => s.removeLastColumn);
  const showArmStops = useRackConfigStore((s) => s.showArmStops);
  const showArmDividers = useRackConfigStore((s) => s.showArmDividers);
  const armDividerCount = useRackConfigStore((s) => s.armDividerCount);
  const activeLegId = useRackConfigStore(selectActiveLegId);

  const sectionIds = useRackSectionsStore((s) => s.sectionIds);
  const { armPositions } = useArmPositions();

  return useMemo(() => {
    const partsCount: Record<string, number> = {};

    const addPart = (id: string | undefined, count: number) => {
      if (!id || count <= 0) return;
      partsCount[id] = (partsCount[id] || 0) + count;
    };

    // 1. Columns & Legs
    const columnCountTotal = sectionIds.length + 1;
    let actualColumnCount = 0;
    let totalArms = 0;

    for (let index = 0; index < columnCountTotal; index++) {
      if (removeLastColumn && index === 0) continue;
      if (removeFirstColumn && index === columnCountTotal - 1) continue;

      actualColumnCount++;

      const leftSectionId = index > 0 ? sectionIds[index - 1] : null;
      const rightSectionId = index < sectionIds.length ? sectionIds[index] : null;

      let currentColumnId = columnId;
      if (leftSectionId || rightSectionId) {
        const leftHeightId = leftSectionId ? (sectionHeightOverrides[leftSectionId] ?? columnId) : columnId;
        const rightHeightId = rightSectionId ? (sectionHeightOverrides[rightSectionId] ?? columnId) : columnId;
        
        const leftHeight = getPartSize(leftHeightId);
        const rightHeight = getPartSize(rightHeightId);
        currentColumnId = leftHeight > rightHeight ? leftHeightId : rightHeightId;
      }

      addPart(currentColumnId, 1);
      addPart(activeLegId, 1);

      // Compute arms for this specific column
      const currentColumnHeightUnits = getColumnHeight(currentColumnId);
      let currentArmCount = armPositions.length; // Base arm count from the global default
      if (currentColumnId !== columnId) {
        const armSpacing = useRackConfigStore.getState().armSpacing;
        currentArmCount = getMaxArmCount(offsets.arm.start_y, currentColumnHeightUnits, armSpacing);
      }
      totalArms += currentArmCount * (rackType === 'double' ? 2 : 1);
    }

    // 2. Arms & Arm Stops
    if (totalArms > 0) {
      addPart(armId, totalArms);
      
      if (showArmStops) {
        const armStopId = getPartData(armId)?.arm_stop_id ?? 'arm_stop';
        addPart(armStopId, totalArms);
      }

      if (showArmDividers && armDividerCount > 0) {
        addPart('arm_divider', totalArms * armDividerCount);
      }
    }

    // 3. Braces & Bolts
    const defaultBraceSize = getPartSize(braceId);

    sectionIds.forEach((rackId, index) => {
      const currentHeightId = sectionHeightOverrides[rackId] ?? columnId;
      const columnSizeMm = getPartSize(currentHeightId);
      const layout = (braceLayouts as any)[String(columnSizeMm)] || [];

      const currentBraceSize = sectionWidthOverrides[rackId] ?? defaultBraceSize;
      const hBraceId = findPartId('h_brace', currentBraceSize);
      const xBraceId = findPartId('x_brace', currentBraceSize);
      
      const hasXBrace = (sectionIds.length - 1 - index) % 3 === 0;
      const isFirst = index === 0;
      const isLast = index === sectionIds.length - 1;

      layout.forEach((element: any) => {
        const isHBrace = element.type === 'h_brace';
        if (!hasXBrace && !isHBrace) return;

        if (isHBrace && hBraceId) {
          addPart(hBraceId, 1);
          
          let boltsForThisHBrace = 0;
          if (isFirst && !removeLastColumn) boltsForThisHBrace++;
          if (isLast && !removeFirstColumn) boltsForThisHBrace++;
          
          if (boltsForThisHBrace > 0) {
            addPart('bolts', boltsForThisHBrace);
          }
        } else if (!isHBrace && xBraceId) {
          addPart(xBraceId, 1);
        }
      });
    });

    // 4. Build BOM array
    let totalPrice = 0;
    const items: BOMItem[] = [];

    Object.entries(partsCount).forEach(([id, quantity]) => {
      if (id === 'bolts') return; // Exclude bolts from the bill

      const part = partsData.find((p) => p.shelving_system_id === id);
      if (!part) return;

      const unitPrice = part.price || 0;
      const itemTotal = unitPrice * quantity;
      totalPrice += itemTotal;

      items.push({
        partId: id,
        name: part.name || id,
        code: part.code,
        quantity,
        unitPrice,
        totalPrice: itemTotal
      });
    });

    return {
      items: items.sort((a, b) => a.name.localeCompare(b.name)),
      totalPrice
    };
  }, [
    rackType, columnId, armId, braceId, sectionWidthOverrides, sectionHeightOverrides,
    removeFirstColumn, removeLastColumn, showArmStops, showArmDividers, armDividerCount, activeLegId,
    sectionIds, armPositions.length, offsets.arm.start_y
  ]);
};
