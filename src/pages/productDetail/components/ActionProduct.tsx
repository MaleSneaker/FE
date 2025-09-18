import { useEffect, useState } from "react";
import type { IProduct } from "../../../types/product";
import { Button, InputNumber, Spin } from "antd";
import { useToast } from "../../../context/ToastProvider";
import { addToCart } from "../../../services/cart.service";
import { useCart } from "../../../context/CartContext";

const ActionProduct = ({ product }: { product: IProduct }) => {
  const [selectedSize, setSelectedSize] = useState<null | {
    stock: number;
    value: string;
  }>(null);
  const [quantity, setQuantity] = useState(1);
  const [loadingAddCart, setLoadingAddCart] = useState(false);
  const { setQuantity: setQuantityCart } = useCart();
  const toast = useToast();
  useEffect(() => {
    if (product) {
      const availableSize = product?.sizes?.find((item) => item.stock > 0);
      setSelectedSize(availableSize as { stock: number; value: string });
    }
  }, [product]);
  const isOutOfStock = product?.sizes?.every((item) => item.stock < 1);
  const handleAddToCart = async () => {
    if (loadingAddCart) return;
    setLoadingAddCart(true);
    try {
      const { data } = await addToCart({
        productId: product?._id as string,
        size: selectedSize?.value as string,
        quantity: quantity,
      });
      console.log(data);
      setQuantityCart(data.data.items.length);
      if (data.success) {
        setLoadingAddCart(false);
        toast("success", data.message);
      }
    } catch (error) {
      setLoadingAddCart(false);
      console.log(error);
    }
  };
  return (
    <div>
      {isOutOfStock ? (
        <div className="min-h-[10vh] flex items-center justify-center">
          <p className="text-red-500 text-center">Sản phẩm đã hết hàng</p>
        </div>
      ) : (
        <>
          <p className="text-lg font-medium">Kích cỡ:</p>
          <div className="mt-4 flex items-center gap-2">
            {product?.sizes?.map((item, index) => (
              <button
                key={index}
                disabled={item.stock === 0}
                onClick={() => {
                  setSelectedSize(item);
                  if (item.stock < quantity) {
                    setQuantity(item.stock);
                  }
                }}
                className={`relative cursor-pointer border-2 px-3 py-1 text-sm transition-all ${
                  selectedSize === item
                    ? "border-black bg-black text-white"
                    : "border-[#8f8f8f] bg-white text-black"
                }`}
              >
                <span className={`${item.stock === 0 && "text-[#8f8f8f]"}`}>
                  Size {item.value}
                </span>
                {item.stock === 0 && (
                  <div className="absolute top-[50%] left-[50%] h-[0.5px] w-full translate-x-[-50%] translate-y-[-50%] rotate-30 bg-[#8f8f8f]" />
                )}
                {selectedSize === item && (
                  <span className="absolute right-0 bottom-0 text-xs">✔</span>
                )}
              </button>
            ))}
          </div>
          {selectedSize && (
            <p className="text-gray-500 mt-2 text-sm">
              Còn lại {selectedSize.stock} sản phẩm
            </p>
          )}
        </>
      )}
      <div className="mt-4 inline-block">
        <a
          href="https://zalo.me/0842116855"
          target="_blank"
          className="cursor-pointer uppercase underline"
        >
          Tư vấn ngay qua zalo
        </a>
      </div>
      <div className="mt-4 flex items-center gap-5">
        <span className="text-sm font-semibold">Số lượng</span>
        {selectedSize && (
          <div className="antd-custom my-2 flex items-center gap-2">
            <Button
              className="h-full"
              disabled={quantity === 1 || isOutOfStock}
              onClick={() => {
                if (quantity > 1 && !isOutOfStock) {
                  setQuantity(quantity - 1);
                }
              }}
            >
              -
            </Button>
            <InputNumber
              min={1}
              defaultValue={1}
              max={selectedSize?.stock}
              value={quantity}
              onChange={(e) => {
                if ((e as number) > 0 && !isOutOfStock) {
                  setQuantity(e as number);
                }
              }}
              className="flex items-center"
              controls={false}
              disabled={isOutOfStock}
            />
            <Button
              onClick={() => {
                if (quantity < selectedSize?.stock && !isOutOfStock) {
                  setQuantity(quantity + 1);
                }
              }}
              className=""
              disabled={
                (selectedSize ? quantity === selectedSize.stock : true) ||
                isOutOfStock
              }
            >
              +
            </Button>
          </div>
        )}
      </div>
      <div className="mt-4 flex">
        {isOutOfStock ? (
          <button className="w-full cursor-not-allowed border-2 border-red-300 text-red-300 bg-white py-2 font-semibold">
            Sản phẩm đã hết hàng
          </button>
        ) : (
          <button
            onClick={handleAddToCart}
            className="w-full cursor-pointer border-2 border-black bg-white py-2 font-semibold text-black duration-300 hover:bg-black hover:text-white"
          >
            {loadingAddCart ? <Spin /> : "Thêm vào giỏ hàng"}
          </button>
        )}
      </div>
    </div>
  );
};

export default ActionProduct;
