import { createBrowserRouter, RouterProvider } from "react-router-dom";
import PublicRoutes from "./PublicRoutes";
import PrivateRoutes from "./PrivateRoutes";
import CheckoutRoutes from "./CheckoutRoutes";

const routes = createBrowserRouter([
  ...PublicRoutes,
  ...PrivateRoutes,
  ...CheckoutRoutes,
]);

export default function AppRoutes() {
  return <RouterProvider router={routes} />;
}
