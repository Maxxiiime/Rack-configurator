import { OrbitControls, Stage } from "@react-three/drei";
import InfoCard from "./InfoCard";
import Text3d from "./Text3d";

const Scene = () => {
	return (
		<>
			<Stage environment={{ files: "/hdri/potsdamer_platz_1k.hdr" }}>
				<Text3d />
				<InfoCard />
			</Stage>
			<OrbitControls />
		</>
	);
};

export default Scene;
