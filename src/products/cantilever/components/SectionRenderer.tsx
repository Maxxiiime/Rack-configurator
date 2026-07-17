import React from 'react';
import { BraceAssembly } from './BraceAssembly';
import { useRackConfigStore } from '../stores/configStore';
import { useRackSectionsStore } from '../stores/sectionsStore';
import { useEditorStore } from '../stores/editorStore';
import { useHoverStore } from '@/stores/hoverStore';
import { getPartSize } from '../utils/shelfParts';
import { useRackPositions } from '../hooks/useRackPositions';

export const SectionRenderer: React.FC = () => {
	const columnId = useRackConfigStore((s) => s.columnId);
	const braceId = useRackConfigStore((s) => s.braceId);
	const sectionWidthOverrides = useRackConfigStore((s) => s.sectionWidthOverrides);
	const sectionHeightOverrides = useRackConfigStore((s) => s.sectionHeightOverrides);
	const removeFirstColumn = useRackConfigStore((s) => s.removeFirstColumn);
	const removeLastColumn = useRackConfigStore((s) => s.removeLastColumn);

	const sectionIds = useRackSectionsStore((s) => s.sectionIds);
	const selectedRackId = useEditorStore((s) => s.selectedRackId);
	const currentStep = useEditorStore((s) => s.currentStep);
	const setSelectedRackId = useEditorStore((s) => s.setSelectedRackId);

	const hoveredId = useHoverStore((s) => s.hoveredId);
	const setHoveredId = useHoverStore((s) => s.setHoveredId);

	const braceSize = getPartSize(braceId);
	const { columnPositionsX } = useRackPositions();

	return (
		<>
			{sectionIds.map((rackId, index) => {
				const posX = columnPositionsX[index];
				const currentBraceSize = sectionWidthOverrides[rackId] ?? braceSize;
				const currentHeightId = sectionHeightOverrides[rackId] ?? columnId;

				const handleClick = currentStep === 1
					? () => setSelectedRackId(selectedRackId === rackId ? null : rackId)
					: undefined;

				const isHovered = currentStep === 1 && hoveredId === rackId;

				return (
					<group key={rackId} position={[posX, 0, 0]}>
						<BraceAssembly
							braceSize={currentBraceSize}
							columnId={currentHeightId}
							hasXBrace={(sectionIds.length - 1 - index) % 3 === 0}
							selectedMode={selectedRackId === rackId}
							hoveredMode={isHovered}
							isFirst={index === 0}
							isLast={index === sectionIds.length - 1}
							removeLeftColumn={removeLastColumn}
							removeRightColumn={removeFirstColumn}
							onClick={handleClick}
							onPointerOver={currentStep === 1 ? () => setHoveredId(rackId) : undefined}
							onPointerOut={currentStep === 1 ? () => setHoveredId(null) : undefined}
						/>
					</group>
				);
			})}
		</>
	);
};

