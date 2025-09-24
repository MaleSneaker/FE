import ClientLayout from "../components/layouts/ClientLayout";
import AuthPage from "../pages/auth/AuthPage";
import CartDetail from "../pages/cart/CartDetail";
import HomePage from "../pages/home/HomePage";
import ProductDetail from "../pages/productDetail/ProductDetail";
import Profile from "../pages/profile/Profile";
import MyOrders from "../pages/profile/MyOrders";
import UserOrderDetail from "../pages/profile/UserOrderDetail";
import ProductsPage from "../pages/products/ProductsPage";
import OrderSuccess from "../pages/checkout/OrderSuccess";

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
        path: "/product",
        element: <ProductsPage />,
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
        path: "/profile",
        element: <Profile />,
      },
      {
        path: "/profile/my-orders",
        element: <MyOrders />,
      },
      {
        path: "/orders/:id",
        element: <UserOrderDetail />,
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
  {
    path: "success",
    element: <OrderSuccess />,
  },
];

export default PublicRoutes;
