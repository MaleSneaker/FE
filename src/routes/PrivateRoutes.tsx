import PrivateLayout from "../components/layouts/PrivateLayout";
import ProtectedPrivate from "../context/private/ProtectedPrivate";
import CreateBrand from "../pages/admins/brands/create/CreateBrand";
import ListBrands from "../pages/admins/brands/ListBrands";
import UpdateBrands from "../pages/admins/brands/update/UpdateBrand";
import CreateCategory from "../pages/admins/categories/create/CreateCategory";
import ListCategory from "../pages/admins/categories/ListCategory";
import UpdateCategory from "../pages/admins/categories/update/UpdateCategory";
import Dashboard from "../pages/admins/dashboard/DashBoard";
import ListProduct from "../pages/admins/product/ListProduct";

const PrivateRoutes = [
  {
    path: "/admin",
    element: (
      <ProtectedPrivate>
        <PrivateLayout />
      </ProtectedPrivate>
    ),

    children: [
      {
        path: "",
        element: <Dashboard />,
      },
      {
        path: "/admin/categories",
        element: <ListCategory />,
      },
      {
        path: "/admin/categories/create",
        element: <CreateCategory />,
      },
      {
        path: "/admin/categories/edit/:id",
        element: <UpdateCategory />,
      },
      {
        path: "/admin/brands",
        element: <ListBrands />,
      },
      {
        path: "/admin/brands/create",
        element: <CreateBrand />,
      },
      {
        path: "/admin/brands/edit/:id",
        element: <UpdateBrands />,
      },
      {
        path: "/admin/products",
        element: <ListProduct />,
      },
    ],
  },
];

export default PrivateRoutes;
