import { OrbitControls, Stage } from "@react-three/drei";
import { RackSystem } from "../RackSystem";

const Scene = () => {
    return (
        <>
            <Stage
                environment={{ files: "/hdri/potsdamer_platz_1k.hdr" }}
                adjustCamera={false}
                intensity={1}
                shadows={{
                    type: 'contact',
                    scale: 300,
                    opacity: 1,
                    blur: 0.25,
                    resolution: 4096,
                }}
            >
                <RackSystem />
            </Stage>
            <OrbitControls makeDefault />
            <OrbitControls makeDefault />
        </>
    );
};

export default Scene;
