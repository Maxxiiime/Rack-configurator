import React from "react";
import { useRackStore } from "@/stores/rackStore";
import { ColumnAssembly } from "./ColumnAssembly";
import { BraceAssembly } from "./BraceAssembly";
import { useShelfParts } from "@/hooks/useShelfParts";
import { useRackControls } from "@/hooks/useRackControls";

export const RackSystem: React.FC = () => {
	// Initialize Leva controls for rack parameters
	useRackControls();

	const { rackType, numLevels, activeColumnId, activeArmId, activeBraceId, activeLegId } = useRackStore();

	const { getBraceLength, getPartSize } = useShelfParts();

	// Derived values for placement
	const braceSize = getPartSize(activeBraceId);
	const columnSpacing = getBraceLength(String(braceSize));

	return (
		<group>
			{/* LEFT COLUMN */}
			<ColumnAssembly
				columnId={activeColumnId}
				legId={activeLegId}
				armId={activeArmId}
				rackType={rackType}
				numLevels={numLevels}
			/>

			{/* RIGHT COLUMN ASSEMBLY */}
			<ColumnAssembly
				columnId={activeColumnId}
				legId={activeLegId}
				armId={activeArmId}
				rackType={rackType}
				numLevels={numLevels}
				position={[columnSpacing, 0, 0]}
			/>

			{/* BRACE */}
			<BraceAssembly braceSize={braceSize} />
		</group>
	);
};
