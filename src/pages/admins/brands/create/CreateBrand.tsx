import { Button, Form, Input } from "antd";
import TextArea from "antd/es/input/TextArea";
import { Link, useNavigate } from "react-router-dom";
import { useToast } from "../../../../context/ToastProvider";
import type { IBrand } from "../../../../types/brand";
import { createBrand } from "../../../../services/brand.service";

const CreateBrand = () => {
  const toast = useToast();
  const nav = useNavigate();
  const handleCancel = () => {
    nav("/admin/brands");
  };

  const onFinish = async (
    values: Omit<IBrand, "_id" | "createdAt" | "updatedAt">
  ) => {
    try {
      await createBrand(values);
      toast("success", "Thêm thương hiệu thành công");
      nav("/admin/brands");
    } catch (error: any) {
      if (!error?.response?.data?.success) {
        toast("info", error?.response?.data?.message);
      }
    }
  };
  return (
    <div className="py-4 mt-4 shadow-lg px-4 rounded-lg w-full ">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-semibold">Tạo mới thương hiệu</h3>
        <Link to={"/admin/brands"} className="text-sm text-blue-500">
          &lt; Quay trở về danh sách
        </Link>
      </div>
      <div className="mt-6">
        <Form
          name="basic"
          layout="vertical"
          onFinish={onFinish}
          autoComplete="off"
        >
          <Form.Item
            label="Tên thương hiệu"
            name="name"
            rules={[
              { required: true, message: "Vui lòng nhập tên thương hiệu" },
              { min: 3, message: "Tên thương hiệu phải có tối thiểu 3 ký tự" },
              {
                max: 50,
                message: "Tên thương hiệu chỉ được nhập tối đa 50 ký tự",
              },
            ]}
          >
            <Input
              className="h-[45px]"
              placeholder="Nhập thương hiệu của bạn"
            ></Input>
          </Form.Item>
          <Form.Item
            label="Mô tả"
            name="description"
            rules={[{ required: true, message: "Vui lòng nhập mô tả!" }]}
          >
            <TextArea rows={5} placeholder="Mô tả của thương hiệu" />
          </Form.Item>
          <div className="mt-4 flex gap-5 justify-end">
            <Button htmlType="submit" className="min-w-[150px]" type="primary">
              Tạo mới
            </Button>
            <Button
              onClick={handleCancel}
              htmlType="reset"
              className="min-w-[150px]"
              danger
            >
              Huỷ bỏ
            </Button>
          </div>
        </Form>
      </div>
    </div>
  );
};

export default CreateBrand;
