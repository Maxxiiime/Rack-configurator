import React, { useRef, useEffect } from "react";
import * as THREE from "three";
import { useRackConfigStore } from "../stores/configStore";
import { useEditorStore } from "../stores/editorStore";
import { useHoverStore } from "@/stores/hoverStore";
import { useRackPositions } from "../hooks/useRackPositions";
import { DimensionLines } from "./DimensionLines/index";
import { WeightInfo } from "./WeightInfo/index";
import { CameraAutoZoom } from "@/components/3d/CameraAutoZoom";
import { useCameraFocus } from "../hooks/useCameraFocus";

import { ColumnRenderer } from "./ColumnRenderer";
import { SectionRenderer } from "./SectionRenderer";
import { ButtonRenderer } from "./ButtonRenderer";

export const RackSystem: React.FC = () => {
	const rackType = useRackConfigStore((s) => s.rackType);
	const showDimensions = useEditorStore((s) => s.showDimensions);
	const showWeightInfo = useEditorStore((s) => s.showWeightInfo);
	const currentStep = useEditorStore((s) => s.currentStep);
	const setHoveredId = useHoverStore((s) => s.setHoveredId);

	// Clear hover highlight when switching steps
	useEffect(() => {
		setHoveredId(null);
	}, [currentStep, setHoveredId]);

	const { centerX } = useRackPositions();
	const { maxHeight, totalWidth, focusTarget } = useCameraFocus();

	const rackGroupRef = useRef<THREE.Group>(null);

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
					<ColumnRenderer />
					<SectionRenderer />
				</group>

				{showDimensions && <DimensionLines rackGroupRef={rackGroupRef} />}
				{showWeightInfo && <WeightInfo rackGroupRef={rackGroupRef} />}

				<ButtonRenderer />
			</group>
		</>
	);
};