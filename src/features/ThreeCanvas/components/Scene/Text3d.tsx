import { Center, GradientTexture, Text3D } from "@react-three/drei";
import { Suspense } from "react";
import use3dText from "@/hooks/use3dText";
import { useTheme } from "@chakra-ui/react";

const Text3d = () => {
	const { text } = use3dText();
	const { colors } = useTheme();

	return (
		<Suspense>
			<Center>
				<Text3D letterSpacing={-0.025} font="/fonts/Inter_Bold.json">
					{text}
					<meshStandardMaterial roughness={0}>
						<GradientTexture stops={[0, 1]} colors={[colors.primary[500], colors.secondary[500]]} size={1024} />
					</meshStandardMaterial>
				</Text3D>
			</Center>
		</Suspense>
	);
};

export default Text3d;
