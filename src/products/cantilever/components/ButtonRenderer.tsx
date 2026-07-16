import React from 'react';
import { Button3D } from '@/components/3d/Button3D';
import { useRackConfigStore } from '../stores/configStore';
import { useRackSectionsStore } from '../stores/sectionsStore';
import { useEditorStore } from '../stores/editorStore';
import { getPartSize, offsets } from '../utils/shelfParts';
import { useRackPositions } from '../hooks/useRackPositions';
import { useArmPositions } from '../hooks/useArmPositions';

export const ButtonRenderer: React.FC = () => {
	const currentStep = useEditorStore((s) => s.currentStep);

	// Step 1: Controls & Section Deletion
	const addSectionLeft = useRackSectionsStore((s) => s.addSectionLeft);
	const addSectionRight = useRackSectionsStore((s) => s.addSectionRight);
	const sectionIds = useRackSectionsStore((s) => s.sectionIds);
	const removeSection = useRackSectionsStore((s) => s.removeSection);

	// Step 2: Arm Rulers
	const selectedArm = useEditorStore((s) => s.selectedArm);
	const setSelectedArm = useEditorStore((s) => s.setSelectedArm);

	const rackType = useRackConfigStore((s) => s.rackType);
	const armId = useRackConfigStore((s) => s.armId);

	const armSizeUnits = getPartSize(armId) / 100;

	const { columnPositionsX, rackWidths } = useRackPositions();
	const { armPositions: armPositionsFront } = useArmPositions(undefined, 'front');
	const { armPositions: armPositionsBack } = useArmPositions(undefined, 'back');

	const rightmostColumnX = columnPositionsX[columnPositionsX.length - 1];

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

			{/* ====== STEP 2: ARMS ====== */}
			{currentStep === 2 && (
				<>
					{/* Arm Rulers */}
					{(selectedArm === null || selectedArm.columnIndex === undefined) && armPositionsFront.map((yPosFront, i) => {
						const yPosBack = armPositionsBack[i] ?? yPosFront;
						const isRowSelectedFront = selectedArm?.armIndex === i && selectedArm?.columnIndex === undefined && (selectedArm?.side === 'front' || selectedArm?.side === undefined);
						const isRowSelectedBack = selectedArm?.armIndex === i && selectedArm?.columnIndex === undefined && selectedArm?.side === 'back';

						return (
							<group key={`arm-row-ruler-${i}`}>
								<Button3D
									type="ruler"
									position={[rightmostColumnX + 3, yPosFront, offsets.arm.z - armSizeUnits - 0.2]}
									normal={[0, 0, -1]}
									onClick={() => setSelectedArm(isRowSelectedFront ? null : { armIndex: i, side: 'front' })}
									isActive={isRowSelectedFront}
								/>
								{rackType === 'double' && (
									<Button3D
										type="ruler"
										position={[rightmostColumnX + 3, yPosBack, offsets.arm.double_z + armSizeUnits + 0.2]}
										normal={[0, 0, 1]}
										onClick={() => setSelectedArm(isRowSelectedBack ? null : { armIndex: i, side: 'back' })}
										isActive={isRowSelectedBack}
									/>
								)}
							</group>
						);
					})}
				</>
			)}
		</>
	);
};
