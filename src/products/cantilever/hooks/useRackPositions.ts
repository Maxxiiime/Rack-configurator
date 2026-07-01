import { useMemo } from 'react';
import { useShelfParts } from "./useShelfParts";
import { useRackSectionsStore } from "../stores/sectionsStore";
import { useRackConfigStore } from "../stores/configStore";

export const useRackPositions = () => {
	const sectionIds = useRackSectionsStore((s) => s.sectionIds);
	const braceId = useRackConfigStore((s) => s.braceId);
	const sectionWidthOverrides = useRackConfigStore((s) => s.sectionWidthOverrides);
	const { getPartSize } = useShelfParts();

	return useMemo(() => {
		const defaultBraceWidth = getPartSize(braceId) / 100;

		// Calculate the width for each rack
		const rackWidths = sectionIds.map((id) => {
			const override = sectionWidthOverrides[id];
			return override !== undefined ? override / 100 : defaultBraceWidth;
		});

		// Find the initial rack to keep positions stable
		const anchorIndex = sectionIds.indexOf("initial-section");
		const anchorIdx = anchorIndex !== -1 ? anchorIndex : 0;

		// Calculate column positions relative to the anchor rack starting at 0
		const columnPositionsX: number[] = new Array(sectionIds.length + 1);
		columnPositionsX[anchorIdx] = 0;

		// Calculate forward from anchor
		for (let i = anchorIdx + 1; i <= sectionIds.length; i++) {
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
	}, [sectionIds, braceId, getPartSize, sectionWidthOverrides]);
};
