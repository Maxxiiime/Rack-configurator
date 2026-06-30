import ErrorBoundary from "@/components/ErrorBoundary";
import ThreeCanvas from "@/features/ThreeCanvas";
import { ProductProvider } from "@/products";
import { Flex } from "@chakra-ui/react";

/**
 * Configurator page — wraps the 3D canvas + side-panel inside a
 * `<ProductProvider>` that resolves the active product from the URL.
 *
 * Route: /configurator/:productId
 */
const Configurator = () => {
	return (
		<ProductProvider>
			<ErrorBoundary>
				<Flex align="center" overflow="hidden">
					<ThreeCanvas />
				</Flex>
			</ErrorBoundary>
		</ProductProvider>
	);
};

export default Configurator;
