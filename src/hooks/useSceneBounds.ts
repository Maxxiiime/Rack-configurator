import { useState, useCallback, useEffect } from "react";
import { useFrame } from "@react-three/fiber";
import { getBoundingBox } from "@/utils/boundingBox";
import type { Object3D } from "three";

/**
 * Measures the bounding box of a scene group
 * Returns the current width (X), height (Y) and depth (Z) in scene units.
 */
export const useSceneBounds = (groupRef: React.RefObject<Object3D | null>) => {
	const [totalWidth, setTotalWidth] = useState(0);
	const [maxHeight, setMaxHeight] = useState(0);
	const [depth, setDepth] = useState(0);

	const updateBounds = useCallback(() => {
		if (!groupRef.current) return;

		const { boundingX, boundingY, boundingZ } = getBoundingBox(groupRef.current);

		// Only update state if values actually changed (avoid re-render loops)
		setTotalWidth((prev) => Math.abs(prev - boundingX) > 0.01 ? boundingX : prev);
		setMaxHeight((prev) => Math.abs(prev - boundingY) > 0.01 ? boundingY : prev);
		setDepth((prev) => Math.abs(prev - boundingZ) > 0.01 ? boundingZ : prev);
	}, [groupRef]);

	useEffect(() => {
		updateBounds();
	}, [updateBounds]);

	useFrame(() => {
		updateBounds();
	});

	return { totalWidth, maxHeight, depth };
};
