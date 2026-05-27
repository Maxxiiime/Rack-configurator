import { OrbitControls, Stage } from "@react-three/drei";
import { RackSystem } from "../RackSystem";

const Scene = () => {
    return (
        <>
            <Stage
                environment={{ files: "/hdri/potsdamer_platz_1k.hdr" }}
                adjustCamera={false}
                shadows={{
                    type: 'contact',
                    scale: 300,
                    opacity: 1,
                    blur: 0.25,
                    resolution: 1024,
                }}
            >
                <RackSystem />
            </Stage>
            <OrbitControls
                maxPolarAngle={Math.PI / 2}       

                minAzimuthAngle={4*Math.PI / 9}      
                maxAzimuthAngle={-4*Math.PI  / 9}
/>
        </>
    );
};

export default Scene;
