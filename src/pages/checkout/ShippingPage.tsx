import { Breadcrumb, Button, Form, Input, Select } from "antd";
import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import {
  getAllProvince,
  getWard,
  type IProvince,
  type IWard,
} from "../../services/shipping.service";

const ShippingPage = () => {
  const { user } = useAuth();
  const [provinces, setProvinces] = useState<IProvince[]>([]);
  const [wards, setWards] = useState<IWard[]>([]);
  const [form] = Form.useForm();
  const [selectedProvince, setSelectedProvince] = useState<string | null>(null);
  const navigate = useNavigate();
  useEffect(() => {
    (async () => {
      const res = await getAllProvince();
      setProvinces(res);
    })();
  }, []);

  useEffect(() => {
    if (selectedProvince) {
      (async () => {
        const res = await getWard(selectedProvince);
        setWards(res);
      })();
    }
  }, [selectedProvince]);
  const handleChangeProvince = (data: any) => {
    setSelectedProvince(data.value);
    form.setFieldValue("wardCode", undefined);
  };
  const handleSubmit = (values: any) => {
    const payload = {
      ...values,
      province: values.province.label,
      ward: values.wardCode.label,
    };
    localStorage.setItem("shipping", JSON.stringify(payload));
    navigate("/checkout/payment");
  };
  return (
    <div>
      <div>
        <Breadcrumb
          items={[
            {
              title: <Link to={"/cart"}>Giỏ hàng</Link>,
            },
            {
              title: "Thông tin vận chuyển",
            },
          ]}
        />
      </div>
      <div className="mt-6 max-w-lg">
        <Form
          form={form}
          onFinish={handleSubmit}
          layout="vertical"
          initialValues={{
            name: user?.userName,
            email: user?.email,
            phone: user?.phone,
          }}
        >
          <Form.Item
            label="Tên người nhận"
            rules={[
              { required: true, message: "Tên người nhận không được để trống" },
              { min: 3, message: "Tên người nhận phải lớn hơn 3 ký tự!" },
            ]}
            name={"name"}
          >
            <Input
              placeholder="Nhập tên người nhận"
              style={{
                height: "40px",
                borderRadius: 5,
              }}
            />
          </Form.Item>
          <Form.Item
            label="Số điện thoại"
            name={"phone"}
            rules={[
              { required: true, message: "Số điện thoại không được để trống" },
              { min: 8, message: "Số điện thoại phải có trên 8 số!" },
            ]}
          >
            <Input
              placeholder="Nhập số điện thoại người nhận"
              style={{
                height: "40px",
                borderRadius: 5,
              }}
            />
          </Form.Item>
          <Form.Item
            label="Email"
            name={"email"}
            rules={[
              {
                required: true,
                message: "Email người nhận không được để trống!",
              },
              {
                type: "email",
                message: "Không đúng định dạng email!",
              },
            ]}
          >
            <Input
              placeholder="Nhập email người nhận"
              style={{
                height: "40px",
                borderRadius: 5,
              }}
            />
          </Form.Item>
          <div className="flex items-center gap-5">
            <Form.Item
              label="Tỉnh/Thành phố"
              name="province"
              layout="vertical"
              rules={[{ required: true, message: <></> }]}
              style={{ width: "100%" }}
            >
              <Select
                options={provinces.map((item) => {
                  return {
                    label: item.name,
                    value: item._id,
                  };
                })}
                style={{
                  height: "40px",
                  borderRadius: 5,
                }}
                onChange={(e) => {
                  handleChangeProvince(e);
                }}
                allowClear
                placeholder="Chọn Tỉnh/ Thành phố"
                labelInValue
              />
            </Form.Item>
            <Form.Item
              style={{ width: "100%" }}
              name="wardCode"
              layout="vertical"
              label="Phường/Xã"
              rules={[{ required: true, message: <></> }]}
            >
              <Select
                placeholder="Chọn Phường/ Xã"
                style={{
                  height: "40px",
                  borderRadius: 5,
                }}
                options={wards.map((item) => ({
                  label: item.name,
                  value: item._id,
                }))}
                disabled={!selectedProvince}
                allowClear
                labelInValue
              />
            </Form.Item>
          </div>
          <Form.Item
            label="Địa chỉ chi tiết"
            name={"detail"}
            rules={[
              {
                required: true,
                message: "Địa chỉ chi tiết không được để trống!",
              },
            ]}
          >
            <Input
              placeholder="Nhập địa chỉ chi tiết"
              style={{
                height: "40px",
                borderRadius: 5,
              }}
            />
          </Form.Item>
          <Form.Item style={{ display: "flex", justifyContent: "flex-end" }}>
            <Button
              htmlType="submit"
              type="primary"
              style={{ borderRadius: 5, height: "40px" }}
            >
              Phương thức thanh toán
            </Button>
          </Form.Item>
        </Form>
      </div>
    </div>
  );
};

export default ShippingPage;
