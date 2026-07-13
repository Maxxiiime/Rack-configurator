import { useMemo } from 'react';
import { getColumnHeight, getPartSize, offsets } from "../utils/shelfParts";
import { resolveEffectiveColumnId } from "../utils/resolveColumn";
import { useRackConfigStore } from "../stores/configStore";
import { useRackSectionsStore } from "../stores/sectionsStore";
import { computeArmPositions, getMaxArmCount } from "../utils/armPositions";

export const useArmPositions = (columnIndex?: number, side: 'front' | 'back' = 'front') => {
    const armSpacing = useRackConfigStore((s) => s.armSpacing);
    const armCount = useRackConfigStore((s) => s.armCount);
    const armYOverrides = useRackConfigStore((s) => s.armYOverrides);
    const columnId = useRackConfigStore((s) => s.columnId);
    const sectionHeightOverrides = useRackConfigStore((s) => s.sectionHeightOverrides);
    const sectionIds = useRackSectionsStore((s) => s.sectionIds);


    return useMemo(() => {
        let currentColumnId = columnId;
        if (columnIndex !== undefined) {
            currentColumnId = resolveEffectiveColumnId(columnIndex, sectionIds, columnId, sectionHeightOverrides);
        }

        const columnHeightUnits = getColumnHeight(currentColumnId);
        const startY = offsets.arm.start_y;

        let currentArmCount = armCount;
        if (currentColumnId !== columnId) {
            currentArmCount = getMaxArmCount(startY, columnHeightUnits, armSpacing);
        }

        const basePositions = computeArmPositions(
            startY,
            columnHeightUnits,
            armSpacing,
            currentArmCount
        );

        const armPositions = basePositions.map((y, i) => {
            if (columnIndex !== undefined) {
                return armYOverrides[`${columnIndex}-${side}-${i}`] ?? armYOverrides[`row-${side}-${i}`] ?? y;
            }
            return armYOverrides[`row-${side}-${i}`] ?? y;
        });

        return {
            basePositions,
            armPositions,
            startY,
            columnHeightUnits
        };
    }, [armSpacing, armCount, armYOverrides, columnId, sectionHeightOverrides, sectionIds, getColumnHeight, getPartSize, offsets.arm.start_y, columnIndex, side]);
};

