import { useMemo } from "react";
import { useThree } from "@react-three/fiber";
import { useSceneBounds } from "./useSceneBounds";
import type { PerspectiveCamera, Object3D } from "three";

const PADDING_HORIZONTAL = 1.6;
const PADDING_VERTICAL = 1.8;

/**
 * Generic camera distance hook.
 * 
 * Measures the bounding box of the given scene group and computes
 * the ideal camera distance to fit it in the viewport.
 */
export const useCameraDistance = (sceneRef: React.RefObject<Object3D | null>) => {
	const { camera } = useThree();
	const { totalWidth, maxHeight } = useSceneBounds(sceneRef);

	const autoDistance = useMemo(() => {
		if (totalWidth === 0 && maxHeight === 0) return 30; // Default until measured

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
