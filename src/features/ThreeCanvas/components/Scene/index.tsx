import { OrbitControls, Stage } from "@react-three/drei";
import { RackSystem } from "../RackSystem";

const Scene = () => {
    return (
        <>
            <Stage environment={{ files: "/hdri/potsdamer_platz_1k.hdr" }}>
                <RackSystem />
            </Stage>
            <OrbitControls makeDefault />
        </>
    );
};

export default Scene;
