import { useRef } from "react";
import { Stage } from "@react-three/drei";
import { useActiveProduct } from "@/products";
import FloorLogo from "./FloorLogo";
import type { Group } from "three";

const Scene = () => {
    const activeProduct = useActiveProduct();
    const Renderer = activeProduct.Renderer;
    const sceneRef = useRef<Group>(null);

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

        </>
    );
};

export default Scene;
