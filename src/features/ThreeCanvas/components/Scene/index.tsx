import { OrbitControls, Stage } from "@react-three/drei";
import { RackSystem } from "../RackSystem";
import CameraAutoZoom from "./CameraAutoZoom";
import FloorLogo from "./FloorLogo";
import { useCameraDistance } from "@/hooks/useCameraDistance";
import offsets from '@/data/shelving_offset.json';


const MIN_MAX_DISTANCE = 50;
const MAX_DISTANCE_MULTIPLIER = 1.4;
const MIN_MIN_DISTANCE = 10;
const MIN_DISTANCE_MULTIPLIER = 0.4;

const Scene = () => {
    const { autoDistance } = useCameraDistance();

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
                    offset: -offsets.bottom_bolt.y
                }}
            >
                <RackSystem />
            </Stage>
            <FloorLogo />


            <OrbitControls
                maxPolarAngle={Math.PI / 2}
                maxDistance={maxDistance}
                minDistance={minDistance}
                dampingFactor={0.2}
            />

            <CameraAutoZoom />
        </>
    );
};

export default Scene;
