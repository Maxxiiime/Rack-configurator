import ErrorBoundary from "@/components/ErrorBoundary";
import ThreeCanvas from "@/features/ThreeCanvas";
import { Flex } from "@chakra-ui/react";

const Home = () => {
	return (
		<ErrorBoundary>
			<Flex align="center" overflow="hidden">
				<ThreeCanvas />
			</Flex>
		</ErrorBoundary>
	);
};

export default Home;
