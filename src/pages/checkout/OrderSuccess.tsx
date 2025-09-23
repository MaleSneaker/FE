import { CheckCircleOutlined } from "@ant-design/icons";
import { Watermark } from "antd";
import { Link } from "react-router-dom";

const OrderSuccess = () => {
  return (
    <Watermark content={"MALE SNEAKER"}>
      <div className="flex min-h-screen flex-col items-center justify-center bg-gray-100 p-6">
        <CheckCircleOutlined className="mb-4 text-5xl text-green-500" />
        <div className="text-center text-3xl text-green-600">
          Đặt hàng thành công!
        </div>
        <div className="flex items-center gap-2">
          <Link to="/">
            <button className="mt-4 w-full cursor-pointer rounded-md border border-black px-4 py-2 text-black duration-300 hover:bg-black hover:text-white">
              Về trang chủ
            </button>
          </Link>
        </div>
      </div>
    </Watermark>
  );
};

export default OrderSuccess;
