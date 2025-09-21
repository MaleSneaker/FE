import CheckoutLayout from "../components/layouts/CheckoutLayout";
import ShippingPage from "../pages/checkout/ShippingPage";

const CheckoutRoutes = [
  {
    path: "/checkout",
    element: <CheckoutLayout />,
    children: [
      {
        path: "shipping",
        element: <ShippingPage />,
      },
    ],
  },
];

export default CheckoutRoutes;
