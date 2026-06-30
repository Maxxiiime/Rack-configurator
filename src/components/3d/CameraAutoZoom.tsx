import { useFrame, useThree } from "@react-three/fiber";
import { useEffect, useRef, useMemo } from "react";
import * as THREE from "three";

const MIN_DISTANCE = 30;
const LERP_SPEED = 10;
const ARRIVAL_THRESHOLD = 0.05;
const PADDING_HORIZONTAL = 1.6;
const PADDING_VERTICAL = 1.8;

export interface CameraAutoZoomProps {
	/** Maximum height of the entire scene (used for default fit) */
	maxHeight: number;
	/** Total width of the entire scene (used for default fit) */
	totalWidth: number;
	/** Optional specific target to focus on */
	focusTarget?: {
		centerX: number;
		width: number;
	} | null;
}

/**
 * A generic camera controller that automatically adjusts distance and target 
 * to fit the provided dimensions in view. It smoothly animates between states.
 */
export const CameraAutoZoom: React.FC<CameraAutoZoomProps> = ({ maxHeight, totalWidth, focusTarget }) => {
	const { camera, controls } = useThree();

	const isAnimating = useRef(false);
	const targetDistance = useRef(MIN_DISTANCE);
	const targetLookAt = useRef(new THREE.Vector3(0, 0, 0));
	const direction = useRef(new THREE.Vector3());
	const currentTarget = useRef(new THREE.Vector3(0, 0, 0));
	const targetCameraPos = useRef(new THREE.Vector3(0, 0, 0));
	const useSpecificPosition = useRef(false);
	const wasFocused = useRef(false);

	// Compute default auto distance based on total width/height
	const autoDistance = useMemo(() => {
		const perspCamera = camera as THREE.PerspectiveCamera;
		const fovRad = (perspCamera.fov * Math.PI) / 180;
		const aspect = perspCamera.aspect;

		const hFov = 2 * Math.atan(Math.tan(fovRad / 2) * aspect);
		const distForWidth = (totalWidth * PADDING_HORIZONTAL) / (2 * Math.tan(hFov / 2));
		const distForHeight = (maxHeight * PADDING_VERTICAL) / (2 * Math.tan(fovRad / 2));

		return Math.max(distForWidth, distForHeight);
	}, [totalWidth, maxHeight, camera]);

	useEffect(() => {
		if (focusTarget && focusTarget.width > 0) {
			const perspCamera = camera as THREE.PerspectiveCamera;
			const fovRad = (perspCamera.fov * Math.PI) / 180;
			const aspect = perspCamera.aspect;
			const hFov = 2 * Math.atan(Math.tan(fovRad / 2) * aspect);

			const distForWidth = (focusTarget.width * PADDING_HORIZONTAL) / (2 * Math.tan(hFov / 2));
			const distForHeight = (maxHeight * PADDING_VERTICAL) / (2 * Math.tan(fovRad / 2));

			targetDistance.current = Math.max(MIN_DISTANCE, Math.max(distForWidth, distForHeight));
			targetLookAt.current.set(focusTarget.centerX, 0, 0);
			targetCameraPos.current.set(focusTarget.centerX, 0, -targetDistance.current);
			useSpecificPosition.current = true;
			wasFocused.current = true;
		} else {
			targetDistance.current = Math.max(MIN_DISTANCE, autoDistance);
			targetLookAt.current.set(0, 0, 0);

			if (wasFocused.current) {
				// Zoom back out smoothly
				targetCameraPos.current.set(0, 5, -30).normalize().multiplyScalar(targetDistance.current);
				useSpecificPosition.current = true;
				wasFocused.current = false;
			} else {
				useSpecificPosition.current = false;
			}
		}

		isAnimating.current = true;
	}, [autoDistance, focusTarget, maxHeight, camera]);

	useFrame((_, delta) => {
		if (!isAnimating.current) return;
		if (controls) {
			const orbitControls = controls as any;
			orbitControls.target.lerp(targetLookAt.current, 1 - Math.exp(-LERP_SPEED * delta));
			currentTarget.current.copy(orbitControls.target);
		} else {
			currentTarget.current.copy(targetLookAt.current);
		}

		let desiredCameraPos: THREE.Vector3;

		if (useSpecificPosition.current) {
			desiredCameraPos = targetCameraPos.current;
		} else {
			direction.current.subVectors(camera.position, currentTarget.current).normalize();
			if (direction.current.lengthSq() < 0.01) {
				direction.current.set(0, 0, -1);
			}
			desiredCameraPos = new THREE.Vector3().copy(currentTarget.current).add(
				direction.current.multiplyScalar(targetDistance.current)
			);
		}

		camera.position.lerp(desiredCameraPos, 1 - Math.exp(-LERP_SPEED * delta));

		if (controls) {
			(controls as any).update();
		}

		const distToPos = camera.position.distanceTo(desiredCameraPos);
		const distToTarget = currentTarget.current.distanceTo(targetLookAt.current);

		if (distToPos < ARRIVAL_THRESHOLD && distToTarget < ARRIVAL_THRESHOLD) {
			camera.position.copy(desiredCameraPos);
			if (controls) {
				(controls as any).target.copy(targetLookAt.current);
				(controls as any).update();
			}
			isAnimating.current = false;
		}
	});

	return null;
};
