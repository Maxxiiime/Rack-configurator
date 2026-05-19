import { OrbitControls, Stage } from "@react-three/drei";


const Scene = () => {
	return (
		<>
			<Stage environment={{ files: "/hdri/potsdamer_platz_1k.hdr" }}>

			</Stage>
			<OrbitControls />
		</>
	);
};

export default Scene;
