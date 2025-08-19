import {
  DatabaseOutlined,
  LineChartOutlined,
  ProductOutlined,
  ProfileOutlined,
  ShoppingOutlined,
} from "@ant-design/icons";
import type { JSX } from "react";

export type IChildrenItem = {
  label: string;
  route: string;
};

export type IMenuItem = {
  icon: JSX.Element;
  label: string;
  route?: string;
  children?: IChildrenItem[];
};

export const menuGroups: IMenuItem[] = [
  {
    icon: <LineChartOutlined />,
    label: "Thống kê",
    route: "/admin",
  },
  {
    icon: <ProfileOutlined />,
    label: "Quản lý đơn hàng",
    route: "/admin/orders",
  },
  {
    icon: <ProductOutlined />,
    label: "Quản lý danh mục",
    children: [
      { label: "Tất cả danh mục", route: "/admin/categories" },
      { label: "Tạo mới danh mục", route: "/admin/categories/create" },
    ],
  },
  {
    icon: <DatabaseOutlined />,
    label: "Quản lý thương hiệu",
    children: [
      { label: "Tất cả thương hiệu", route: "/admin/brands" },
      { label: "Tạo mới thương hiệu", route: "/admin/brands/create" },
    ],
  },
  {
    icon: <ShoppingOutlined />,
    label: "Quản lý sản phẩm",
    children: [
      { label: "Tất cả sản phẩm", route: "/admin/products" },
      { label: "Tạo mới sản phẩm", route: "/admin/products/create" },
    ],
  },
];
