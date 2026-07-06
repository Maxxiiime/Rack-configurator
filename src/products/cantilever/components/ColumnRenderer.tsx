import React from 'react';
import { ColumnAssembly } from './ColumnAssembly';
import { useRackConfigStore, selectActiveLegId } from '../stores/configStore';
import { useRackSectionsStore } from '../stores/sectionsStore';
import { useEditorStore } from '../stores/editorStore';
import { useShelfParts } from '../hooks/useShelfParts';
import { useRackPositions } from '../hooks/useRackPositions';

export const ColumnRenderer: React.FC = () => {
	const rackType = useRackConfigStore((s) => s.rackType);
	const columnId = useRackConfigStore((s) => s.columnId);
	const armId = useRackConfigStore((s) => s.armId);
	const sectionHeightOverrides = useRackConfigStore((s) => s.sectionHeightOverrides);
	const removeFirstColumn = useRackConfigStore((s) => s.removeFirstColumn);
	const removeLastColumn = useRackConfigStore((s) => s.removeLastColumn);
	const activeLegId = useRackConfigStore(selectActiveLegId);

	const sectionIds = useRackSectionsStore((s) => s.sectionIds);
	const selectedRackId = useEditorStore((s) => s.selectedRackId);

	const { getPartSize } = useShelfParts();
	const { columnPositionsX } = useRackPositions();

	return (
		<>
			{columnPositionsX.map((posX, index) => {
				if (removeLastColumn && index === 0) return null;
				if (removeFirstColumn && index === columnPositionsX.length - 1) return null;

				const leftSectionId = index > 0 ? sectionIds[index - 1] : null;
				const rightSectionId = index < sectionIds.length ? sectionIds[index] : null;
				const isSelected = selectedRackId !== null && (selectedRackId === leftSectionId || selectedRackId === rightSectionId);

				let iconDirection: 1 | -1 = 1;
				if (selectedRackId === leftSectionId) {
					iconDirection = 1;
				} else if (selectedRackId === rightSectionId) {
					iconDirection = -1;
				}

				let currentColumnId = columnId;
				if (leftSectionId || rightSectionId) {
					const leftHeightId = leftSectionId ? (sectionHeightOverrides[leftSectionId] ?? columnId) : columnId;
					const rightHeightId = rightSectionId ? (sectionHeightOverrides[rightSectionId] ?? columnId) : columnId;
					
					const leftHeight = getPartSize(leftHeightId);
					const rightHeight = getPartSize(rightHeightId);
					currentColumnId = leftHeight > rightHeight ? leftHeightId : rightHeightId;
				}

				return (
					<ColumnAssembly
						key={`column-${index}`}
						columnId={currentColumnId}
						legId={activeLegId}
						armId={armId}
						rackType={rackType}
						position={[posX, 0, 0]}
						selectedMode={isSelected}
						columnIndex={index}
						iconDirection={iconDirection}
					/>
				);
			})}
		</>
	);
};
