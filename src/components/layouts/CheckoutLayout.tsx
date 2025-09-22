import { Link, Navigate, Outlet } from "react-router-dom";
import { getMyCart } from "../../services/cart.service";
import { useEffect, useRef, useState } from "react";
import { Spin } from "antd";
import { useToast } from "../../context/ToastProvider";
import { formatCurrency } from "../../utils";

const CheckoutLayout = () => {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const toast = useToast();
  const isRunned = useRef(false);
  useEffect(() => {
    const fetchCart = async () => {
      try {
        const { data } = await getMyCart();
        const isError = data?.items?.find(
          (item: any) => item.size.isAvailable === false
        );
        if (isError) {
          setError(true);
        }
        setItems(data.items);
        if (data.items.length > 0) {
          localStorage.setItem("items", JSON.stringify(data.items));
        }
      } catch (error) {
        console.error("Lỗi khi lấy giỏ hàng:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchCart();
  }, []);
  if (loading) {
    return (
      <div className="h-[100dvh] w-[100dvw] flex justify-center items-center">
        <Spin size="large" />
      </div>
    );
  }

  if (!items || items.length === 0 || error) {
    if (!isRunned.current) {
      toast(
        "info",
        "Vui lòng kiểm tra lại giỏ hàng có sản phẩm đã hết hàng hoặc không khả dụng"
      );
    }
    isRunned.current = true;
    return <Navigate to="/cart" replace />;
  }
  isRunned.current = true;
  return (
    <main className="mx-6 max-w-7xl px-24 xl:mx-auto">
      <div className="grid grid-cols-[60%_50%]">
        <div className="py-11">
          <Link to={"/"} className="text-4xl font-semibold">
            MALE SNEAKER
          </Link>
          <div className="mt-8">
            <Outlet />
          </div>
        </div>
        <div className="min-h-[100vh] border-l-[1px] border-gray-300 px-11 py-11">
          {items && (
            <>
              <div className="flex flex-col gap-5">
                {items.map((item: any, index: number) => (
                  <div
                    key={`${item.size.value}${item.quantity}${index}`}
                    className="mb-3 flex items-center justify-between"
                  >
                    <div className="flex items-center gap-5">
                      <div className="relative w-16 rounded-md border border-[#717171] object-cover px-2">
                        <img
                          src={item.product.thumbnail}
                          alt="ảnh sản phẩm"
                          className="w-full"
                        />
                        <span className="absolute -top-3 -right-3 rounded-full bg-[#999999] px-2 text-white">
                          {item.quantity}
                        </span>
                      </div>
                      <div>
                        <h3 className="text-sm text-[#4b4b4b] uppercase">
                          {item.product.name}
                        </h3>
                        <p className="mt-2 text-xs text-[#969696]">
                          Size {item.size.value}
                        </p>
                      </div>
                    </div>
                    <div>
                      <div className="text-[14px] font-normal text-[#4b4b4b]">
                        {formatCurrency(item.product.price)}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              <div className="mt-2 border-t border-b border-gray-300 py-4">
                <div className="flex justify-between">
                  <span className="text-sm text-[#717171]">Tạm tính:</span>
                  <span className="text-[#4b4b4b]">
                    {formatCurrency(
                      items?.reduce(
                        (acc, curr: any) =>
                          acc + curr.product.price * curr.quantity,
                        0
                      )
                    )}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-[#717171]">Phí giao hàng:</span>
                  <span className="text-[#4b4b4b]">
                    {formatCurrency(30000)}
                  </span>
                </div>
              </div>
              <div className="flex justify-between py-4">
                <span className="text-base text-[#4b4b4b]">Tổng tiền:</span>
                <span className="flex items-center gap-2 text-2xl font-semibold text-[#4b4b4b]">
                  {formatCurrency(
                    items?.reduce(
                      (acc, curr: any) =>
                        acc + curr.product.price * curr.quantity,
                      0
                    ) + 30000
                  )}
                </span>
              </div>
            </>
          )}
        </div>
      </div>
    </main>
  );
};

export default CheckoutLayout;
