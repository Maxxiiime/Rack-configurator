import { useMemo } from 'react';
import { useEditorStore } from '../stores/editorStore';
import { useRackSectionsStore } from '../stores/sectionsStore';
import { useRackConfigStore } from '../stores/configStore';
import { useRackPositions } from './useRackPositions';
import { useShelfParts } from './useShelfParts';
import { useThree } from '@react-three/fiber';

export const useCameraFocus = () => {
	const selectedRackId = useEditorStore((s) => s.selectedRackId);
	const selectedArm = useEditorStore((s) => s.selectedArm);
	const sectionIds = useRackSectionsStore((s) => s.sectionIds);
	const columnId = useRackConfigStore((s) => s.columnId);
	const rackType = useRackConfigStore((s) => s.rackType);
	const sectionHeightOverrides = useRackConfigStore((s) => s.sectionHeightOverrides);

	const { getColumnHeight } = useShelfParts();
	const { columnPositionsX, rackWidths, centerX, totalWidth } = useRackPositions();
	const { camera } = useThree();

	return useMemo(() => {
		let maxColHeight = getColumnHeight(columnId);
		for (const id of Object.values(sectionHeightOverrides)) {
			const height = getColumnHeight(id as string);
			if (height > maxColHeight) {
				maxColHeight = height;
			}
		}
		const maxHeight = maxColHeight;

		let focusTarget = null;
		if (selectedRackId) {
			const index = sectionIds.indexOf(selectedRackId);
			if (index !== -1) {
				const leftCol = columnPositionsX[index];
				const rightCol = columnPositionsX[index + 1];
				const zDirection = rackType === 'double' && camera.position.z >= 0 ? 1 : -1;
				focusTarget = {
					centerX: (leftCol + rightCol) / 2 - centerX,
					width: rackWidths[index],
					zDirection
				};
			}
		} else if (selectedArm && selectedArm.columnIndex !== undefined) {
			const colX = columnPositionsX[selectedArm.columnIndex];
			const rackIndex = Math.min(selectedArm.columnIndex, rackWidths.length - 1);
			const zDirection = rackType === 'double' && (selectedArm.side === 'back' || (selectedArm.side !== 'front' && camera.position.z >= 0)) ? 1 : -1;
			focusTarget = {
				centerX: colX - centerX,
				width: rackWidths[rackIndex],
				zDirection
			};
		}

		return {
			maxHeight,
			totalWidth,
			focusTarget
		};
	}, [columnId, sectionHeightOverrides, getColumnHeight, selectedRackId, selectedArm, sectionIds, columnPositionsX, rackWidths, centerX, totalWidth, camera, rackType]);
};
