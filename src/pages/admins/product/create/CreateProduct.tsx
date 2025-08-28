import { MinusCircleOutlined, PlusOutlined } from "@ant-design/icons";
import { Button, Form, Input, InputNumber, Select, Upload } from "antd";
import TextArea from "antd/es/input/TextArea";
import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { getAllbrands } from "../../../../services/brand.service";
import { getAllCategory } from "../../../../services/category.service";
import {
  uploadMutipleFile,
  uploadSingleFile,
} from "../../../../services/upload.service";
import type { IBrand } from "../../../../types/brand";
import type { ICategory } from "../../../../types/category";
import { createProduct } from "../../../../services/product.service";
import { useToast } from "../../../../context/ToastProvider";

const sizeOptions = [
  "36",
  "37",
  "38",
  "39",
  "40",
  "41",
  "42",
  "43",
  "44",
  "45",
];
const CreateProduct = () => {
  const [categories, setCategories] = useState<ICategory[] | null>(null);
  const [brands, setBrands] = useState<IBrand[] | null>(null);
  const [loading, setLoading] = useState(false);
  const toast = useToast();
  const navigate = useNavigate();
  const [form] = Form.useForm();
  const selectedSizes = Form.useWatch("sizes", form) || [];

  useEffect(() => {
    const fetchCategory = async () => {
      try {
        const res = await getAllCategory({ limit: 10000000000 });
        setCategories(res.docs);
      } catch (error) {
        console.error(error);
      }
    };
    fetchCategory();
  }, []);
  useEffect(() => {
    const fetchBrands = async () => {
      try {
        const res = await getAllbrands({ limit: 10000000000 });
        setBrands(res.docs);
      } catch (error) {
        console.error(error);
      }
    };
    fetchBrands();
  }, []);

  const onFinish = async (values: any) => {
    setLoading(true);
    try {
      let image = "";
      let images = [];
      if (values.thumbnail) {
        const formdata = new FormData();
        formdata.append("image", values.thumbnail[0].originFileObj);
        const res = await uploadSingleFile(formdata);
        if (res.success) {
          image = res.data;
        }
      }
      if (values.images && values.images.length > 0) {
        const formData = new FormData();

        values.images.forEach((file: any) => {
          formData.append("images", file.originFileObj);
        });

        const res = await uploadMutipleFile(formData);
        images = res.data;
      }
      const payload = {
        ...values,
        thumbnail: image,
        images,
      };
      const res = await createProduct(payload);
      if (res) {
        console.log(res);
        toast("success", res.message);
        navigate("/admin/products");
      }
      setLoading(false);
    } catch (error: any) {
      if (!error?.response?.data?.success) {
        toast("info", error?.response?.data?.message);
      }
      setLoading(false);
    }
  };
  return (
    <div className="py-4 my-2 shadow-lg px-4 rounded-lg w-full min-h-[95vh]">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-semibold">Tạo mới sản phẩm</h3>
        <Link to={"/admin/products"} className="text-sm text-blue-500">
          &lt; Quay trở về danh sách
        </Link>
      </div>
      <div className="mt-6">
        <Form
          form={form}
          name="basic"
          onFinish={onFinish}
          layout="vertical"
          autoComplete="off"
        >
          <div className="flex items-center gap-5">
            <div className="w-[100%]">
              <Form.Item
                label="Tên sản phẩm"
                name="name"
                rules={[
                  { required: true, message: "Vui lòng nhập tên sản phẩm" },
                  { min: 3, message: "Tên sản phẩm phải có tối thiểu 3 ký tự" },
                  {
                    max: 80,
                    message: "Tên sản phẩm chỉ được nhập tối đa 80 ký tự",
                  },
                ]}
              >
                <Input
                  className="h-[45px]"
                  placeholder="Nhập tên sản phẩm"
                ></Input>
              </Form.Item>
              <Form.Item
                label="Giá tiền của sản phẩm"
                name="price"
                rules={[
                  {
                    required: true,
                    message: "Phải nhập giá tiền cho sản phẩm",
                  },
                  {
                    validator: (_, value) => {
                      if (value < 5000 && value > 0) {
                        return Promise.reject(
                          "Giá tiền của sản phẩm phải tối thiểu 5.000đ"
                        );
                      }
                      if (value > 1000000000) {
                        return Promise.reject(
                          "Giá tiền của sản phẩm chỉ được tối đa 1.000.000.000đ"
                        );
                      }
                      return Promise.resolve();
                    },
                  },
                ]}
              >
                <InputNumber<number>
                  className="h-[45px]"
                  style={{ width: "100%" }}
                  placeholder="Nhập giá tiền của sản phẩm"
                  min={1000}
                  max={1000000000}
                  formatter={(value) =>
                    `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")
                  }
                  parser={(value) =>
                    value?.replace(/\$\s?|(,*)/g, "") as unknown as number
                  }
                />
              </Form.Item>
            </div>
            <div className="w-[100%]">
              <Form.Item
                label="Danh mục của sản phẩm"
                name="category"
                rules={[
                  {
                    required: true,
                    message: "Vui lòng chọn danh mục cho sản phẩm",
                  },
                ]}
              >
                <Select
                  style={{
                    height: 45,
                  }}
                  placeholder="Chọn danh mục"
                  showSearch
                  allowClear
                >
                  {categories &&
                    categories.map((item, index) => (
                      <Select.Option key={index} value={item._id}>
                        {item.name}
                      </Select.Option>
                    ))}
                </Select>
              </Form.Item>
              <Form.Item
                label="Thuơng hiệu của sản phẩm"
                name="brand"
                rules={[
                  {
                    required: true,
                    message: "Vui lòng chọn thuơng hiệu cho sản phẩm",
                  },
                ]}
              >
                <Select
                  style={{
                    height: 45,
                  }}
                  placeholder="Chọn thương hiệu"
                  showSearch
                  allowClear
                >
                  {brands &&
                    brands.map((item, index) => (
                      <Select.Option key={index} value={item._id}>
                        {item.name}
                      </Select.Option>
                    ))}
                </Select>
              </Form.Item>
            </div>
          </div>
          <div className="mt-2">
            <Form.Item
              label="Hình ảnh sản phẩm"
              name="thumbnail"
              valuePropName="fileList"
              getValueFromEvent={(e) => (Array.isArray(e) ? e : e?.fileList)}
              rules={[
                {
                  required: true,
                  message: "Vui lòng tải lên ảnh bìa sản phẩm",
                },
              ]}
            >
              <Upload
                listType="picture-card"
                maxCount={1}
                customRequest={({ onSuccess }) => {
                  setTimeout(() => {
                    onSuccess?.("ok");
                  }, 1000);
                }}
              >
                + Upload
              </Upload>
            </Form.Item>
            <Form.Item
              label="Thư viện ảnh sản phẩm"
              name="images"
              valuePropName="fileList"
              getValueFromEvent={(e) => (Array.isArray(e) ? e : e?.fileList)}
              rules={[
                {
                  required: true,
                  message: "Vui lòng tải lên ít nhất 1 hình ảnh sản phẩm",
                },
              ]}
            >
              <Upload
                listType="picture-card"
                multiple
                maxCount={5}
                customRequest={({ onSuccess }) => {
                  setTimeout(() => {
                    onSuccess?.("ok");
                  }, 1000);
                }}
              >
                + Upload
              </Upload>
            </Form.Item>
          </div>
          <Form.Item label="Mô tả" name="description">
            <TextArea rows={5} placeholder="Mô tả của danh mục" />
          </Form.Item>
          {/* Biến thể */}
          <Form.List
            name="sizes"
            rules={[
              {
                validator: async (_, sizes) => {
                  if (!sizes || sizes.length < 1) {
                    return Promise.reject(
                      new Error("Vui lòng thêm ít nhất 1 biến thể")
                    );
                  }
                },
              },
            ]}
          >
            {(fields, { add, remove }, { errors }) => (
              <>
                <label className="font-semibold block mb-2">Biến thể</label>

                {fields.map(({ key, name, ...restField }) => {
                  const usedSizes = selectedSizes
                    .map((item: any) => item?.value)
                    .filter(Boolean);

                  const currentValue = selectedSizes?.[name]?.value;

                  const options = sizeOptions
                    .filter(
                      (size) =>
                        !usedSizes.includes(size) || size === currentValue
                    )
                    .map((size) => ({ label: size, value: size }));

                  return (
                    <div
                      key={key}
                      style={{
                        display: "flex",
                        marginBottom: 8,
                        width: "100%",
                        gap: 15,
                      }}
                    >
                      <Form.Item
                        {...restField}
                        label="Kích cỡ"
                        name={[name, "value"]}
                        rules={[
                          { required: true, message: "Vui lòng chọn kích cỡ" },
                        ]}
                        style={{ flex: 1 }}
                      >
                        <Select
                          placeholder="Chọn kích cỡ"
                          className="h-[45px] w-full"
                          style={{ width: "100%", height: 45 }}
                          options={options}
                        />
                      </Form.Item>

                      <Form.Item
                        {...restField}
                        label="Số lượng"
                        name={[name, "stock"]}
                        rules={[
                          { required: true, message: "Vui lòng nhập số lượng" },
                        ]}
                        style={{ flex: 1 }}
                      >
                        <InputNumber
                          min={1}
                          placeholder="Nhập số lượng"
                          style={{ width: "100%", height: 45 }}
                        />
                      </Form.Item>

                      <MinusCircleOutlined onClick={() => remove(name)} />
                    </div>
                  );
                })}

                <Form.Item>
                  <Button
                    type="dashed"
                    onClick={() => add()}
                    block
                    icon={<PlusOutlined />}
                  >
                    Thêm biến thể
                  </Button>
                  <Form.ErrorList errors={errors} />
                </Form.Item>
              </>
            )}
          </Form.List>

          <div className="mt-4 flex gap-5 justify-end">
            <Button
              loading={loading}
              htmlType="submit"
              className="min-w-[150px]"
              type="primary"
            >
              Tạo mới
            </Button>
            <Button htmlType="reset" className="min-w-[150px]" danger>
              Huỷ bỏ
            </Button>
          </div>
        </Form>
      </div>
    </div>
  );
};

export default CreateProduct;
