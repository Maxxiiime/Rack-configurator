import { useMemo } from 'react';
import { useRackConfigStore, selectActiveLegId } from '../stores/configStore';
import { useRackSectionsStore } from '../stores/sectionsStore';
import { useShelfParts } from './useShelfParts';
import { useArmPositions } from './useArmPositions';
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
  const removeFirstColumn = useRackConfigStore((s) => s.removeFirstColumn);
  const removeLastColumn = useRackConfigStore((s) => s.removeLastColumn);
  const showArmStops = useRackConfigStore((s) => s.showArmStops);
  const showArmDividers = useRackConfigStore((s) => s.showArmDividers);
  const armDividerCount = useRackConfigStore((s) => s.armDividerCount);
  const activeLegId = useRackConfigStore(selectActiveLegId);

  const sectionIds = useRackSectionsStore((s) => s.sectionIds);
  const { getPartSize, findPartId, getPartData } = useShelfParts();
  const { armPositions } = useArmPositions();

  return useMemo(() => {
    const partsCount: Record<string, number> = {};

    const addPart = (id: string | undefined, count: number) => {
      if (!id || count <= 0) return;
      partsCount[id] = (partsCount[id] || 0) + count;
    };

    // 1. Columns & Legs
    let columnCount = sectionIds.length + 1;
    if (removeFirstColumn) columnCount--;
    if (removeLastColumn) columnCount--;

    if (columnCount > 0) {
      addPart(columnId, columnCount);
      addPart(activeLegId, columnCount);
    }

    // 2. Arms & Arm Stops
    const armsPerColumn = armPositions.length * (rackType === 'double' ? 2 : 1);
    const totalArms = columnCount * armsPerColumn;
    
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
    const columnSizeMm = getPartSize(columnId);
    const layout = (braceLayouts as any)[String(columnSizeMm)] || [];

    sectionIds.forEach((rackId, index) => {
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
    rackType, columnId, armId, braceId, sectionWidthOverrides,
    removeFirstColumn, removeLastColumn, showArmStops, showArmDividers, armDividerCount, activeLegId,
    sectionIds, armPositions.length, getPartSize, findPartId, getPartData
  ]);
};
