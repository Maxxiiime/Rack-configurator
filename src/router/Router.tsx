import { createBrowserRouter, Navigate, RouterProvider } from "react-router-dom";
import Home from "./pages/Home";
import Configurator from "./pages/Configurator";

const Router = () => {
	const router = createBrowserRouter([
		{
			path: "/",
			element: <Home />,
		},
		{
			path: "/configurator/:productId",
			element: <Configurator />,
		},
		{
			/* Temporary redirect — later "/" will be a product selector */
			path: "/configurator",
			element: <Navigate to="/configurator/cantilever" replace />,
		},
	]);

	return <RouterProvider router={router} />;
};

export default Router;
