import { Button, Form, Input } from "antd";
import TextArea from "antd/es/input/TextArea";
import { Link, useNavigate, useParams } from "react-router-dom";
import { useToast } from "../../../../context/ToastProvider";
import {
  createCategory,
  getDetailCategory,
  updateCategory,
} from "../../../../services/category.service";
import type { ICategory } from "../../../../types/category";
import { use, useEffect } from "react";

const UpdateCategory = () => {
  const { id } = useParams();
  const toast = useToast();
  const nav = useNavigate();
  const handleCancel = () => {
    nav("/admin/categories");
  };
  const [form] = Form.useForm();
  async function FetchDetail() {
    const data = await getDetailCategory(id as string);
    if (data) {
      form.setFieldsValue(data);
    }
  }
  const handleResetFields = () => {
    FetchDetail();
  };
  useEffect(() => {
    FetchDetail();
  }, [id]);
  const onFinish = async (
    values: Omit<ICategory, "_id" | "createdAt" | "updatedAt">
  ) => {
    try {
      await updateCategory(id as string, values);
      toast("success", "Cập nhật danh mục thành công");
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
        <h3 className="text-lg font-semibold">Cập nhật danh mục</h3>
        <Link to={"/admin/categories"} className="text-sm text-blue-500">
          &lt; Quay trở về danh sách
        </Link>
      </div>
      <div className="mt-6">
        <Form
          form={form}
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
              Cập nhật
            </Button>

            <Button
              onClick={handleCancel}
              htmlType="reset"
              className="min-w-[150px]"
              danger
            >
              Huỷ bỏ
            </Button>
            <Button
              onClick={handleResetFields}
              htmlType="button"
              className="min-w-[150px]"
              type="default"
            >
              Đặt lại
            </Button>
          </div>
        </Form>
      </div>
    </div>
  );
};

export default UpdateCategory;
