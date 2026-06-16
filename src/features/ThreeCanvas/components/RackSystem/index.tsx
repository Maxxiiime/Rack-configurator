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
import { DimensionLines } from "./DimensionLines";

export const RackSystem: React.FC = () => {

	const rackType = useRackConfigStore((s) => s.rackType);
	const columnId = useRackConfigStore((s) => s.columnId);
	const armId = useRackConfigStore((s) => s.armId);
	const braceId = useRackConfigStore((s) => s.braceId);
	const activeLegId = useRackConfigStore(selectActiveLegId);

	const rackIds = useRackSectionsStore((s) => s.rackIds);
	const addRackLeft = useRackSectionsStore((s) => s.addRackLeft);
	const addRackRight = useRackSectionsStore((s) => s.addRackRight);
	const removeRack = useRackSectionsStore((s) => s.removeRack);

	const showDimensions = useEditorStore((s) => s.showDimensions);

	const { getPartSize } = useShelfParts();
	const { columnPositionsX, rackWidths, centerX } = useRackPositions();

	const braceSize = getPartSize(braceId);
	const rackGroupRef = useRef<THREE.Group>(null);

	return (
		<group position={[-centerX, 0, 0]}>
			<group ref={rackGroupRef}>
				{columnPositionsX.map((posX, index) => (
					<ColumnAssembly
						key={`column-${index}`}
						columnId={columnId}
						legId={activeLegId}
						armId={armId}
						rackType={rackType}
						position={[posX, 0, 0]}
					/>
				))}

				{rackIds.map((rackId, index) => {
					const posX = columnPositionsX[index];

					return (
						<group key={rackId} position={[posX, 0, 0]}>
							<BraceAssembly
								braceSize={braceSize}
								columnId={columnId}
								hasXBrace={(rackIds.length - 1 - index) % 3 === 0}
							/>
							{rackIds.length > 1 && rackId !== "initial-rack" && (
								<Button3D
									type="delete"
									position={[rackWidths[index] / 2, 1.0, 0]}
									onClick={() => removeRack(rackId)}
								/>
							)}
						</group>
					);
				})}
			</group>

			{showDimensions && <DimensionLines rackGroupRef={rackGroupRef} />}

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


		</group>
	);
};