import { ArrowLeftOutlined, CheckOutlined, CloseOutlined } from "@ant-design/icons";
import { Button, Card, Col, Descriptions, Divider, Row, Spin, Table, Tag, Typography, Modal, Input, Popconfirm } from "antd";
import dayjs from "dayjs";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useToast } from "../../../context/ToastProvider";
import type { IOrder, IOrderItem } from "../../../types/order";
// import { getOrderDetail } from "../../../services/order.service";

const { Title, Text } = Typography;
const { TextArea } = Input;

// Mock data cho demo giao diện
const mockOrderDetail: IOrder = {
  _id: "67123456789abcdef0123456",
  userId: "user123",
  customerInfo: {
    name: "Nguyễn Văn Duy",
    email: "admin@gmail.com",
    phone: "0123456789"
  },
  receiverInfo: {
    name: "Nguyễn Văn Duy",
    email: "admin@gmail.com", 
    phone: "0123456789"
  },
  address: {
    province: "Hà Nội, Việt Nam",
    ward: "Phường Trung Văn, Quận Nam Từ Liêm",
    detail: "Số 123, Phùng Khoang"
  },
  items: [
    {
      productId: "product1",
      name: "Giày thể thao Chitu 7 PRO Nam",
      size: "40",
      quantity: 2,
      price: 1590000
    },
    {
      productId: "product2", 
      name: "Tất thể thao Nike Pro",
      size: "M",
      quantity: 1,
      price: 120000
    }
  ],
  note: "Giao hàng trong giờ hành chính, gọi trước 15 phút",
  status: "pending" as const,
  totalPrice: 3300000,
  createdAt: "2025-09-17T09:02:04.000Z",
  updatedAt: "2025-09-17T09:02:04.000Z"
};

