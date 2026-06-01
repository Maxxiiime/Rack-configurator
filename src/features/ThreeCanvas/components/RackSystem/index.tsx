import React from "react";
import { useRackStore, selectActiveLegId } from "@/stores/rackStore";
import { ColumnAssembly } from "./ColumnAssembly";
import { BraceAssembly } from "./BraceAssembly";
import { useShelfParts } from "@/hooks/useShelfParts";
import { useRackControls } from "@/hooks/useRackControls";
import { useRackPositions } from "@/hooks/useRackPositions";
import { Button } from "./Button";

export const RackSystem: React.FC = () => {

	useRackControls();

	const rackType = useRackStore((s) => s.rackType);
	const columnId = useRackStore((s) => s.columnId);
	const armId = useRackStore((s) => s.armId);
	const braceId = useRackStore((s) => s.braceId);
	const activeLegId = useRackStore(selectActiveLegId);
	const rackIds = useRackStore((s) => s.rackIds);
	const addRackLeft = useRackStore((s) => s.addRackLeft);
	const addRackRight = useRackStore((s) => s.addRackRight);
	const removeRack = useRackStore((s) => s.removeRack);

	const { getPartSize } = useShelfParts();
	const { columnPositionsX, rackWidths, centerX } = useRackPositions();

	const braceSize = getPartSize(braceId);

	return (
		<group position={[-centerX, 0, 0]}>
			{columnPositionsX.map((posX, index) => {
				return (
					<ColumnAssembly
						key={`column-${index}`}
						columnId={columnId}
						legId={activeLegId}
						armId={armId}
						rackType={rackType}
						position={[posX, 0, 0]}
					/>
				);
			})}

			{rackIds.map((rackId, index) => {
				const posX = columnPositionsX[index];

				return (
					<group
						key={rackId}
						position={[posX, 0, 0]}
					>
						<BraceAssembly
							braceSize={braceSize}
							columnId={columnId}
						/>
						{rackIds.length > 1 && rackId !== "initial-rack" && (
							<Button
								type="delete"
								position={[rackWidths[index] / 2, 1.0, 0]}
								onClick={() => removeRack(rackId)}
							/>
						)}
					</group>
				);
			})}
			<Button
				type="plus"
				position={[columnPositionsX[0] - 5, 10.0, 0]}
				onClick={addRackLeft}
			/>

			<Button
				type="plus"
				position={[columnPositionsX[columnPositionsX.length - 1] + 5, 10.0, 0]}
				onClick={addRackRight}
			/>
		</group>
	);
};
