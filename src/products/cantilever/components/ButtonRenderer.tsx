import React from 'react';
import { Button3D } from '@/components/3d/Button3D';
import { useRackSectionsStore } from '../stores/sectionsStore';
import { useEditorStore } from '../stores/editorStore';
import { useRackPositions } from '../hooks/useRackPositions';

export const ButtonRenderer: React.FC = () => {
	const currentStep = useEditorStore((s) => s.currentStep);

	// Step 1: Controls & Section Deletion
	const addSectionLeft = useRackSectionsStore((s) => s.addSectionLeft);
	const addSectionRight = useRackSectionsStore((s) => s.addSectionRight);
	const sectionIds = useRackSectionsStore((s) => s.sectionIds);
	const removeSection = useRackSectionsStore((s) => s.removeSection);

	const { columnPositionsX, rackWidths } = useRackPositions();

	return (
		<>
			{/* ====== STEP 1: LAYOUT ====== */}
			{currentStep === 1 && (
				<>
					<Button3D
						type="plus"
						position={[columnPositionsX[0] - 5, 10.0, 0]}
						onClick={addSectionLeft}
					/>
					<Button3D
						type="plus"
						position={[columnPositionsX[columnPositionsX.length - 1] + 5, 10.0, 0]}
						onClick={addSectionRight}
					/>

					{sectionIds.map((rackId, index) => {
						if (sectionIds.length <= 1 || rackId === "initial-section") return null;
						const posX = columnPositionsX[index];
						return (
							<Button3D
								key={`delete-${rackId}`}
								type="delete"
								position={[posX + rackWidths[index] / 2, 1.0, 0]}
								onClick={() => removeSection(rackId)}
							/>
						);
					})}
				</>
			)}
		</>
	);
};

