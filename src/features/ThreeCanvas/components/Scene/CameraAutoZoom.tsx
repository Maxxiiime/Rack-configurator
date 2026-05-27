import { useFrame, useThree } from "@react-three/fiber";
import { useEffect, useRef } from "react";
import { useCameraDistance } from "@/hooks/useCameraDistance";
import * as THREE from "three";

const MIN_DISTANCE = 30;
const LERP_SPEED = 3;
const ARRIVAL_THRESHOLD = 0.05;

/**
 * Automatically adjusts camera distance to fit the entire rack system in view.
 * Only animates when racks are modified — the user can freely zoom between changes.
 */
const CameraAutoZoom = () => {
	const { camera } = useThree();
	const { autoDistance } = useCameraDistance();

	const isAnimating = useRef(false);
	const targetDistance = useRef(MIN_DISTANCE);
	const direction = useRef(new THREE.Vector3());

	// Trigger animation only when rack dimensions change
	useEffect(() => {
		targetDistance.current = Math.max(MIN_DISTANCE, autoDistance);
		isAnimating.current = true;
	}, [autoDistance]);

	useFrame((_, delta) => {
		if (!isAnimating.current) return;

		// Compute target position: same direction, new distance
		direction.current.copy(camera.position).normalize().multiplyScalar(targetDistance.current);

		// Smooth lerp
		camera.position.lerp(direction.current, 1 - Math.exp(-LERP_SPEED * delta));

		// Stop animating once close enough
		if (camera.position.distanceTo(direction.current) < ARRIVAL_THRESHOLD) {
			camera.position.copy(direction.current);
			isAnimating.current = false;
		}
	});

	return null;
};

export default CameraAutoZoom;
