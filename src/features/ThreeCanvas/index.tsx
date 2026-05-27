import { Box } from "@chakra-ui/react";
import { Canvas } from "@react-three/fiber";
import Scene from "./components/Scene";
import { Perf } from "r3f-perf";

const ThreeCanvas = () => {
	return (
		<Box w="100%" h="100vh" zIndex={0}>
			<Canvas camera={{ fov: 45, position: [0, 5, -30] }}>
				<Scene />
				{import.meta.env.MODE === "development" && <Perf position="top-left" overClock />}
			</Canvas>
		</Box>
	);
};

export default ThreeCanvas;
