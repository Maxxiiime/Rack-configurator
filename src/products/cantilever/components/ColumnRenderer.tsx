import React from 'react';
import { ColumnAssembly } from './ColumnAssembly';
import { useRackConfigStore, selectActiveLegId } from '../stores/configStore';
import { useRackSectionsStore } from '../stores/sectionsStore';
import { useEditorStore } from '../stores/editorStore';
import { useHoverStore } from '@/stores/hoverStore';
import { resolveEffectiveColumnId } from '../utils/resolveColumn';
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
	const currentStep = useEditorStore((s) => s.currentStep);

	const hoveredId = useHoverStore((s) => s.hoveredId);

	const { columnPositionsX } = useRackPositions();

	return (
		<>
			{columnPositionsX.map((posX, index) => {
				if (removeLastColumn && index === 0) return null;
				if (removeFirstColumn && index === columnPositionsX.length - 1) return null;

				const leftSectionId = index > 0 ? sectionIds[index - 1] : null;
				const rightSectionId = index < sectionIds.length ? sectionIds[index] : null;
				const isSelected = selectedRackId !== null && (selectedRackId === leftSectionId || selectedRackId === rightSectionId);
				const isHovered = currentStep === 1 && hoveredId !== null && (hoveredId === leftSectionId || hoveredId === rightSectionId);

				let iconDirection: 1 | -1 = 1;
				if (selectedRackId === leftSectionId) {
					iconDirection = 1;
				} else if (selectedRackId === rightSectionId) {
					iconDirection = -1;
				}

				const currentColumnId = resolveEffectiveColumnId(index, sectionIds, columnId, sectionHeightOverrides);

				return (
					<ColumnAssembly
						key={`column-${index}`}
						columnId={currentColumnId}
						legId={activeLegId}
						armId={armId}
						rackType={rackType}
						position={[posX, 0, 0]}
						selectedMode={isSelected}
						hoveredMode={isHovered}
						columnIndex={index}
						iconDirection={iconDirection}
					/>
				);
			})}
		</>
	);
};
