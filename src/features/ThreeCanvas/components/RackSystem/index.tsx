import React, { useRef } from "react";
import * as THREE from "three";
import { useRackStore, selectActiveLegId } from "@/stores/rackStore";
import { ColumnAssembly } from "./ColumnAssembly";
import { BraceAssembly } from "./BraceAssembly";
import { useShelfParts } from "@/hooks/useShelfParts";
import { useRackPositions } from "@/hooks/useRackPositions";
import { Button3D } from "./Button3D";
import { DimensionLines } from "./DimensionLines";

export const RackSystem: React.FC = () => {

	const rackType = useRackStore((s) => s.rackType);
	const columnId = useRackStore((s) => s.columnId);
	const armId = useRackStore((s) => s.armId);
	const braceId = useRackStore((s) => s.braceId);
	const activeLegId = useRackStore(selectActiveLegId);
	const rackIds = useRackStore((s) => s.rackIds);
	const addRackLeft = useRackStore((s) => s.addRackLeft);
	const addRackRight = useRackStore((s) => s.addRackRight);
	const removeRack = useRackStore((s) => s.removeRack);
	const showDimensions = useRackStore((s) => s.showDimensions);

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