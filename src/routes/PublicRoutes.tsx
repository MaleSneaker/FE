import ClientLayout from "../components/layouts/ClientLayout";
import AuthPage from "../pages/auth/AuthPage";
import CartDetail from "../pages/cart/CartDetail";
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
        path: "/product/:id",
        element: <ProductDetail />,
      },
      {
        path: "/cart",
        element: <CartDetail />,
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
