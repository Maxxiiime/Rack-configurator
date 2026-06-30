import { useMemo } from 'react';
import { useShelfParts } from "./useShelfParts";
import { useRackSectionsStore } from "../stores/sectionsStore";
import { useRackConfigStore } from "../stores/configStore";

export const useRackPositions = () => {
	const rackIds = useRackSectionsStore((s) => s.rackIds);
	const braceId = useRackConfigStore((s) => s.braceId);
	const sectionWidthOverrides = useRackConfigStore((s) => s.sectionWidthOverrides);
	const { getPartSize } = useShelfParts();

	return useMemo(() => {
		const defaultBraceWidth = getPartSize(braceId) / 100;

		// Calculate the width for each rack
		const rackWidths = rackIds.map((id) => {
			const override = sectionWidthOverrides[id];
			return override !== undefined ? override / 100 : defaultBraceWidth;
		});

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
		const totalWidth = maxX - minX;

		return { columnPositionsX, rackWidths, centerX, totalWidth };
	}, [rackIds, braceId, getPartSize, sectionWidthOverrides]);
};
