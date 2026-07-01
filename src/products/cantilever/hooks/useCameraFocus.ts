import { useMemo } from 'react';
import { useEditorStore } from '../stores/editorStore';
import { useRackSectionsStore } from '../stores/sectionsStore';
import { useRackConfigStore } from '../stores/configStore';
import { useRackPositions } from './useRackPositions';
import { useShelfParts } from './useShelfParts';

export const useCameraFocus = () => {
	const selectedRackId = useEditorStore((s) => s.selectedRackId);
	const selectedArm = useEditorStore((s) => s.selectedArm);
	const sectionIds = useRackSectionsStore((s) => s.sectionIds);
	const columnId = useRackConfigStore((s) => s.columnId);
	
	const { getColumnHeight } = useShelfParts();
	const { columnPositionsX, rackWidths, centerX, totalWidth } = useRackPositions();

	return useMemo(() => {
		const maxHeight = getColumnHeight(columnId);

		let focusTarget = null;
		if (selectedRackId) {
			const index = sectionIds.indexOf(selectedRackId);
			if (index !== -1) {
				const leftCol = columnPositionsX[index];
				const rightCol = columnPositionsX[index + 1];
				focusTarget = {
					centerX: (leftCol + rightCol) / 2 - centerX,
					width: rackWidths[index]
				};
			}
		} else if (selectedArm && selectedArm.columnIndex !== undefined) {
			const colX = columnPositionsX[selectedArm.columnIndex];
			const rackIndex = Math.min(selectedArm.columnIndex, rackWidths.length - 1);
			focusTarget = {
				centerX: colX - centerX,
				width: rackWidths[rackIndex]
			};
		}

		return {
			maxHeight,
			totalWidth,
			focusTarget
		};
	}, [columnId, getColumnHeight, selectedRackId, selectedArm, sectionIds, columnPositionsX, rackWidths, centerX, totalWidth]);
};
