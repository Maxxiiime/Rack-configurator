import React from "react";
import { useRackStore } from "@/stores/rackStore";
import { ColumnAssembly } from "./ColumnAssembly";
import { BraceAssembly } from "./BraceAssembly";
import { useShelfParts } from "@/hooks/useShelfParts";
import { useRackControls } from "@/hooks/useRackControls";
import { useRackPositions } from "@/hooks/useRackPositions";
import { Button } from "./Button";

export const RackSystem: React.FC = () => {

	useRackControls();

	const {
		rackType,
		numLevels,
		activeColumnId,
		activeArmId,
		activeLegId,
		racks,
		addRackLeft,
		addRackRight,
		removeRack,
	} = useRackStore();

	const { getPartSize } = useShelfParts();
	const { columnPositionsX, rackWidths } = useRackPositions(racks);

	return (
		<group >
			{columnPositionsX.map((posX, index) => (
				<ColumnAssembly
					key={`column-${index}`}
					columnId={activeColumnId}
					legId={activeLegId}
					armId={activeArmId}
					rackType={rackType}
					numLevels={numLevels}
					position={[posX, 0, 0]}
				/>
			))}

			{racks.map((rack, index) => {
				const posX = columnPositionsX[index];
				const braceSize = getPartSize(rack.braceId);

				return (
					<group key={rack.id} position={[posX, 0, 0]}>
						<BraceAssembly braceSize={braceSize} />
						{racks.length > 1 && rack.id !== "initial-rack" && (
							<Button
								type="less"
								position={[rackWidths[index] / 2, 1.0, 0]}
								onClick={() => removeRack(rack.id)}
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

