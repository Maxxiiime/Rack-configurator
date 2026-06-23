import { useTexture } from "@react-three/drei";
import { DoubleSide } from "three";

const LOGO_WIDTH = 20;
const LOGO_HEIGHT = LOGO_WIDTH / 4;

const FloorLogo = () => {
    const texture = useTexture("/images/logo.webp");

    return (
        <mesh
            rotation={[-Math.PI / 2, 0, Math.PI]}
            position={[0, -10, -10]}
        >
            <planeGeometry args={[LOGO_WIDTH, LOGO_HEIGHT]} />
            <meshBasicMaterial
                map={texture}
                transparent
                opacity={0.6}
                side={DoubleSide}
                depthWrite={false}
            />
        </mesh>
    );
};

export default FloorLogo;
