import PrivateLayout from "../components/layouts/PrivateLayout";
import ProtectedPrivate from "../context/private/ProtectedPrivate";
import CreateCategory from "../pages/admins/categories/create/CreateCategory";
import ListCategory from "../pages/admins/categories/ListCategory";
import UpdateCategory from "../pages/admins/categories/update/UpdateCategory";
import Dashboard from "../pages/admins/dashboard/DashBoard";

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
    ],
  },
];

export default PrivateRoutes;
