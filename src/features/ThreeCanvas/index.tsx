import { Box } from "@chakra-ui/react";
import { Canvas } from "@react-three/fiber";
import Scene from "./components/Scene";
import { Perf } from "r3f-webgpu-perf";
import Button from "@/components/Button";
import { useActiveProduct } from "@/products";
import { useAppStore } from "@/stores/appStore";
import Sidepanel from "../Sidepanel";

const SIDEPANEL_WIDTH = 400;

const ThreeCanvas = () => {
	const activeProduct = useActiveProduct();
	const useEditorStore = activeProduct.useEditorStore;

	const setShowDimensions = useEditorStore((s) => s.setShowDimensions);
	const showDimensions = useEditorStore((s) => s.showDimensions);
	const setShowWeightInfo = useEditorStore((s) => s.setShowWeightInfo);
	const showWeightInfo = useEditorStore((s) => s.showWeightInfo);
	const clearSelection = useEditorStore((s) => s.clearSelection);
	const sidePanelOpen = useAppStore((s) => s.sidePanelOpen);

	return (
		<Box w="100%" h="100vh" zIndex={0} position="relative">
			<Box
				position="absolute"
				top={0}
				left={0}
				w="100%"
				h="100%"
				transition="transform 0.25s ease"
				transform={sidePanelOpen ? `translateX(-${SIDEPANEL_WIDTH / 2}px)` : "translateX(0)"}
			>
				<Canvas
					camera={{ fov: 45, position: [0, 5, -30] }}
					onPointerMissed={() => {
						if (clearSelection) clearSelection();
					}}
				>
					<Scene />
					{import.meta.env.MODE === "development" && <Perf position="top-left" showVRAM />}
				</Canvas>
			</Box>
			{setShowDimensions && (
				<Button
					type="dimension"
					onClick={() => setShowDimensions(!showDimensions)}
				/>
			)}
			{setShowWeightInfo && (
				<Button
					type="weight"
					onClick={() => setShowWeightInfo(!showWeightInfo)}
				/>
			)}
			<Sidepanel width={SIDEPANEL_WIDTH} />
		</Box>
	);
};

export default ThreeCanvas;
