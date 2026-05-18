import React from "react";
import { ChakraProvider } from "@chakra-ui/react";
import ReactDOM from "react-dom/client";
import App from "./App";
import theme from "./theme";
import { ThemeProvider } from "@emotion/react";

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
	<React.StrictMode>
		<ChakraProvider theme={theme}>
			<ThemeProvider theme={theme}>
				<App />
			</ThemeProvider>
		</ChakraProvider>
	</React.StrictMode>
);
