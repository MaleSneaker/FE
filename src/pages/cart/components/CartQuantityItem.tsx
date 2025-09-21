/* eslint-disable react-hooks/exhaustive-deps */
import { MinusOutlined, PlusOutlined } from "@ant-design/icons";
import { Button, ConfigProvider, InputNumber } from "antd";
import { useEffect, useMemo, useState } from "react";
import _ from "lodash";
import { updateQuantityCartItem } from "../../../services/cart.service";

type Props = {
  quantityValue: number;
  productId: string;
  stock: number;
  size: string;
  fetchCart: () => Promise<void>;
};

const CartQuantityItem = ({
  quantityValue,
  productId,
  stock,
  size,
  fetchCart,
}: Props) => {
  const [debouncedQuantity, setDebounceQuantity] = useState<number | null>(
    null
  );
  const [quantity, setQuantity] = useState(quantityValue);
  const [isDisable, setDisable] = useState(false);

  const handleDebouncedUpdateQuantity = useMemo(() => {
    return _.debounce(async (itemData) => {
      setDisable(true);
      try {
        await updateQuantityCartItem(itemData);
        await fetchCart();
        setDisable(false);
      } catch (error) {
        setDisable(false);
        console.log(error);
      }
    }, 600);
  }, []);

  const handleDecreaseQuantity = () => {
    const newQuantity = quantity - 1;

    setQuantity(newQuantity);
    setDebounceQuantity(newQuantity);
  };

  const handleIncreaseQuantity = () => {
    const newQuantity = quantity + 1;

    setQuantity(newQuantity);
    setDebounceQuantity(newQuantity);
  };

  useEffect(() => {
    if (debouncedQuantity) {
      handleDebouncedUpdateQuantity({
        productId,
        quantity: debouncedQuantity,
        size,
      });
    }
  }, [debouncedQuantity, handleDebouncedUpdateQuantity, productId]);

  useEffect(() => {
    if (quantityValue !== quantity) {
      setQuantity(quantityValue);
    }
  }, [quantityValue]);

  return stock === 0 ? (
    <div className="mt-2 flex items-center">
      <span className="font-medium text-red-500">Sản phẩm hết hàng</span>
    </div>
  ) : (
    <div className="mt-2 flex items-center">
      <Button
        type="default"
        disabled={quantity < 2 || isDisable}
        onClick={handleDecreaseQuantity}
        icon={
          <MinusOutlined className="transform transition duration-500 hover:rotate-180" />
        }
      />
      <ConfigProvider
        theme={{
          token: {
            colorBgContainerDisabled: "white",
            colorTextDisabled: "black",
          },
        }}
      >
        <InputNumber
          min={1}
          disabled={true}
          value={quantity}
          className="quantity--input"
        />
      </ConfigProvider>

      <Button
        type="default"
        onClick={handleIncreaseQuantity}
        disabled={quantity === stock || isDisable}
        icon={
          <PlusOutlined className="transform transition duration-500 hover:rotate-180" />
        }
      />
    </div>
  );
};

export default CartQuantityItem;
