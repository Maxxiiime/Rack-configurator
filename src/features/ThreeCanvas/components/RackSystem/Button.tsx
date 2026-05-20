import React from "react";
import { useGLTF } from "@react-three/drei";

useGLTF.preload("/model/plus.glb");
useGLTF.preload("/model/less.glb");

interface ButtonProps {
	type: "plus" | "less";
	position: [number, number, number];
	onClick: () => void;
}

export const Button: React.FC<ButtonProps> = ({ type, position, onClick }) => {
	const modelPath = type === "plus" ? "/model/plus.glb" : "/model/less.glb";
	const { scene } = useGLTF(modelPath);

	const clonedScene = React.useMemo(() => {
		const clone = scene.clone();
		const targetColor = type === "plus" ? "#16C700" : "#C70000";

		clone.traverse((child: any) => {
			if (child.isMesh) {
				if (Array.isArray(child.material)) {
					child.material = child.material.map((m: any) => {
						const clonedMat = m.clone();
						if (clonedMat.color) {
							clonedMat.color.set(targetColor);
						}
						return clonedMat;
					});
				} else if (child.material) {
					const clonedMat = child.material.clone();
					if (clonedMat.color) {
						clonedMat.color.set(targetColor);
					}
					child.material = clonedMat;
				}
			}
		});
		return clone;
	}, [scene, type]);

	const [hovered, setHovered] = React.useState(false);

	const scale = hovered ? 17.0 : 15.0;

	return (
		<primitive
			object={clonedScene}
			position={position}
			scale={[scale, scale, scale]}
			onClick={(e: any) => {
				e.stopPropagation();
				onClick();
			}}
			onPointerOver={(e: any) => {
				e.stopPropagation();
				setHovered(true);
			}}
			onPointerOut={(e: any) => {
				e.stopPropagation();
				setHovered(false);
			}}
		/>
	);
};
export default Button;
