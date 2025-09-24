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
import { getMyOrderDetail, cancelMyOrder } from '../../services/order.service';
import type { IOrder } from '../../types/order';

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

  

  const fetchOrderDetail = useCallback(async () => {
    if (!id) return;
    
    setLoading(true);
    try {
      const response = await getMyOrderDetail(id);
      
      // Handle backend response structure - check if data is nested
      const orderData = response?.data || response;
      
      if (orderData && orderData._id) {
        setOrder(orderData);
      } else {
        showToast('error', 'Dữ liệu đơn hàng không hợp lệ');
        setOrder(null);
      }
    } catch (error) {
      console.error('Error fetching order detail:', error);
      showToast('error', 'Không thể tải thông tin đơn hàng');
      setOrder(null);
    } finally {
      setLoading(false);
    }
  }, [id, showToast]);

  useEffect(() => {
    fetchOrderDetail();
  }, [fetchOrderDetail]);

  const getStatusStep = (status: string, canceled?: any) => {
    const steps = [
      { key: 'pending', title: 'Chờ xác nhận', icon: <ShoppingCartOutlined /> },
      { key: 'confirmed', title: 'Đã xác nhận', icon: <CheckCircleOutlined /> },
      { key: 'shipping', title: 'Đang giao hàng', icon: <TruckOutlined /> },
      { key: 'delivered', title: 'Đã giao hàng', icon: <GiftOutlined /> },
      { key: 'done', title: 'Hoàn thành', icon: <CheckCircleOutlined /> },
    ];

    // Check if order is cancelled (either by status or by having canceled info)
    if (status === 'cancelled' || (canceled && canceled.description)) {
      return {
        steps: [
          { key: 'pending', title: 'Chờ xác nhận', icon: <ShoppingCartOutlined /> },
          { key: 'cancelled', title: 'Đã hủy', icon: <CloseCircleOutlined /> },
        ],
        currentIndex: 1
      };
    }

    const currentIndex = steps.findIndex(step => step.key === status);
    return { steps, currentIndex };
  };

  const getStatusTag = (status: string, canceled?: any) => {
    const statusMap = {
      pending: { color: 'orange', text: 'Chờ xác nhận' },
      confirmed: { color: 'blue', text: 'Đã xác nhận' },
      shipping: { color: 'purple', text: 'Đang giao hàng' },
      delivered: { color: 'green', text: 'Đã giao hàng' },
      done: { color: 'success', text: 'Hoàn thành' },
      cancelled: { color: 'red', text: 'Đã hủy' }
    };
    
    // If order has cancel info, show as cancelled regardless of status
    const effectiveStatus = (canceled && canceled.description) ? 'cancelled' : status;
    
    return (
      <Tag color={statusMap[effectiveStatus as keyof typeof statusMap]?.color || 'default'} className="text-sm px-3 py-1">
        {statusMap[effectiveStatus as keyof typeof statusMap]?.text || effectiveStatus}
      </Tag>
    );
  };

  const handleCancelOrder = async (values: { reason: string }) => {
    if (!order || !order._id) {
      showToast('error', 'Thông tin đơn hàng không hợp lệ');
      return;
    }

    try {
      await cancelMyOrder(order._id, { 
        by: 'customer', 
        description: values.reason 
      });
      
      showToast('success', 'Hủy đơn hàng thành công');
      setCancelModalVisible(false);
      cancelForm.resetFields();
      
      // Update local state - backend doesn't auto set status to cancelled, 
      // but we can assume if cancel is successful and order has canceled info, it's cancelled
      setOrder(prev => prev ? { 
        ...prev, 
        canceled: { 
          by: 'customer', 
          description: values.reason 
        } 
      } : null);
      
      // Re-fetch to get updated data from server
      if (id) {
        fetchOrderDetail();
      }
    } catch (error) {
      console.error('Error canceling order:', error);
      showToast('error', 'Không thể hủy đơn hàng');
    }
  };



  const productColumns = [
    {
      title: 'Sản phẩm',
      dataIndex: 'name',
      key: 'name',
      render: (name: string, record: any) => {
        // Get product image - check if productId is populated with product info
        const productImage = typeof record.productId === 'object' && record.productId?.thumbnail 
          ? record.productId.thumbnail 
          : `https://via.placeholder.com/64?text=${record.name.charAt(0)}`;
        
        return (
          <div className="flex items-center gap-3">
            <div className="w-16 h-16 bg-gray-200 rounded-lg flex items-center justify-center overflow-hidden">
              <img 
                src={productImage}
                alt={name}
                className="w-full h-full object-cover rounded-lg"
                onError={(e) => {
                  // Fallback to placeholder if image fails to load
                  const target = e.target as HTMLImageElement;
                  target.src = `https://via.placeholder.com/64?text=${record.name.charAt(0)}`;
                }}
              />
            </div>
            <div>
              <Text strong className="block">{name}</Text>
              <Text type="secondary" className="text-sm">Size: {record.size}</Text>
            </div>
          </div>
        );
      },
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

  const statusInfo = getStatusStep(order.status, order.canceled);

  return (
    <div className="container mx-auto px-4 py-6">
      {/* Header */}
      <div className="mb-6">
        <Button
          type="text"
          icon={<ArrowLeftOutlined />}
          onClick={() => navigate('/profile/my-orders')}
          className="mb-4"
        >
          Quay lại
        </Button>
        
        <div className="flex justify-between items-start">
          <div>
            <Title level={3}>Chi tiết đơn hàng #{order._id?.slice(-6).toUpperCase() || 'N/A'}</Title>
            <Text type="secondary">Ngày đặt: {formatDate(order.createdAt)}</Text>
          </div>
          <div className="text-right">
            {getStatusTag(order.status, order.canceled)}
          </div>
        </div>
      </div>

      <Row gutter={[24, 24]}>
        {/* Order Status */}
        <Col span={24}>
          <Card>
            <Title level={5} className="mb-4">Trạng thái đơn hàng</Title>
            <Steps
              current={statusInfo.currentIndex}
              status={order.status === 'cancelled' || (order.canceled && order.canceled.description) ? 'error' : 'process'}
              items={statusInfo.steps}
              className="mb-4"
            />
            
            {order.status === 'pending' && !(order.canceled && order.canceled.description) && (
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
                {order.receiverInfo?.name || 'Chưa cập nhật'}
              </Descriptions.Item>
              <Descriptions.Item label="Số điện thoại">
                {order.receiverInfo?.phone || 'Chưa cập nhật'}
              </Descriptions.Item>
              <Descriptions.Item label="Email">
                {order.receiverInfo?.email || 'Chưa cập nhật'}
              </Descriptions.Item>
              <Descriptions.Item label="Địa chỉ giao hàng">
                {order.address?.detail && order.address?.ward && order.address?.province
                  ? `${order.address.detail}, ${order.address.ward}, ${order.address.province}`
                  : 'Chưa cập nhật'}
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
                <Text>Phương thức thanh toán:</Text>
                <Text>
                  {order.paymentMethod === 'cod' ? 'Thanh toán khi nhận hàng' : 'Thanh toán online'}
                </Text>
              </div>
              <div className="flex justify-between">
                <Text>Trạng thái thanh toán:</Text>
                <Tag color={order.isPaid ? 'green' : 'orange'}>
                  {order.isPaid ? 'Đã thanh toán' : 'Chưa thanh toán'}
                </Tag>
              </div>
              <Divider style={{ margin: "8px 0" }} />
              <div className="flex justify-between">
                <Text>Tạm tính:</Text>
                <Text>{formatCurrency((order.totalPrice || 0) - (order.feeShipping || 0))}</Text>
              </div>
              <div className="flex justify-between">
                <Text>Phí vận chuyển:</Text>
                <Text>{formatCurrency(order.feeShipping || 0)}</Text>
              </div>
              <Divider style={{ margin: "8px 0" }} />
              <div className="flex justify-between">
                <Text strong>Tổng cộng:</Text>
                <Text strong className="text-lg text-red-600">
                  {formatCurrency(order.totalPrice || 0)}
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
              dataSource={order.items || []}
              columns={productColumns}
              pagination={false}
              rowKey="productId"
            />
          </Card>
        </Col>

        {/* Cancel Reason */}
        {order.canceled && order.canceled.description && (
          <Col span={24}>
            <Card>
              <Title level={5} className="mb-4">Lý do hủy đơn</Title>
              <Text>{order.canceled.description || 'Không có lý do cụ thể'}</Text>
              {order.canceled.by && (
                <div className="mt-2">
                  <Text type="secondary">
                    Hủy bởi: {order.canceled.by === 'customer' ? 'Khách hàng' : 'Quản trị viên'}
                  </Text>
                </div>
              )}
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
    </div>
  );
};

export default UserOrderDetail;