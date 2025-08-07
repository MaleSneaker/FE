import ClientLayout from "../components/layouts/ClientLayout";
import AuthPage from "../pages/auth/AuthPage";
import HomePage from "../pages/home/HomePage";
import ProductDetail from "../pages/productDetail/ProductDetail";

const PublicRoutes = [
  {
    path: "/",
    element: <ClientLayout />,
    children: [
      {
        path: "",
        element: <HomePage />,
      },
      {
        path: "productDetail",
        element: <ProductDetail />,
      },

      {
        path: "/login",
        element: <AuthPage />,
      },
      {
        path: "/register",
        element: <AuthPage />,
      },
    ],
  },
];

export default PublicRoutes;
