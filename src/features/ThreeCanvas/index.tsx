import { Box } from "@chakra-ui/react";
import { Canvas } from "@react-three/fiber";
import Scene from "./components/Scene";
import { Perf } from "r3f-webgpu-perf";
import Button from "@/components/Button";
import { useRackStore } from "@/stores/rackStore";
import RackControls from "@/features/RackControls";

const ThreeCanvas = () => {
	const setShowDimensions = useRackStore((s) => s.setShowDimensions);
	const showDimensions = useRackStore((s) => s.showDimensions);

	return (
		<Box w="100%" h="100vh" zIndex={0}>
			<Canvas camera={{ fov: 45, position: [0, 5, -30] }}>
				<Scene />
				{import.meta.env.MODE === "development" && <Perf position="top-left" showVRAM />}
			</Canvas>
			<Button
				type="dimension"
				onClick={() => setShowDimensions(!showDimensions)}
			/>
			<RackControls />
		</Box>
	);
};

export default ThreeCanvas;
