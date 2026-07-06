import React, { useRef } from "react";
import * as THREE from "three";
import { useRackConfigStore, selectActiveLegId } from "../stores/configStore";
import { useRackSectionsStore } from "../stores/sectionsStore";
import { useEditorStore } from "../stores/editorStore";
import { ColumnAssembly } from "./ColumnAssembly";
import { BraceAssembly } from "./BraceAssembly";
import { useShelfParts } from "../hooks/useShelfParts";
import { useRackPositions } from "../hooks/useRackPositions";
import { Button3D } from "@/components/3d/Button3D";
import { DimensionLines } from "./DimensionLines/index";
import { WeightInfo } from "./WeightInfo/index";
import { useArmPositions } from "../hooks/useArmPositions";
import { CameraAutoZoom } from "@/components/3d/CameraAutoZoom";
import { useCameraFocus } from "../hooks/useCameraFocus";

export const RackSystem: React.FC = () => {

	const rackType = useRackConfigStore((s) => s.rackType);
	const columnId = useRackConfigStore((s) => s.columnId);
	const armId = useRackConfigStore((s) => s.armId);
	const braceId = useRackConfigStore((s) => s.braceId);
	const sectionWidthOverrides = useRackConfigStore((s) => s.sectionWidthOverrides);
	const sectionHeightOverrides = useRackConfigStore((s) => s.sectionHeightOverrides);
	const removeFirstColumn = useRackConfigStore((s) => s.removeFirstColumn);
	const removeLastColumn = useRackConfigStore((s) => s.removeLastColumn);
	const activeLegId = useRackConfigStore(selectActiveLegId);

	const sectionIds = useRackSectionsStore((s) => s.sectionIds);
	const addSectionLeft = useRackSectionsStore((s) => s.addSectionLeft);
	const addSectionRight = useRackSectionsStore((s) => s.addSectionRight);
	const removeSection = useRackSectionsStore((s) => s.removeSection);

	const currentStep = useEditorStore((s) => s.currentStep);
	const showDimensions = useEditorStore((s) => s.showDimensions);
	const showWeightInfo = useEditorStore((s) => s.showWeightInfo);
	const selectedRackId = useEditorStore((s) => s.selectedRackId);
	const selectedArm = useEditorStore((s) => s.selectedArm);
	const setSelectedRackId = useEditorStore((s) => s.setSelectedRackId);
	const setSelectedArm = useEditorStore((s) => s.setSelectedArm);

	const { getPartSize, offsets } = useShelfParts();
	const armSizeUnits = getPartSize(armId) / 100;
	const { columnPositionsX, rackWidths, centerX } = useRackPositions();
	const { maxHeight, totalWidth, focusTarget } = useCameraFocus();

	const braceSize = getPartSize(braceId);
	const rackGroupRef = useRef<THREE.Group>(null);

	const { armPositions: armPositionsFront } = useArmPositions(undefined, 'front');
	const { armPositions: armPositionsBack } = useArmPositions(undefined, 'back');

	// Rightmost column X for arm ruler icons
	const rightmostColumnX = columnPositionsX[columnPositionsX.length - 1];

	return (
		<>
			<CameraAutoZoom
				maxHeight={maxHeight}
				totalWidth={totalWidth}
				focusTarget={focusTarget}
				preserveZSignOnUnfocus={rackType === 'double'}
			/>
			<group position={[-centerX, 0, 0]}>
				<group ref={rackGroupRef}>
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

					{sectionIds.map((rackId, index) => {
						const posX = columnPositionsX[index];
						const currentBraceSize = sectionWidthOverrides[rackId] ?? braceSize;
						const currentHeightId = sectionHeightOverrides[rackId] ?? columnId;

						return (
							<group key={rackId} position={[posX, 0, 0]}>
								<BraceAssembly
									braceSize={currentBraceSize}
									columnId={currentHeightId}
									hasXBrace={(sectionIds.length - 1 - index) % 3 === 0}
									selectedMode={selectedRackId === rackId}
									isFirst={index === 0}
									isLast={index === sectionIds.length - 1}
									removeLeftColumn={removeLastColumn}
									removeRightColumn={removeFirstColumn}
								/>

								{/* Step 1: Delete buttons */}
								{currentStep === 1 && sectionIds.length > 1 && rackId !== "initial-section" && (
									<Button3D
										type="delete"
										position={[rackWidths[index] / 2, 1.0, 0]}
										onClick={() => removeSection(rackId)}
									/>
								)}

								{/* Step 2: Ruler icon under each rack section */}
								{currentStep === 2 && (selectedRackId === null || selectedRackId === rackId) && (
									<Button3D
										type="ruler"
										position={[rackWidths[index] / 2, -0.5, 0]}
										onClick={() => setSelectedRackId(selectedRackId === rackId ? null : rackId)}
										isActive={selectedRackId === rackId}
									/>
								)}

							</group>
						);
					})}
				</group>

				{showDimensions && <DimensionLines rackGroupRef={rackGroupRef} />}
				{showWeightInfo && <WeightInfo rackGroupRef={rackGroupRef} />}

				{/* Step 1: Plus buttons */}
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
					</>
				)}

				{/* Step 2: Ruler icons at the end of each arm row */}
				{currentStep === 2 && selectedRackId === null && (selectedArm === null || selectedArm.columnIndex === undefined) && armPositionsFront.map((yPosFront, i) => {
					const yPosBack = armPositionsBack[i] ?? yPosFront;
					const isRowSelectedFront = selectedArm?.armIndex === i && selectedArm?.columnIndex === undefined && (selectedArm?.side === 'front' || selectedArm?.side === undefined);
					const isRowSelectedBack = selectedArm?.armIndex === i && selectedArm?.columnIndex === undefined && selectedArm?.side === 'back';
					
					return (
						<group key={`arm-row-ruler-${i}`}>
							<Button3D
								type="ruler"
								position={[rightmostColumnX + 6, yPosFront, offsets.arm.z - armSizeUnits - 0.2]}
								normal={[0, 0, -1]}
								onClick={() => setSelectedArm(isRowSelectedFront ? null : { armIndex: i, side: 'front' })}
								isActive={isRowSelectedFront}
							/>
							{rackType === 'double' && (
								<Button3D
									type="ruler"
									position={[rightmostColumnX + 6, yPosBack, offsets.arm.double_z + armSizeUnits + 0.2]}
									normal={[0, 0, 1]}
									onClick={() => setSelectedArm(isRowSelectedBack ? null : { armIndex: i, side: 'back' })}
									isActive={isRowSelectedBack}
								/>
							)}
						</group>
					);
				})}

			</group>
		</>
	);
};