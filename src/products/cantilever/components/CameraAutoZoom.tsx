import { useFrame, useThree } from "@react-three/fiber";
import { useEffect, useRef } from "react";
import { useCameraDistance } from "../hooks/useCameraDistance";
import { useEditorStore } from "../stores/editorStore";
import { useRackSectionsStore } from "../stores/sectionsStore";
import { useRackPositions } from "../hooks/useRackPositions";
import * as THREE from "three";

const MIN_DISTANCE = 30;
const LERP_SPEED = 10;
const ARRIVAL_THRESHOLD = 0.05;
const PADDING_HORIZONTAL = 1.6;
const PADDING_VERTICAL = 1.8;

/**
 * Automatically adjusts camera distance and target to fit the entire rack system in view.
 * When a specific rack is selected, it focuses the camera on that rack.
 */
const CameraAutoZoom = () => {
	const { camera, controls } = useThree();
	const { autoDistance, maxHeight } = useCameraDistance();

	const selectedRackId = useEditorStore((s: any) => s.selectedRackId);
	const selectedArm = useEditorStore((s: any) => s.selectedArm);
	const rackIds = useRackSectionsStore((s: any) => s.rackIds);
	const { columnPositionsX, rackWidths, centerX } = useRackPositions();

	const isAnimating = useRef(false);
	const targetDistance = useRef(MIN_DISTANCE);
	const targetLookAt = useRef(new THREE.Vector3(0, 0, 0));
	const direction = useRef(new THREE.Vector3());
	const currentTarget = useRef(new THREE.Vector3(0, 0, 0));
	const targetCameraPos = useRef(new THREE.Vector3(0, 0, 0));
	const useSpecificPosition = useRef(false);

	const wasFocused = useRef(false);

	// Trigger animation when a rack is selected
	useEffect(() => {
		let focusWidth = 0;
		let focusCenterX = 0;
		let hasFocus = false;

		if (selectedRackId) {
			const index = rackIds.indexOf(selectedRackId);
			if (index !== -1) {
				const leftCol = columnPositionsX[index];
				const rightCol = columnPositionsX[index + 1];
				focusCenterX = (leftCol + rightCol) / 2 - centerX;
				focusWidth = rackWidths[index];
				hasFocus = true;
			}
		} else if (selectedArm && selectedArm.columnIndex !== undefined) {
			const colX = columnPositionsX[selectedArm.columnIndex];
			focusCenterX = colX - centerX;
			const rackIndex = Math.min(selectedArm.columnIndex, rackWidths.length - 1);
			focusWidth = rackWidths[rackIndex];
			hasFocus = true;
		}

		if (hasFocus && focusWidth > 0) {
			// Calculate distance for this single rack/column
			const perspCamera = camera as THREE.PerspectiveCamera;
			const fovRad = (perspCamera.fov * Math.PI) / 180;
			const aspect = perspCamera.aspect;
			const hFov = 2 * Math.atan(Math.tan(fovRad / 2) * aspect);

			const distForWidth = (focusWidth * PADDING_HORIZONTAL) / (2 * Math.tan(hFov / 2));
			const distForHeight = (maxHeight * PADDING_VERTICAL) / (2 * Math.tan(fovRad / 2));

			targetDistance.current = Math.max(MIN_DISTANCE, Math.max(distForWidth, distForHeight));
			targetLookAt.current.set(focusCenterX, 0, 0);
			targetCameraPos.current.set(focusCenterX, 0, -targetDistance.current);
			useSpecificPosition.current = true;
			wasFocused.current = true;
		} else {
			targetDistance.current = Math.max(MIN_DISTANCE, autoDistance);
			targetLookAt.current.set(0, 0, 0);

			if (wasFocused.current) {
				targetCameraPos.current.set(0, 5, -30).normalize().multiplyScalar(targetDistance.current);
				useSpecificPosition.current = true;
				wasFocused.current = false;
			} else {
				useSpecificPosition.current = false;
			}
		}

		isAnimating.current = true;
	}, [autoDistance, selectedRackId, selectedArm, rackIds, columnPositionsX, rackWidths, centerX, maxHeight, camera]);

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

		// Stop animating once close enough (check both position and target)
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

export default CameraAutoZoom;
