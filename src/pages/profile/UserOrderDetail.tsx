/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useState, useEffect, useCallback } from 'react';
import {
  Card,
  Typography,
  Descriptions,
  Table,
  Tag,
  Button,
  Spin,
  Row,
  Col,
  Steps,
  Divider,
  Modal,
  Form,
  Input,
  Rate,
} from 'antd';
import {
  ArrowLeftOutlined,
  ShoppingCartOutlined,
  CheckCircleOutlined,
  TruckOutlined,
  GiftOutlined,
  CloseCircleOutlined,
  StarOutlined,
} from '@ant-design/icons';
import { useNavigate, useParams } from 'react-router-dom';
import { useToast } from '../../context/ToastProvider';
import { formatCurrency, formatDate } from '../../utils';
import type { IOrder, IOrderItem } from '../../types/order';

const { Title, Text } = Typography;
const { TextArea } = Input;

const UserOrderDetail: React.FC = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const showToast = useToast();
  
  const [loading, setLoading] = useState(true);
  const [order, setOrder] = useState<IOrder | null>(null);
  const [cancelModalVisible, setCancelModalVisible] = useState(false);
  const [reviewModalVisible, setReviewModalVisible] = useState(false);
  const [reviewForm] = Form.useForm();
  const [cancelForm] = Form.useForm();

  // Mock order data for demonstration
  const mockOrder: IOrder = {
    _id: id || '1',
    userId: 'user123',
    customerInfo: {
      name: 'Nguyễn Văn A',
      email: 'customer@gmail.com',
      phone: '0901234567'
    },
    receiverInfo: {
      name: 'Nguyễn Văn A',
      email: 'receiver@gmail.com',
      phone: '0901234567'
    },
    address: {
      province: 'TP.HCM',
      ward: 'Phường 1, Quận 1',
      detail: '123 Đường ABC, Phường 1, Quận 1'
    },
    items: [
      {
        productId: 'prod1',
        name: 'Nike Air Max 270 React',
        size: '42',
        quantity: 1,
        price: 3500000
      },
      {
        productId: 'prod2',
        name: 'Adidas Ultraboost 22',
        size: '41',
        quantity: 1,
        price: 4200000
      }
    ],
    totalPrice: 7700000,
    status: 'shipping',
    note: 'Giao hàng nhanh trong giờ hành chính',
    createdAt: '2024-01-20T09:15:00Z',
    updatedAt: '2024-01-22T11:45:00Z'
  };

  const fetchOrderDetail = useCallback(async () => {
    setLoading(true);
    try {
      // TODO: Replace with actual API call
      // const response = await userService.getOrderDetail(id);
      // setOrder(response.data);
      
      // Using mock data for now
      setTimeout(() => {
        setOrder(mockOrder);
        setLoading(false);
      }, 1000);
    } catch {
      showToast('error', 'Không thể tải thông tin đơn hàng');
      setLoading(false);
    }
  }, [id, showToast]);

  useEffect(() => {
    fetchOrderDetail();
  }, [fetchOrderDetail]);

  const getStatusStep = (status: string) => {
    const steps = [
      { key: 'pending', title: 'Chờ xác nhận', icon: <ShoppingCartOutlined /> },
      { key: 'confirmed', title: 'Đã xác nhận', icon: <CheckCircleOutlined /> },
      { key: 'shipping', title: 'Đang giao hàng', icon: <TruckOutlined /> },
      { key: 'delivered', title: 'Đã giao hàng', icon: <GiftOutlined /> },
    ];

    if (status === 'cancelled') {
      return [
        { key: 'pending', title: 'Chờ xác nhận', icon: <ShoppingCartOutlined /> },
        { key: 'cancelled', title: 'Đã hủy', icon: <CloseCircleOutlined /> },
      ];
    }

    const currentIndex = steps.findIndex(step => step.key === status);
    return { steps, currentIndex };
  };

  const getStatusTag = (status: string) => {
    const statusMap = {
      pending: { color: 'orange', text: 'Chờ xác nhận' },
      confirmed: { color: 'blue', text: 'Đã xác nhận' },
      preparing: { color: 'cyan', text: 'Đang chuẩn bị' },
      shipping: { color: 'purple', text: 'Đang giao hàng' },
      delivered: { color: 'green', text: 'Đã giao hàng' },
      cancelled: { color: 'red', text: 'Đã hủy' }
    };
    
    return (
      <Tag color={statusMap[status as keyof typeof statusMap]?.color || 'default'} className="text-sm px-3 py-1">
        {statusMap[status as keyof typeof statusMap]?.text || status}
      </Tag>
    );
  };

  const handleCancelOrder = async (values: { reason: string }) => {
    try {
      
      setTimeout(() => {
        showToast('success', 'Hủy đơn hàng thành công');
        setCancelModalVisible(false);
        setOrder(prev => prev ? { ...prev, status: 'cancelled', canceled: { by: 'customer', description: values.reason } } : null);
      }, 1000);
    } catch {
      showToast('error', 'Không thể hủy đơn hàng');
    }
  };

  const handleReviewProduct = async (values: { rating: number; comment: string }) => {
    try {
      
      setTimeout(() => {
        showToast('success', 'Đánh giá sản phẩm thành công');
        setReviewModalVisible(false);
        reviewForm.resetFields();
      }, 1000);
    } catch {
      showToast('error', 'Không thể gửi đánh giá');
    }
  };

  const productColumns = [
    {
      title: 'Sản phẩm',
      dataIndex: 'name',
      key: 'name',
      render: (name: string, record: any) => (
        <div className="flex items-center gap-3">
          <div className="w-16 h-16 bg-gray-200 rounded-lg flex items-center justify-center">
            <img 
              src={`https://via.placeholder.com/64?text=${record.name.charAt(0)}`}
              alt={name}
              className="w-full h-full object-cover rounded-lg"
            />
          </div>
          <div>
            <Text strong className="block">{name}</Text>
            <Text type="secondary" className="text-sm">Size: {record.size}</Text>
          </div>
        </div>
      ),
    },
    {
      title: 'Đơn giá',
      dataIndex: 'price',
      key: 'price',
      render: (price: number) => <Text>{formatCurrency(price)}</Text>,
    },
    {
      title: 'Số lượng',
      dataIndex: 'quantity',
      key: 'quantity',
      render: (quantity: number) => <Text>x{quantity}</Text>,
    },
    {
      title: 'Thành tiền',
      key: 'total',
      render: (_: any, record: any) => (
        <Text strong className="text-red-600">
          {formatCurrency(record.price * record.quantity)}
        </Text>
      ),
    },
    {
      title: 'Thao tác',
      key: 'action',
      render: (_: any, record: any) => (
        order?.status === 'delivered' && (
          <Button
            type="link"
            icon={<StarOutlined />}
            onClick={() => setReviewModalVisible(true)}
          >
            Đánh giá
          </Button>
        )
      ),
    },
  ];

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-96">
        <Spin size="large" />
      </div>
    );
  }

  if (!order) {
    return (
      <div className="container mx-auto px-4 py-6">
        <Text type="secondary">Không tìm thấy đơn hàng</Text>
      </div>
    );
  }

  const statusInfo = getStatusStep(order.status);

  return (
    <div className="container mx-auto px-4 py-6">
      {/* Header */}
      <div className="mb-6">
        <Button
          type="text"
          icon={<ArrowLeftOutlined />}
          onClick={() => navigate('/profile')}
          className="mb-4"
        >
          Quay lại
        </Button>
        
        <div className="flex justify-between items-start">
          <div>
            <Title level={3}>Chi tiết đơn hàng #{order._id.slice(-6).toUpperCase()}</Title>
            <Text type="secondary">Ngày đặt: {formatDate(order.createdAt)}</Text>
          </div>
          <div className="text-right">
            {getStatusTag(order.status)}
          </div>
        </div>
      </div>

      <Row gutter={[24, 24]}>
        {/* Order Status */}
        <Col span={24}>
          <Card>
            <Title level={5} className="mb-4">Trạng thái đơn hàng</Title>
            {order.status !== 'cancelled' ? (
              <Steps
                current={(statusInfo as any).currentIndex}
                items={(statusInfo as any).steps}
                className="mb-4"
              />
            ) : (
              <Steps
                current={1}
                status="error"
                items={[
                  { title: 'Chờ xác nhận', icon: <ShoppingCartOutlined /> },
                  { title: 'Đã hủy', icon: <CloseCircleOutlined /> },
                ]}
                className="mb-4"
              />
            )}
            
            {order.status === 'pending' && (
              <div className="text-center mt-4">
                <Button 
                  danger 
                  onClick={() => setCancelModalVisible(true)}
                >
                  Hủy đơn hàng
                </Button>
              </div>
            )}
          </Card>
        </Col>

        {/* Order Info */}
        <Col xs={24} lg={12}>
          <Card>
            <Title level={5} className="mb-4">Thông tin đơn hàng</Title>
            <Descriptions column={1} size="small">
              <Descriptions.Item label="Người nhận">
                {order.receiverInfo.name}
              </Descriptions.Item>
              <Descriptions.Item label="Số điện thoại">
                {order.receiverInfo.phone}
              </Descriptions.Item>
              <Descriptions.Item label="Email">
                {order.receiverInfo.email}
              </Descriptions.Item>
              <Descriptions.Item label="Địa chỉ giao hàng">
                {order.address.detail}, {order.address.ward}, {order.address.province}
              </Descriptions.Item>
              {order.note && (
                <Descriptions.Item label="Ghi chú">
                  {order.note}
                </Descriptions.Item>
              )}
            </Descriptions>
          </Card>
        </Col>

        {/* Payment Info */}
        <Col xs={24} lg={12}>
          <Card>
            <Title level={5} className="mb-4">Thông tin thanh toán</Title>
            <div className="space-y-3">
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
          </Card>
        </Col>

        {/* Order Items */}
        <Col span={24}>
          <Card>
            <Title level={5} className="mb-4">Sản phẩm đã đặt</Title>
            <Table
              dataSource={order.items}
              columns={productColumns}
              pagination={false}
              rowKey="productId"
            />
          </Card>
        </Col>

        {/* Cancel Reason */}
        {order.canceled && (
          <Col span={24}>
            <Card>
              <Title level={5} className="mb-4">Lý do hủy đơn</Title>
              <Text>{order.canceled.description}</Text>
            </Card>
          </Col>
        )}
      </Row>

      {/* Cancel Order Modal */}
      <Modal
        title="Hủy đơn hàng"
        open={cancelModalVisible}
        onCancel={() => setCancelModalVisible(false)}
        footer={null}
      >
        <Form form={cancelForm} onFinish={handleCancelOrder} layout="vertical">
          <Form.Item
            label="Lý do hủy đơn"
            name="reason"
            rules={[{ required: true, message: 'Vui lòng nhập lý do hủy đơn' }]}
          >
            <TextArea
              rows={4}
              placeholder="Nhập lý do bạn muốn hủy đơn hàng..."
            />
          </Form.Item>
          <div className="flex justify-end gap-2">
            <Button onClick={() => setCancelModalVisible(false)}>
              Hủy
            </Button>
            <Button type="primary" danger htmlType="submit">
              Xác nhận hủy đơn
            </Button>
          </div>
        </Form>
      </Modal>

      {/* Review Product Modal */}
      <Modal
        title="Đánh giá sản phẩm"
        open={reviewModalVisible}
        onCancel={() => setReviewModalVisible(false)}
        footer={null}
      >
        <Form form={reviewForm} onFinish={handleReviewProduct} layout="vertical">
          <Form.Item
            label="Đánh giá"
            name="rating"
            rules={[{ required: true, message: 'Vui lòng chọn số sao' }]}
          >
            <Rate />
          </Form.Item>
          <Form.Item
            label="Nhận xét"
            name="comment"
            rules={[{ required: true, message: 'Vui lòng nhập nhận xét' }]}
          >
            <TextArea
              rows={4}
              placeholder="Chia sẻ trải nghiệm của bạn về sản phẩm..."
            />
          </Form.Item>
          <div className="flex justify-end gap-2">
            <Button onClick={() => setReviewModalVisible(false)}>
              Hủy
            </Button>
            <Button type="primary" htmlType="submit">
              Gửi đánh giá
            </Button>
          </div>
        </Form>
      </Modal>
    </div>
  );
};

export default UserOrderDetail;