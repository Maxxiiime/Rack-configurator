import { useMemo } from 'react';
import { useRackConfigStore, selectActiveLegId } from '../stores/configStore';
import { useRackSectionsStore } from '../stores/sectionsStore';
import { useShelfParts } from './useShelfParts';
import braceLayouts from '../data/brace_layouts.json';
import type { BraceElement } from '../types';
import { getMaxArmCount } from '../utils/armPositions';

const typedLayouts = braceLayouts as Record<string, BraceElement[]>;

export const usePricing = () => {
  const rackType = useRackConfigStore((s) => s.rackType);
  const columnId = useRackConfigStore((s) => s.columnId);
  const armId = useRackConfigStore((s) => s.armId);
  const braceId = useRackConfigStore((s) => s.braceId);
  const sectionWidthOverrides = useRackConfigStore((s) => s.sectionWidthOverrides);
  const armCount = useRackConfigStore((s) => s.armCount);
  const armSpacing = useRackConfigStore((s) => s.armSpacing);
  const showArmStops = useRackConfigStore((s) => s.showArmStops);
  const showArmDividers = useRackConfigStore((s) => s.showArmDividers);
  const removeFirstColumn = useRackConfigStore((s) => s.removeFirstColumn);
  const removeLastColumn = useRackConfigStore((s) => s.removeLastColumn);

  // Selector for derived state
  const activeLegId = useRackConfigStore(selectActiveLegId);

  const rackIds = useRackSectionsStore((s) => s.rackIds);

  const { getPartData, getPartSize, findPartId, getColumnHeight, getMaxArmsByWeight, offsets } = useShelfParts();

  return useMemo(() => {
    let totalPrice = 0;

    // 1. Calculate the number of items
    const numSections = rackIds.length;
    let numColumns = numSections + 1;
    if (removeFirstColumn) numColumns -= 1;
    if (removeLastColumn) numColumns -= 1;

    const totalSides = numColumns * (rackType === 'double' ? 2 : 1);
    const totalArms = armCount * totalSides;

    // 2. Fetch prices
    const columnPrice = getPartData(columnId)?.price || 0;
    const legPrice = getPartData(activeLegId)?.price || 0;
    const armPrice = getPartData(armId)?.price || 0;
    const armStopPrice = getPartData('arm_stop')?.price || 0;
    const armDividerPrice = getPartData('arm_divider')?.price || 0;

    // Add Columns & Legs
    totalPrice += numColumns * columnPrice;
    totalPrice += numColumns * legPrice;

    // Add Arms & Arm Stops
    totalPrice += totalArms * armPrice;
    if (showArmStops) {
      totalPrice += totalArms * armStopPrice;
    }
    if (showArmDividers) {
      totalPrice += totalArms * armDividerPrice;
    }

    // 3. Add Braces
    const columnSizeMm = getPartSize(columnId);
    const layout = typedLayouts[String(columnSizeMm)] || [];

    const defaultBraceSize = getPartSize(braceId);

    rackIds.forEach((rackId, index) => {
      const currentBraceSize = sectionWidthOverrides[rackId] ?? defaultBraceSize;
      const hBraceId = findPartId('h_brace', currentBraceSize) || '';
      const xBraceId = findPartId('x_brace', currentBraceSize) || '';

      const hBracePrice = getPartData(hBraceId)?.price || 0;
      const xBracePrice = getPartData(xBraceId)?.price || 0;

      const hasXBrace = (rackIds.length - 1 - index) % 3 === 0;

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
        columns: numColumns * columnPrice,
        legs: numColumns * legPrice,
        arms: totalArms * armPrice,
        armStops: showArmStops ? totalArms * armStopPrice : 0,
        armDividers: showArmDividers ? totalArms * armDividerPrice : 0,
      }
    };
  }, [
    rackType, columnId, armId, braceId, activeLegId,
    sectionWidthOverrides, armCount, armSpacing, showArmStops, showArmDividers,
    removeFirstColumn, removeLastColumn,
    rackIds, getPartData, getPartSize, findPartId, getColumnHeight, getMaxArmsByWeight, offsets.arm.start_y
  ]);
};
