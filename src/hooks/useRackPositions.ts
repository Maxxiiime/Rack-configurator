import { useMemo } from 'react';
import { useShelfParts } from "./useShelfParts";
import { useRackSectionsStore } from "@/stores/cantilever/rackSectionsStore";
import { useRackConfigStore } from "@/stores/cantilever/rackConfigStore";

export const useRackPositions = () => {
	const rackIds = useRackSectionsStore((s) => s.rackIds);
	const braceId = useRackConfigStore((s) => s.braceId);
	const { getPartSize } = useShelfParts();

	return useMemo(() => {
		const braceWidth = getPartSize(braceId) / 100;

		// All racks share the same width
		const rackWidths = rackIds.map(() => braceWidth);

		// Find the initial rack to keep positions stable
		const anchorIndex = rackIds.indexOf("initial-rack");
		const anchorIdx = anchorIndex !== -1 ? anchorIndex : 0;

		// Calculate column positions relative to the anchor rack starting at 0
		const columnPositionsX: number[] = new Array(rackIds.length + 1);
		columnPositionsX[anchorIdx] = 0;

		// Calculate forward from anchor
		for (let i = anchorIdx + 1; i <= rackIds.length; i++) {
			columnPositionsX[i] = columnPositionsX[i - 1] + rackWidths[i - 1];
		}

		// Calculate backward from anchor
		for (let i = anchorIdx - 1; i >= 0; i--) {
			columnPositionsX[i] = columnPositionsX[i + 1] - rackWidths[i];
		}

		const minX = columnPositionsX[0];
		const maxX = columnPositionsX[columnPositionsX.length - 1];
		const centerX = (minX + maxX) / 2;

		return { columnPositionsX, rackWidths, centerX };
	}, [rackIds, braceId, getPartSize]);
};
