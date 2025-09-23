import { Breadcrumb, Radio, Spin } from "antd";
import { Link, useNavigate } from "react-router-dom";
import codImg from "../../assets/cash.jpg";
import { formatCurrency } from "../../utils";
import { useState } from "react";
import { useGetCheckout } from "../../hooks/useGetCheckout";
import { createOrder } from "../../services/order.service";
import { useToast } from "../../context/ToastProvider";
const PaymentMethod = () => {
  const [paymentMethod, setPaymentMethod] = useState("cod");
  const [loading, setLoading] = useState(false);
  const payload = useGetCheckout();
  const navigate = useNavigate();
  const toast = useToast();
  const handleCheckout = async () => {
    setLoading(true);
    try {
      await createOrder(payload);
      setLoading(false);
      navigate("/success");
    } catch (error: any) {
      setLoading(false);
      toast("error", `Đặt hàng thất bại: ${error.response.data.message}`);
    }
  };
  return (
    <div>
      {/* BREADCRUMB */}
      <div className="flex items-center gap-2 text-xs">
        <Breadcrumb
          items={[
            {
              title: <Link to={"/cart"}>Giỏ hàng</Link>,
            },
            {
              title: (
                <Link to={"/checkout/shipping"}>Thông tin vận chuyển</Link>
              ),
            },
            {
              title: "Phương thức thanh toán",
            },
          ]}
        />
      </div>
      <h3 className="my-4 text-lg font-semibold text-[#333333] uppercase">
        Phương thức vận chuyển
      </h3>
      <div className="mt-2 mb-12 pr-24">
        <div className="flex cursor-pointer items-center justify-between rounded-md border border-gray-300 px-6 py-4">
          <div className="flex items-center gap-2">
            <Radio checked></Radio>
            <span className="text-sm text-[#737373]">Giao hàng tận nơi</span>
          </div>
          <span className="text-sm">{formatCurrency(30000)}</span>
        </div>
      </div>
      <h3 className="my-4 text-lg font-semibold text-[#333333] uppercase">
        Phương thức thanh toán
      </h3>
      <div className="mt-2 pr-24">
        <Radio.Group value={paymentMethod} className="w-full">
          <div
            onClick={() => setPaymentMethod("cod")}
            className="flex cursor-pointer items-center gap-5 rounded-t-md border border-gray-300 px-6 py-4"
          >
            <Radio value={"cod"}></Radio>
            <div className="flex items-center gap-2">
              <img src={codImg} className="w-16" alt="" />
              <span className="text-sm text-[#737373]">
                Thanh toán khi nhận hàng (COD)
              </span>
            </div>
          </div>
          <div
            onClick={() => setPaymentMethod("vnpay")}
            className="flex cursor-pointer items-center gap-5 rounded-b-md border-r border-b border-l border-gray-300 px-6 py-4"
          >
            <Radio value={"vnpay"}></Radio>
            <div className="flex items-center gap-2">
              <img
                src={
                  "https://yt3.googleusercontent.com/JM1m2wng0JQUgSg9ZSEvz7G4Rwo7pYb4QBYip4PAhvGRyf1D_YTbL2DdDjOy0qOXssJPdz2r7Q=s900-c-k-c0x00ffffff-no-rj"
                }
                className="w-16"
                alt=""
              />
              <span className="text-sm text-[#737373]">
                Thanh toán online VNPay
              </span>
            </div>
          </div>
        </Radio.Group>
      </div>
      <div className="mt-8 flex ">
        <button
          disabled={loading}
          onClick={handleCheckout}
          type="submit"
          className="flex cursor-pointer items-center min-w-[150px] justify-center rounded-md bg-[#338dbc] px-4 py-4 text-xs font-medium text-white uppercase duration-300 hover:bg-cyan-500"
        >
          {loading ? <Spin /> : "Xác nhận đặt hàng"}
        </button>
      </div>
    </div>
  );
};

export default PaymentMethod;
