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
		activeColumnId,
		activeArmId,
		activeLegId,
		racks,
		selectedRack,
		setSelectedRack,
		addRackLeft,
		addRackRight,
		removeRack,
	} = useRackStore();

	const { getPartSize } = useShelfParts();
	const { columnPositionsX, rackWidths } = useRackPositions(racks);

	return (
		<group onPointerMissed={() => setSelectedRack(null)}>
			{columnPositionsX.map((posX, index) => {
				const isSelected = 
					(index < racks.length && racks[index].id === selectedRack) || 
					(index > 0 && racks[index - 1].id === selectedRack);
				
				return (
					<ColumnAssembly
						key={`column-${index}`}
						columnId={activeColumnId}
						legId={activeLegId}
						armId={activeArmId}
						rackType={rackType}
						position={[posX, 0, 0]}
						isSelected={isSelected}
					/>
				);
			})}

			{racks.map((rack, index) => {
				const posX = columnPositionsX[index];
				const braceSize = getPartSize(rack.braceId);
				const isSelected = rack.id === selectedRack;

				return (
					<group 
						key={rack.id} 
						position={[posX, 0, 0]} 
						onClick={(e) => {
							e.stopPropagation();
							setSelectedRack(rack.id);
						}}
					>
						<BraceAssembly braceSize={braceSize} isSelected={isSelected} />
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

