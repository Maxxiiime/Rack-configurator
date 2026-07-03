import { useFrame, useThree } from "@react-three/fiber";
import { useEffect, useRef, useMemo, useCallback } from "react";
import * as THREE from "three";
import type { OrbitControls as OrbitControlsImpl } from "three-stdlib";
import { OrbitControls } from "@react-three/drei";

const MIN_DISTANCE = 30;
const LERP_SPEED = 10;
const ARRIVAL_THRESHOLD = 0.05;
const PADDING_HORIZONTAL = 1.7;
const PADDING_VERTICAL = 1.8;

const MIN_MAX_DISTANCE = 30;
const MAX_DISTANCE_MULTIPLIER = 1.2;
const MIN_MIN_DISTANCE = 10;
const MIN_DISTANCE_MULTIPLIER = 0.4;

export interface CameraAutoZoomProps {
	/** Maximum height of the entire scene (used for default fit) */
	maxHeight: number;
	/** Total width of the entire scene (used for default fit) */
	totalWidth: number;
	/** Optional specific target to focus on */
	focusTarget?: {
		centerX: number;
		width: number;
		zDirection?: number;
	} | null;
	/** * ADDED: Optional fallback position when zooming out. 
	 * This prevents hardcoding a specific vector that might not fit all scene sizes.
	 */
	defaultPosition?: THREE.Vector3;
	/** Whether to preserve the current Z sign when zooming out (useful for double-sided objects) */
	preserveZSignOnUnfocus?: boolean;
}

/**
 * ADDED: Extracted math logic into a utility function to keep the code DRY.
 * Calculates the required distance to fit a given width/height within the camera's FOV.
 */
const calculateDistanceToFit = (width: number, height: number, camera: THREE.PerspectiveCamera) => {
	const fovRad = (camera.fov * Math.PI) / 180;
	const hFov = 2 * Math.atan(Math.tan(fovRad / 2) * camera.aspect);

	const distForWidth = (width * PADDING_HORIZONTAL) / (2 * Math.tan(hFov / 2));
	const distForHeight = (height * PADDING_VERTICAL) / (2 * Math.tan(fovRad / 2));

	return Math.max(MIN_DISTANCE, distForWidth, distForHeight);
};

/**
 * A generic camera controller that automatically adjusts distance and target 
 * to fit the provided dimensions in view. It smoothly animates between states.
 */
export const CameraAutoZoom: React.FC<CameraAutoZoomProps> = ({
	maxHeight,
	totalWidth,
	focusTarget, defaultPosition = new THREE.Vector3(0, 5, -30),
	preserveZSignOnUnfocus = false
}) => {
	const { camera, controls, gl, size } = useThree();
	const orbitControlsRef = useRef<OrbitControlsImpl>(null);

	const isAnimating = useRef(false);
	const targetDistance = useRef(MIN_DISTANCE);
	const targetLookAt = useRef(new THREE.Vector3(0, 0, 0));
	const direction = useRef(new THREE.Vector3());
	const currentTarget = useRef(new THREE.Vector3(0, 0, 0));
	const targetCameraPos = useRef(new THREE.Vector3(0, 0, 0));
	const useSpecificPosition = useRef(false);
	const wasFocused = useRef(false);

	// Cancel animation on user interaction (scroll, drag)
	const cancelAnimation = useCallback(() => {
		isAnimating.current = false;
	}, []);

	useEffect(() => {
		const canvas = gl.domElement;
		canvas.addEventListener("wheel", cancelAnimation, { passive: true });
		canvas.addEventListener("pointerdown", cancelAnimation, { passive: true });
		return () => {
			canvas.removeEventListener("wheel", cancelAnimation);
			canvas.removeEventListener("pointerdown", cancelAnimation);
		};
	}, [gl, cancelAnimation]);

	// Compute default auto distance based on total width/height
	const autoDistance = useMemo(() => {
		return calculateDistanceToFit(totalWidth, maxHeight, camera as THREE.PerspectiveCamera);
	}, [totalWidth, maxHeight, camera, size]);

	useEffect(() => {
		const perspCamera = camera as THREE.PerspectiveCamera;

		if (focusTarget && focusTarget.width > 0) {
			targetDistance.current = calculateDistanceToFit(focusTarget.width, maxHeight, perspCamera);
			targetLookAt.current.set(focusTarget.centerX, 0, 0);
			const zSign = focusTarget.zDirection !== undefined ? focusTarget.zDirection : -1;
			targetCameraPos.current.set(focusTarget.centerX, 0, zSign * targetDistance.current);
			useSpecificPosition.current = true;
			wasFocused.current = true;
		} else {
			targetDistance.current = autoDistance;
			targetLookAt.current.set(0, 0, 0);

			if (wasFocused.current) {
				const targetPos = defaultPosition.clone();
				if (preserveZSignOnUnfocus) {
					const currentZSign = camera.position.z >= 0 ? 1 : -1;
					const defaultZSign = targetPos.z >= 0 ? 1 : -1;
					if (currentZSign !== defaultZSign) {
						targetPos.z *= -1;
					}
				}
				targetCameraPos.current.copy(targetPos).normalize().multiplyScalar(targetDistance.current);
				useSpecificPosition.current = true;
				wasFocused.current = false;
			} else {
				useSpecificPosition.current = false;
			}
		}

		isAnimating.current = true;
	}, [autoDistance, focusTarget, maxHeight, camera, defaultPosition, preserveZSignOnUnfocus, size]);

	const maxDistance = Math.max(MIN_MAX_DISTANCE, autoDistance * MAX_DISTANCE_MULTIPLIER);
	const minDistance = Math.max(MIN_MIN_DISTANCE, autoDistance * MIN_DISTANCE_MULTIPLIER);

	useFrame((_, delta) => {
		if (!isAnimating.current) return;

		const orbitControls = orbitControlsRef.current || (controls as unknown as OrbitControlsImpl | null);

		if (orbitControls) {
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

		if (orbitControls) {
			orbitControls.update();
		}

		const distToPos = camera.position.distanceTo(desiredCameraPos);
		const distToTarget = currentTarget.current.distanceTo(targetLookAt.current);

		if (distToPos < ARRIVAL_THRESHOLD && distToTarget < ARRIVAL_THRESHOLD) {
			camera.position.copy(desiredCameraPos);
			if (orbitControls) {
				orbitControls.target.copy(targetLookAt.current);
				orbitControls.update();
			}
			isAnimating.current = false;
		}
	});

	return (
		<OrbitControls
			ref={orbitControlsRef}
			makeDefault
			maxPolarAngle={Math.PI / 2}
			maxDistance={maxDistance}
			minDistance={minDistance}
			dampingFactor={0.2}
		/>
	);
};