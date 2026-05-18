import { Button, Code, Flex, Heading } from "@chakra-ui/react";
import { Component, ErrorInfo, ReactNode } from "react";

interface ErrorBoundaryState {
	hasError: boolean;
	error: Error | null;
	errorInfo: ErrorInfo | null;
}

class ErrorBoundary extends Component<{ children: ReactNode }, ErrorBoundaryState> {
	constructor(props: { children: ReactNode }) {
		super(props);
		this.state = { hasError: false, error: null, errorInfo: null };
	}

	static getDerivedStateFromError(error: Error) {
		console.log(error);
		return { hasError: true, error };
	}

	componentDidCatch(error: Error, errorInfo: ErrorInfo) {
		this.setState({
			error: error,
			errorInfo: errorInfo,
		});
	}

	render() {
		if (this.state.hasError) {
			return (
				<Flex align="center" justify="center" flexDir="column" gap="1rem" h="100vh">
					<Heading as="h2" size="xl">
						Oops, there was an error!
					</Heading>
					<Button onClick={() => this.setState({ hasError: false })}>Try again</Button>
					{import.meta.env.MODE === "development" && (
						<Code colorScheme="red" p="1rem" m="3rem" mt="1rem" maxH="80vh" overflow="auto">
							{this.state.error && this.state.error.toString()}
							<br />
							<br />
							{this.state.errorInfo?.componentStack}
						</Code>
					)}
				</Flex>
			);
		}

		return this.props.children;
	}
}

export default ErrorBoundary;
