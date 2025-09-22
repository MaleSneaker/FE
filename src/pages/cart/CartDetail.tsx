import { Form, Table } from "antd";
import TextArea from "antd/es/input/TextArea";
import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useCart } from "../../context/CartContext";
import { useToast } from "../../context/ToastProvider";
import { getMyCart } from "../../services/cart.service";
import { formatCurrency } from "../../utils";
import { columns } from "./components/CartDetailColumn";

const CartDetail = () => {
  const [data, setData] = useState([]);
  const [description, setDescription] = useState("");
  const navigate = useNavigate();
  const toast = useToast();
  const { setQuantity } = useCart();
  const fetchCart = async () => {
    try {
      const { data } = await getMyCart();
      setData(data.items);
      setQuantity(data.items.length);
    } catch (error) {
      toast("info", "Có lỗi xảy ra vui lòng thử lại");
      navigate("/");
    }
  };
  useEffect(() => {
    fetchCart();
  }, []);
  const handleCheckout = async () => {
    localStorage.setItem("note", description);
    navigate("/checkout/shipping");
  };
  return (
    <div className="m-auto mt-8 w-full max-w-7xl bg-white px-2">
      <div className="">
        <div className="">
          <div className="w-full">
            <Table
              rowKey="productId"
              columns={columns(fetchCart)}
              dataSource={data}
              pagination={false}
              size="small"
              scroll={{
                x: "max-content",
              }}
            />
          </div>
          <div className="rounded p-3">
            {/* <span className='text-xl font-medium'>Hóa đơn</span> */}
            <div className="mt-5 grid grid-cols-2 gap-8">
              <Form name="basic" autoComplete="off" layout="vertical">
                <Form.Item
                  label="Chú thích"
                  initialValue={""}
                  name="description"
                >
                  <TextArea
                    onChange={(e) => setDescription(e.target.value)}
                    rows={4}
                    placeholder="Chú thích..."
                    maxLength={255}
                  />
                </Form.Item>
              </Form>

              <div className="mr-10 flex justify-end">
                {data && data.length > 0 && (
                  <span className="block text-xl font-semibold">
                    <span className="text-sm font-medium">Tổng:</span>{" "}
                    {formatCurrency(
                      data?.reduce((acc, curr: any) => {
                        return acc + curr.product.price * curr.quantity;
                      }, 0)
                    )}
                  </span>
                )}
                <div className="flex items-center justify-center gap-4">
                  {data.length > 0 && (
                    <button
                      onClick={handleCheckout}
                      className="mt-5 cursor-pointer rounded-full border-[1px] border-black bg-black px-8 py-2 font-bold text-white duration-300 hover:bg-black/80"
                    >
                      Thanh toán
                    </button>
                  )}
                  {data.length === 0 && (
                    <Link
                      className="mt-5 cursor-pointer rounded-full border-[1px] border-black bg-black px-8 py-2 font-bold text-white duration-300 hover:bg-black/80"
                      to={"/"}
                    >
                      Bạn chưa có sản phẩm nào. Tiếp tục mua hàng?
                    </Link>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CartDetail;
