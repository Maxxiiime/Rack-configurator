import { useMemo } from "react";
import { useThree } from "@react-three/fiber";
import { useRackConfigStore } from "../stores/configStore";
import { useRackPositions } from "../hooks/useRackPositions";
import { useShelfParts } from "../hooks/useShelfParts";
import { PerspectiveCamera } from "three";

const PADDING_HORIZONTAL = 1.6;
const PADDING_VERTICAL = 1.8;

/**
 * Computes the ideal camera distance to fit the entire rack system in view.
 * Takes into account both the total width and the tallest column height.
 * Returns the raw autoDistance — consumers apply their own multipliers/clamps.
 */
export const useCameraDistance = () => {
	const { camera } = useThree();
	const columnId = useRackConfigStore((s: any) => s.columnId);
	const { columnPositionsX } = useRackPositions();
	const { getColumnHeight } = useShelfParts();

	const totalWidth = useMemo(() => {
		const minX = columnPositionsX[0];
		const maxX = columnPositionsX[columnPositionsX.length - 1];
		return maxX - minX;
	}, [columnPositionsX]);

	const maxHeight = useMemo(() => {
		return getColumnHeight(columnId);
	}, [columnId, getColumnHeight]);

	const autoDistance = useMemo(() => {
		const perspCamera = camera as PerspectiveCamera;
		const fovRad = (perspCamera.fov * Math.PI) / 180;
		const aspect = perspCamera.aspect;

		const hFov = 2 * Math.atan(Math.tan(fovRad / 2) * aspect);
		const distForWidth = (totalWidth * PADDING_HORIZONTAL) / (2 * Math.tan(hFov / 2));
		const distForHeight = (maxHeight * PADDING_VERTICAL) / (2 * Math.tan(fovRad / 2));

		return Math.max(distForWidth, distForHeight);
	}, [totalWidth, maxHeight, camera]);

	return { autoDistance, totalWidth, maxHeight };
};
