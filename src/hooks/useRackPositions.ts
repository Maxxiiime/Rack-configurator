import { useMemo } from 'react';
import { useShelfParts } from "./useShelfParts";
import type { RackConfig } from "@/types/shelving";

export const useRackPositions = (racks: RackConfig[]) => {
	const { getPartSize } = useShelfParts();

	return useMemo(() => {
		// Calculate widths and positions for each rack
		const rackWidths = racks.map((rack) => getPartSize(rack.braceId) / 100);

		// Find the initial rack to keep positions stable
		const anchorIndex = racks.findIndex((rack) => rack.id === "initial-rack");
		const anchorIdx = anchorIndex !== -1 ? anchorIndex : 0;

		// Calculate column positions relative to the anchor rack starting at 0
		const columnPositionsX: number[] = new Array(racks.length + 1);
		columnPositionsX[anchorIdx] = 0;

		// Calculate forward from anchor
		for (let i = anchorIdx + 1; i <= racks.length; i++) {
			columnPositionsX[i] = columnPositionsX[i - 1] + rackWidths[i - 1];
		}

		// Calculate backward from anchor
		for (let i = anchorIdx - 1; i >= 0; i--) {
			columnPositionsX[i] = columnPositionsX[i + 1] - rackWidths[i];
		}

		return { columnPositionsX, rackWidths };
	}, [racks, getPartSize]);
};
