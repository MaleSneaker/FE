import type { TableProps } from "antd";
import ThumbnailImage from "./ThumbnailImage";
import { formatCurrency } from "../../../utils";
import RemoveCartItem from "./DeleteCartItem";
import CartQuantityItem from "./CartQuantityItem";

export const columns = (fetchCart: () => Promise<void>) => {
  return [
    {
      title: "",
      dataIndex: "thumbnail",
      key: "thumbnail",
      render: (_, record) => (
        <ThumbnailImage
          stock={record.stock}
          productId={record.product._id}
          thumbnail={record.product.thumbnail}
        />
      ),
    },
    {
      title: "Sản phẩm",
      dataIndex: "product",
      key: "product",
      render: (_, record) => {
        return !record.size.isAvailable ? (
          <div
            className={`flex ${
              record.stock === 0 ? "opacity-70" : "opacity-100"
            }`}
          >
            <div>
              <span className="block text-base font-medium">
                {record.product.name}
              </span>
              <div className="my-1 flex items-center gap-4">
                <span className="text-sm">
                  Kích cỡ:{" "}
                  <span className="font-medium">{record.size.value}</span>
                </span>
              </div>
              <span className="mt-1 block text-base font-medium">
                {formatCurrency(record.product.price)}
              </span>
            </div>
          </div>
        ) : (
          <div>
            <p className="text-red-500">Sản phẩm không khả dụng</p>
          </div>
        );
      },
    },
    {
      title: "Số lượng",
      dataIndex: "quantity",
      key: "quantity",
      render: (_, record) => (
        <CartQuantityItem
          fetchCart={fetchCart}
          productId={record.product._id}
          quantityValue={record.quantity}
          size={record.size.value}
          stock={
            record.product.sizes.find(
              (item: any) => item.value === record.size.value
            ).stock
          }
        />
      ),
    },
    {
      title: "Đơn giá",
      dataIndex: "quantity",
      key: "quantity",
      render: (_, record) =>
        record.stock === 0 ? (
          <span className="text-red-500">{formatCurrency(0)}</span>
        ) : (
          <span className="font-medium">
            {formatCurrency(record.product.price)}
          </span>
        ),
    },
    {
      title: "Tổng",
      dataIndex: "subTotal",
      key: "subTotal",
      render: (_, record) =>
        record.stock === 0 ? (
          <span className="text-red-500">{formatCurrency(0)}</span>
        ) : (
          <span className="font-medium">
            {formatCurrency(record.product.price * record.quantity)}
          </span>
        ),
    },

    {
      title: "",
      key: "action",
      width: "50px",
      render: (_, record) => (
        <RemoveCartItem item={record as any} fetchCart={fetchCart} />
      ),
    },
  ] as TableProps<any>["columns"];
};
