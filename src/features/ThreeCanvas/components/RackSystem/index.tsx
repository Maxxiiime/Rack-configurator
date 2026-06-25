import React, { useRef } from "react";
import * as THREE from "three";
import { useRackConfigStore, selectActiveLegId } from "@/stores/cantilever/rackConfigStore";
import { useRackSectionsStore } from "@/stores/cantilever/rackSectionsStore";
import { useEditorStore } from "@/stores/cantilever/editorStore";
import { ColumnAssembly } from "./ColumnAssembly";
import { BraceAssembly } from "./BraceAssembly";
import { useShelfParts } from "@/hooks/useShelfParts";
import { useRackPositions } from "@/hooks/useRackPositions";
import { Button3D } from "./Button3D";
import { DimensionLines } from "../DimensionsLines/index";
import { WeightInfo } from "../WeightInfo/index";
import { useArmPositions } from "@/hooks/useArmPositions";

export const RackSystem: React.FC = () => {

	const rackType = useRackConfigStore((s) => s.rackType);
	const columnId = useRackConfigStore((s) => s.columnId);
	const armId = useRackConfigStore((s) => s.armId);
	const braceId = useRackConfigStore((s) => s.braceId);
	const sectionWidthOverrides = useRackConfigStore((s) => s.sectionWidthOverrides);
	const removeFirstColumn = useRackConfigStore((s) => s.removeFirstColumn);
	const removeLastColumn = useRackConfigStore((s) => s.removeLastColumn);
	const activeLegId = useRackConfigStore(selectActiveLegId);

	const rackIds = useRackSectionsStore((s) => s.rackIds);
	const addRackLeft = useRackSectionsStore((s) => s.addRackLeft);
	const addRackRight = useRackSectionsStore((s) => s.addRackRight);
	const removeRack = useRackSectionsStore((s) => s.removeRack);

	const currentStep = useEditorStore((s) => s.currentStep);
	const showDimensions = useEditorStore((s) => s.showDimensions);
	const showWeightInfo = useEditorStore((s) => s.showWeightInfo);
	const selectedRackId = useEditorStore((s) => s.selectedRackId);
	const selectedArmIndex = useEditorStore((s) => s.selectedArmIndex);
	const setSelectedRackId = useEditorStore((s) => s.setSelectedRackId);
	const setSelectedArmIndex = useEditorStore((s) => s.setSelectedArmIndex);

	const { getPartSize } = useShelfParts();
	const { columnPositionsX, rackWidths, centerX } = useRackPositions();

	const braceSize = getPartSize(braceId);
	const rackGroupRef = useRef<THREE.Group>(null);

	const { armPositions } = useArmPositions();

	// Rightmost column X for arm ruler icons
	const rightmostColumnX = columnPositionsX[columnPositionsX.length - 1];

	return (
		<group position={[-centerX, 0, 0]}>
			<group ref={rackGroupRef}>
				{columnPositionsX.map((posX, index) => {
					if (removeLastColumn && index === 0) return null;
					if (removeFirstColumn && index === columnPositionsX.length - 1) return null;

					const leftSectionId = index > 0 ? rackIds[index - 1] : null;
					const rightSectionId = index < rackIds.length ? rackIds[index] : null;
					const isSelected = selectedRackId !== null && (selectedRackId === leftSectionId || selectedRackId === rightSectionId);

					return (
						<ColumnAssembly
							key={`column-${index}`}
							columnId={columnId}
							legId={activeLegId}
							armId={armId}
							rackType={rackType}
							position={[posX, 0, 0]}
							selectedMode={isSelected}
						/>
					);
				})}

				{rackIds.map((rackId, index) => {
					const posX = columnPositionsX[index];
					const currentBraceSize = sectionWidthOverrides[rackId] ?? braceSize;

					return (
						<group key={rackId} position={[posX, 0, 0]}>
							<BraceAssembly
								braceSize={currentBraceSize}
								columnId={columnId}
								hasXBrace={(rackIds.length - 1 - index) % 3 === 0}
								selectedMode={selectedRackId === rackId}
								isFirst={index === 0}
								isLast={index === rackIds.length - 1}
								removeLeftColumn={removeLastColumn}
								removeRightColumn={removeFirstColumn}
							/>

							{/* Step 1: Delete buttons */}
							{currentStep === 1 && rackIds.length > 1 && rackId !== "initial-rack" && (
								<Button3D
									type="delete"
									position={[rackWidths[index] / 2, 1.0, 0]}
									onClick={() => removeRack(rackId)}
								/>
							)}

							{/* Step 2: Ruler icon under each rack section */}
							{currentStep === 2 && (
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
						onClick={addRackLeft}
					/>
					<Button3D
						type="plus"
						position={[columnPositionsX[columnPositionsX.length - 1] + 5, 10.0, 0]}
						onClick={addRackRight}
					/>
				</>
			)}

			{/* Step 2: Ruler icons at the end of each arm row */}
			{currentStep === 2 && armPositions.map((yPos, i) => (
				<Button3D
					key={`arm-ruler-${i}`}
					type="ruler"
					position={[rightmostColumnX + 6, yPos, 0]}
					onClick={() => setSelectedArmIndex(selectedArmIndex === i ? null : i)}
					isActive={selectedArmIndex === i}
				/>
			))}

		</group>
	);
};