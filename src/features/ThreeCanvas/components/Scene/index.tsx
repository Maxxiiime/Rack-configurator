import { OrbitControls, Stage } from "@react-three/drei";
import { useActiveProduct } from "@/products";
import FloorLogo from "./FloorLogo";


const Scene = () => {
    const activeProduct = useActiveProduct();
    const Renderer = activeProduct.Renderer;

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
                <Renderer />
            </Stage>
            <FloorLogo />

            <OrbitControls
                makeDefault
                maxPolarAngle={Math.PI / 2}
                maxDistance={100}
                minDistance={5}
                dampingFactor={0.2}
            />
        </>
    );
};

export default Scene;
