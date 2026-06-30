import { useMemo } from 'react';
import { useShelfParts } from "./useShelfParts";
import { useRackConfigStore } from "../stores/configStore";
import { computeArmPositions } from "../utils/armPositions";

export const useArmPositions = (columnIndex?: number) => {
    const armSpacing = useRackConfigStore((s) => s.armSpacing);
    const armCount = useRackConfigStore((s) => s.armCount);
    const armYOverrides = useRackConfigStore((s) => s.armYOverrides);
    const columnId = useRackConfigStore((s) => s.columnId);

    const { getColumnHeight, offsets } = useShelfParts();

    return useMemo(() => {
        const columnHeightUnits = getColumnHeight(columnId);
        const startY = offsets.arm.start_y;

        const basePositions = computeArmPositions(
            startY,
            columnHeightUnits,
            armSpacing,
            armCount
        );

        const armPositions = basePositions.map((y, i) => {
            if (columnIndex !== undefined) {
                return armYOverrides[`${columnIndex}-${i}`] ?? armYOverrides[`row-${i}`] ?? y;
            }
            return armYOverrides[`row-${i}`] ?? y;
        });

        return {
            basePositions,
            armPositions,
            startY,
            columnHeightUnits
        };
    }, [armSpacing, armCount, armYOverrides, columnId, getColumnHeight, offsets.arm.start_y, columnIndex]);
};
