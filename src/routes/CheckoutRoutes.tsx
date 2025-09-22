import CheckoutLayout from "../components/layouts/CheckoutLayout";
import PaymentMethod from "../pages/checkout/PaymentMethod";
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
      {
        path: "payment",
        element: <PaymentMethod />,
      },
    ],
  },
];

export default CheckoutRoutes;
