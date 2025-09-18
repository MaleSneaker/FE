import { DeleteOutlined } from "@ant-design/icons";
import { Popconfirm } from "antd";
import { removeCart } from "../../../services/cart.service";
import { useToast } from "../../../context/ToastProvider";

const RemoveCartItem = ({
  item,
  fetchCart,
}: {
  item: any;
  fetchCart: () => Promise<void>;
}) => {
  const toast = useToast();
  const handleRemove = async () => {
    const payload = {
      productId: item.product._id,
      size: item.size.value,
    };
    try {
      const data = await removeCart(payload);
      console.log(data);
      toast("success", data.data.message);
      fetchCart();
    } catch (error) {
      console.log(error);
    }
  };
  return (
    <>
      <Popconfirm
        title="Xóa sản phẩm"
        placement="topLeft"
        description="Bạn có muốn xóa sản phẩm này khỏi giỏ hàng không?"
        okText="Đồng ý"
        onConfirm={handleRemove}
        cancelText="Hủy"
      >
        <DeleteOutlined
          color="#fff"
          className="cursor-pointer rounded-full p-1 text-base text-white"
        />
      </Popconfirm>
    </>
  );
};

export default RemoveCartItem;
