import { useRef } from "react";
import { OrbitControls, Stage } from "@react-three/drei";
import { useActiveProduct } from "@/products";
import { useCameraDistance } from "@/hooks/useCameraDistance";
import FloorLogo from "./FloorLogo";
import type { Group } from "three";

const MIN_MAX_DISTANCE = 30;
const MAX_DISTANCE_MULTIPLIER = 1.2;
const MIN_MIN_DISTANCE = 10;
const MIN_DISTANCE_MULTIPLIER = 0.4;

const Scene = () => {
    const activeProduct = useActiveProduct();
    const Renderer = activeProduct.Renderer;
    const sceneRef = useRef<Group>(null);
    const { autoDistance } = useCameraDistance(sceneRef);

    const maxDistance = Math.max(MIN_MAX_DISTANCE, autoDistance * MAX_DISTANCE_MULTIPLIER);
    const minDistance = Math.max(MIN_MIN_DISTANCE, autoDistance * MIN_DISTANCE_MULTIPLIER);

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
                    offset: activeProduct.shadowOffset ?? 0,
                }}
            >
                <group ref={sceneRef}>
                    <Renderer />
                </group>
            </Stage>
            <FloorLogo />

            <OrbitControls
                makeDefault
                maxPolarAngle={Math.PI / 2}
                maxDistance={maxDistance}
                minDistance={minDistance}
                dampingFactor={0.2}
            />
        </>
    );
};

export default Scene;