export default function OrderDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [order, setOrder] = useState<IOrder | null>(null);
  const [loading, setLoading] = useState(true);
  const [cancelModalOpen, setCancelModalOpen] = useState(false);
  const [cancelReason, setCancelReason] = useState('');
  const [processing, setProcessing] = useState(false);
  const toast = useToast();

  useEffect(() => {
    if (id) {
      fetchOrderDetail(id);
    }
  }, [id]);

  const fetchOrderDetail = async (orderId: string) => {
    try {
      setLoading(true);
      // Comment API call để sử dụng mock data
      // const response = await getOrderDetail(orderId);
      
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 800));
      
      // Tìm order theo ID hoặc sử dụng mock data
      const foundOrder = orderId === mockOrderDetail._id ? mockOrderDetail : mockOrderDetail;
      setOrder(foundOrder);
    } catch (error) {
      console.error('Error fetching order detail:', error);
      toast('error', 'Không thể tải chi tiết đơn hàng');
    } finally {
      setLoading(false);
    }
  };

  // Handle status update
  const handleUpdateStatus = async (status: IOrder['status']) => {
    if (!order) return;
    
    setProcessing(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Update local state
      setOrder({
        ...order,
        status: status,
        updatedAt: new Date().toISOString()
      });
      
      toast('success', `Đã cập nhật trạng thái đơn hàng thành "${getStatusText(status)}"`);
    } catch (error) {
      toast('error', 'Không thể cập nhật trạng thái đơn hàng');
    } finally {
      setProcessing(false);
    }
  };

  // Handle cancel order
  const handleCancelOrder = async () => {
    if (!order || !cancelReason.trim()) {
      toast('error', 'Vui lòng nhập lý do hủy đơn hàng');
      return;
    }
    
    setProcessing(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Update local state
      setOrder({
        ...order,
        status: 'cancelled',
        canceled: {
          by: 'admin',
          description: cancelReason
        },
        updatedAt: new Date().toISOString()
      });
      
      toast('success', 'Đã hủy đơn hàng thành công');
    } catch (error) {
      toast('error', 'Không thể hủy đơn hàng');
    } finally {
      setProcessing(false);
      setCancelModalOpen(false);
      setCancelReason('');
    }
  };

  // Format currency
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND'
    }).format(amount);
  };

  // Get status color
  const getStatusColor = (status: string) => {
    switch (status) {
      case "pending": return "orange";
      case "confirmed": return "blue";
      case "shipping": return "cyan";
      case "delivered": return "green";
      case "done": return "success";
      case "cancelled": return "red";
      default: return "default";
    }
  };

  // Get status text
  const getStatusText = (status: string) => {
    switch (status) {
      case "pending": return "Chờ xác nhận";
      case "confirmed": return "Đã xác nhận";  
      case "shipping": return "Đang giao";
      case "delivered": return "Đã giao";
      case "done": return "Hoàn thành";
      case "cancelled": return "Đã hủy";
      default: return status;
    }
  };

  // Product columns for table
  const productColumns = [
    {
      title: "Sản phẩm",
      dataIndex: "name",
      key: "name",
      render: (name: string, record: IOrderItem) => (
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 bg-gray-200 rounded-md flex items-center justify-center">
            <span className="text-xs text-gray-500">IMG</span>
          </div>
          <div>
            <Text strong>{name}</Text>
            <br />
            <Text type="secondary">Size: {record.size}</Text>
          </div>
        </div>
      ),
    },
    {
      title: "Đơn giá",
      dataIndex: "price",
      key: "price",
      width: 120,
      render: (price: number) => (
        <Text>{formatCurrency(price)}</Text>
      ),
    },
    {
      title: "Số lượng",
      dataIndex: "quantity",
      key: "quantity", 
      width: 100,
      align: "center" as const,
      render: (quantity: number) => (
        <Text strong>{quantity}</Text>
      ),
    },
    {
      title: "Thành tiền",
      key: "total",
      width: 120,
      render: (_: unknown, record: IOrderItem) => (
        <Text strong className="text-blue-600">
          {formatCurrency(record.price * record.quantity)}
        </Text>
      ),
    },
  ];

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[400px]">
        <Spin size="large" />
      </div>
    );
  }

  if (!order) {
    return (
      <div className="text-center py-8">
        <Text>Không tìm thấy đơn hàng</Text>
      </div>
    );
  }

  return (
    <div className="py-4 mt-4 shadow-lg px-4 rounded-lg w-full min-h-[95vh]">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-4">
          <Button 
            icon={<ArrowLeftOutlined />} 
            onClick={() => navigate('/admin/orders')}
          >
            Quay lại
          </Button>
          <Title level={3} className="mb-0">Chi tiết đơn hàng #{order._id.slice(-8).toUpperCase()}</Title>
        </div>
        <div className="flex gap-2">
          {order.status === 'pending' && (
            <>
              <Popconfirm
                title="Xác nhận đơn hàng"
                description="Bạn có chắc chắn muốn xác nhận đơn hàng này?"
                onConfirm={() => handleUpdateStatus('confirmed')}
                okText="Xác nhận"
                cancelText="Hủy"
                okButtonProps={{ loading: processing }}
                cancelButtonProps={{ disabled: processing }}
              >
                <Button 
                  type="primary" 
                  icon={<CheckOutlined />}
                  loading={processing}
                >
                  Xác nhận
                </Button>
              </Popconfirm>
              <Button 
                danger 
                icon={<CloseOutlined />}
                onClick={() => setCancelModalOpen(true)}
              >
                Hủy Đơn Hàng
              </Button>
            </>
          )}
          {order.status === 'confirmed' && (
            <>
              <Popconfirm
                title="Chuyển sang đang giao"
                description="Bạn có chắc chắn muốn chuyển đơn hàng sang trạng thái đang giao?"
                onConfirm={() => handleUpdateStatus('shipping')}
                okText="Xác nhận"
                cancelText="Hủy"
                okButtonProps={{ loading: processing }}
                cancelButtonProps={{ disabled: processing }}
              >
                <Button 
                  type="primary" 
                  loading={processing}
                >
                  Chuyển sang Đang giao
                </Button>
              </Popconfirm>
              <Button 
                danger 
                icon={<CloseOutlined />}
                onClick={() => setCancelModalOpen(true)}
              >
                Hủy Đơn Hàng
              </Button>
            </>
          )}
          {order.status === 'shipping' && (
            <Popconfirm
              title="Đánh dấu đã giao"
              description="Bạn có chắc chắn đơn hàng đã được giao thành công?"
              onConfirm={() => handleUpdateStatus('delivered')}
              okText="Xác nhận"
              cancelText="Hủy"
              okButtonProps={{ loading: processing }}
              cancelButtonProps={{ disabled: processing }}
            >
              <Button 
                type="primary" 
                loading={processing}
              >
                Đánh dấu Đã giao
              </Button>
            </Popconfirm>
          )}
          {order.status === 'delivered' && (
            <Popconfirm
              title="Hoàn thành đơn hàng"
              description="Bạn có chắc chắn muốn hoàn thành đơn hàng này?"
              onConfirm={() => handleUpdateStatus('done')}
              okText="Xác nhận"
              cancelText="Hủy"
              okButtonProps={{ loading: processing }}
              cancelButtonProps={{ disabled: processing }}
            >
              <Button 
                type="primary" 
                loading={processing}
              >
                Hoàn thành
              </Button>
            </Popconfirm>
          )}
        </div>
      </div>

      <div className="space-y-6">
        {/* Order Info Header */}
        <Card>
          <Title level={4} className="mb-4">Thông tin đơn hàng</Title>
          <Row gutter={[16, 16]}>
            <Col span={12}>
              <Descriptions column={1} size="small">
                <Descriptions.Item label="Mã đơn hàng">
                  <Text code>#{order._id.slice(-8).toUpperCase()}</Text>
                </Descriptions.Item>
                <Descriptions.Item label="Ngày đặt hàng">
                  {dayjs(order.createdAt).format("DD/MM/YYYY HH:mm")}
                </Descriptions.Item>
                <Descriptions.Item label="Phương thức thanh toán">
                  Thanh toán khi nhận hàng
                </Descriptions.Item>
              </Descriptions>
            </Col>
            <Col span={12}>
              <Descriptions column={1} size="small">
                <Descriptions.Item label="Trạng thái đơn hàng">
                  <Tag color={getStatusColor(order.status)}>
                    {getStatusText(order.status)}
                  </Tag>
                </Descriptions.Item>
                <Descriptions.Item label="Tổng tiền">
                  <Text strong className="text-lg text-red-600">
                    {formatCurrency(order.totalPrice)}
                  </Text>
                </Descriptions.Item>
                <Descriptions.Item label="Phí vận chuyển">
                  <Text strong className="text-lg text-red-600">
                    30.000 ₫
                  </Text>
                </Descriptions.Item>
              </Descriptions>
            </Col>
          </Row>
        </Card>

        

        <Card>
          <Title level={5} className="mb-4">Thông tin người nhận</Title>
          <Descriptions column={2} size="small">
            <Descriptions.Item label="Tên người nhận">
              {order.receiverInfo.name}
            </Descriptions.Item>
            <Descriptions.Item label="Email">
              {order.receiverInfo.email}
            </Descriptions.Item>
            <Descriptions.Item label="Số điện thoại">
              {order.receiverInfo.phone}
            </Descriptions.Item>
          </Descriptions>
        </Card>

        {/* Shipping Address */}
        <Card>
          <Title level={5} className="mb-4">Địa chỉ giao hàng</Title>
          <Descriptions column={1} size="small">
            <Descriptions.Item label="Địa chỉ chi tiết">
              {order.address.detail}
            </Descriptions.Item>
            <Descriptions.Item label="Phường/Xã">
              {order.address.ward}
            </Descriptions.Item>
            <Descriptions.Item label="Tỉnh/Thành phố">
              {order.address.province}
            </Descriptions.Item>
          </Descriptions>
        </Card>

        {/* Order Items */}
        <Card>
          <Title level={5} className="mb-4">Chi tiết đơn hàng</Title>
          <div className="mb-4">
            <Text type="secondary">{order.items.length} sản phẩm</Text>
          </div>
          
          <Table
            dataSource={order.items}
            columns={productColumns}
            pagination={false}
            rowKey="productId"
            size="small"
          />

          <Divider />

          {/* Order Summary */}
          <Row justify="end">
            <Col span={8}>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <Text>Tạm tính:</Text>
                  <Text>{formatCurrency(order.totalPrice)}</Text>
                </div>
                <div className="flex justify-between">
                  <Text>Phí vận chuyển:</Text>
                  <Text>{formatCurrency(0)}</Text>
                </div>
                <Divider style={{ margin: "8px 0" }} />
                <div className="flex justify-between">
                  <Text strong>Tổng cộng:</Text>
                  <Text strong className="text-lg text-red-600">
                    {formatCurrency(order.totalPrice)}
                  </Text>
                </div>
              </div>
            </Col>
          </Row>

          {order.note && (
            <>
              <Divider />
              <div>
                <Text strong>Ghi chú đơn hàng:</Text>
                <br />
                <Text>{order.note}</Text>
              </div>
            </>
          )}

          {order.canceled && (
            <>
              <Divider />
              <div>
                <Text strong className="text-red-600">Lý do hủy đơn:</Text>
                <br />
                <Text>Hủy bởi: {order.canceled.by}</Text>
                <br />
                <Text>{order.canceled.description}</Text>
              </div>
            </>
          )}
        </Card>
      </div>

      {/* Cancel Order Modal */}
      <Modal
        title="Hủy đơn hàng"
        open={cancelModalOpen}
        onOk={handleCancelOrder}
        onCancel={() => {
          setCancelModalOpen(false);
          setCancelReason('');
        }}
        okText="Xác nhận hủy"
        cancelText="Đóng"
        okButtonProps={{ danger: true, loading: processing }}
        cancelButtonProps={{ disabled: processing }}
      >
        <div className="space-y-4">
          <Text>Bạn có chắc chắn muốn hủy đơn hàng này không?</Text>
          <div>
            <Text strong>Lý do hủy đơn hàng: <span className="text-red-500">*</span></Text>
            <TextArea
              rows={4}
              value={cancelReason}
              onChange={(e) => setCancelReason(e.target.value)}
              placeholder="Nhập lý do hủy đơn hàng..."
              maxLength={500}
              showCount
            />
          </div>
        </div>
      </Modal>
    </div>
  );
}