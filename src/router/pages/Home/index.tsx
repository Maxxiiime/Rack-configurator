import ErrorBoundary from "@/components/ErrorBoundary";
import Sidepanel from "@/features/Sidepanel";
import ThreeCanvas from "@/features/ThreeCanvas";
import { Flex } from "@chakra-ui/react";

const Home = () => {
	return (
		<ErrorBoundary>
			<Flex align="center" overflow="hidden">
				<ThreeCanvas />
				<Sidepanel width={350} />
			</Flex>
		</ErrorBoundary>
	);
};

export default Home;
