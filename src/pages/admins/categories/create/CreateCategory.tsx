import { Button, Form, Input } from "antd";
import TextArea from "antd/es/input/TextArea";
import { Link, useNavigate } from "react-router-dom";
import type { ICategory } from "../../../../types/category";
import { createCategory } from "../../../../services/category.service";
import { useToast } from "../../../../context/ToastProvider";

const CreateCategory = () => {
  const toast = useToast();
  const nav = useNavigate();
  const handleCancel = () => {
    nav("/admin/categories");
  };

  const onFinish = async (
    values: Omit<ICategory, "_id" | "createdAt" | "updatedAt">
  ) => {
    try {
      await createCategory(values);
      toast("success", "Thêm danh mục thành công");
      nav("/admin/categories");
    } catch (error: any) {
      if (!error?.response?.data?.success) {
        toast("info", error?.response?.data?.message);
      }
    }
  };
  return (
    <div className="py-4 mt-4 shadow-lg px-4 rounded-lg w-full ">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-semibold">Tạo mới danh mục</h3>
        <Link to={"/admin/categories"} className="text-sm text-blue-500">
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
            label="Tên danh mục"
            name="name"
            rules={[
              { required: true, message: "Vui lòng nhập tên danh mục" },
              { min: 3, message: "Tên danh mục phải có tối thiểu 3 ký tự" },
              {
                max: 50,
                message: "Tên danh mục chỉ được nhập tối đa 50 ký tự",
              },
            ]}
          >
            <Input
              className="h-[45px]"
              placeholder="Nhập email của bạn"
            ></Input>
          </Form.Item>
          <Form.Item
            label="Mô tả"
            name="description"
            rules={[{ required: true, message: "Vui lòng nhập mô tả!" }]}
          >
            <TextArea rows={5} placeholder="Mô tả của danh mục" />
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

export default CreateCategory;
