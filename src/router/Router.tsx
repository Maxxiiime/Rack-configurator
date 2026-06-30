import { createBrowserRouter, Navigate, RouterProvider } from "react-router-dom";
import Configurator from "./pages/Configurator";

const Router = () => {
	const router = createBrowserRouter([
		{
			/**
			 * TODO: Temporary redirec later "/" will be a product selector
			 */
			path: "/",
			element: <Navigate to="/configurator/cantilever" replace />,
		},
		{
			path: "/configurator/:productId",
			element: <Configurator />,
		},
		{
			path: "/configurator",
			element: <Navigate to="/configurator/cantilever" replace />,
		},
	]);

	return <RouterProvider router={router} />;
};

export default Router;
