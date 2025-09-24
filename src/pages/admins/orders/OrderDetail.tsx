import { ArrowLeftOutlined, CheckOutlined, CloseOutlined } from "@ant-design/icons";
import { Button, Card, Col, Descriptions, Divider, Row, Spin, Table, Tag, Typography, Modal, Input, Popconfirm } from "antd";
import dayjs from "dayjs";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useToast } from "../../../context/ToastProvider";
import type { IOrder, IOrderItem } from "../../../types/order";
import { getOrderDetail, updateOrderStatus, cancelOrder } from "../../../services/order.service";

const { Title, Text } = Typography;
const { TextArea } = Input;

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
      const response = await getOrderDetail(orderId);
      
      // Handle backend response structure - check if data is nested
      const orderData = response?.data || response;
      
      if (orderData && orderData._id) {
        setOrder(orderData);
      } else {
        toast('error', 'Dữ liệu đơn hàng không hợp lệ');
        setOrder(null);
      }
    } catch (error) {
      console.error('Error fetching order detail:', error);
      toast('error', 'Không thể tải chi tiết đơn hàng');
      setOrder(null);
    } finally {
      setLoading(false);
    }
  };

  // Handle status update
  const handleUpdateStatus = async (status: IOrder['status']) => {
    if (!order) {
      console.error('No order found');
      return;
    }
    

    
    setProcessing(true);
    try {
      const response = await updateOrderStatus(order._id, { status });
      console.log('Update status response:', response);
      
      // Re-fetch order detail to get the latest data from server
      await fetchOrderDetail(order._id);
      
      toast('success', `Đã cập nhật trạng thái đơn hàng thành "${getStatusText(status)}"`);
    } catch (error) {
      console.error('Error updating order status:', error);
      
      // Handle specific backend error messages
      let errorMessage = 'Lỗi không xác định';
      if (error && typeof error === 'object' && 'response' in error) {
        const axiosError = error as { response?: { data?: { message?: string } } };
        if (axiosError.response?.data?.message) {
          errorMessage = axiosError.response.data.message;
        }
      } else if (error instanceof Error) {
        errorMessage = error.message;
      }
      
      toast('error', `Không thể cập nhật trạng thái đơn hàng: ${errorMessage}`);
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
      await cancelOrder(order._id, { by: 'admin', description: cancelReason });
      
      // Update local state - backend may not set status to cancelled automatically
      setOrder({
        ...order,
        canceled: {
          by: 'admin',
          description: cancelReason
        },
        updatedAt: new Date().toISOString()
      });
      
      // Re-fetch to get updated data from server
      if (id) {
        fetchOrderDetail(id);
      }
      
      toast('success', 'Đã hủy đơn hàng thành công');
    } catch (error) {
      console.error('Error canceling order:', error);
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
  const getStatusColor = (status: string | undefined) => {
    if (!status) return "default";
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
  const getStatusText = (status: string | undefined) => {
    if (!status) return "Không xác định";
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



  // Get payment method text
  const getPaymentMethodText = (paymentMethod: string | undefined) => {
    if (!paymentMethod) return "Chưa xác định";
    switch (paymentMethod) {
      case "cod": return "Thanh toán khi nhận hàng";
      case "online": return "Thanh toán online";
      default: return paymentMethod;
    }
  };

  // Get payment status text and color based on isPaid
  const getPaymentDisplayText = (isPaid: boolean | undefined) => {
    return isPaid ? "Đã thanh toán" : "Chưa thanh toán";
  };

  const getPaymentDisplayColor = (isPaid: boolean | undefined) => {
    return isPaid ? "green" : "orange";
  };

  // Product columns for table
  const productColumns = [
    {
      title: "Sản phẩm",
      dataIndex: "name",
      key: "name",
      render: (name: string, record: IOrderItem) => {
        // Get product image - check if productId is populated with product info
        const productImage = typeof record.productId === 'object' && record.productId?.thumbnail 
          ? record.productId.thumbnail 
          : `https://via.placeholder.com/48?text=${record.name.charAt(0)}`;
        
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
              {typeof record.productId === 'object' && record.productId?._id && (
                <Text type="secondary" className="text-xs block">
                  ID: {record.productId._id.slice(-6).toUpperCase()}
                </Text>
              )}
            </div>
          </div>
        );
      },
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
          <Title level={3} className="mb-0">Chi tiết đơn hàng #{order._id ? order._id.slice(-8).toUpperCase() : 'N/A'}</Title>
        </div>
        <div className="flex gap-2">
          {!order.canceled?.description && order.status === 'pending' && (
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
          {!order.canceled?.description && order.status === 'confirmed' && (
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
          {!order.canceled?.description && order.status === 'shipping' && (
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
          {!order.canceled?.description && order.status === 'delivered' && (
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
          {order.canceled?.description && (
            <div className="text-center">
              <Tag color="red" className="px-4 py-2 text-sm">
                Đơn hàng đã bị hủy
              </Tag>
            </div>
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
                  <Text code>#{order._id ? order._id.slice(-8).toUpperCase() : 'N/A'}</Text>
                </Descriptions.Item>
                <Descriptions.Item label="Ngày đặt hàng">
                  {dayjs(order.createdAt).format("DD/MM/YYYY HH:mm")}
                </Descriptions.Item>
                <Descriptions.Item label="Số lượng sản phẩm">
                  <Text strong className="text-green-600">
                    {order.items?.length || 0} loại sản phẩm ({order.items?.reduce((total, item) => total + item.quantity, 0) || 0} sản phẩm)
                  </Text>
                </Descriptions.Item>
                <Descriptions.Item label="Phương thức thanh toán">
                  {order.paymentMethod ? getPaymentMethodText(order.paymentMethod) : "Chưa xác định"}
                </Descriptions.Item>
                <Descriptions.Item label="Phí vận chuyển">
                  <div>
                    <Text strong className="text-blue-600">
                      {formatCurrency(order.feeShipping || 30000)}
                    </Text>
                    {!order.feeShipping && (
                      <>
                        <br />
                        <Text type="secondary" className="text-xs">
                          (Phí mặc định)
                        </Text>
                      </>
                    )}
                  </div>
                </Descriptions.Item>
              </Descriptions>
            </Col>
            <Col span={12}>
              <Descriptions column={1} size="small">
                <Descriptions.Item label="Trạng thái đơn hàng">
                  <Tag color={getStatusColor(order.canceled && order.canceled.description ? 'cancelled' : order.status)}>
                    {getStatusText(order.canceled && order.canceled.description ? 'cancelled' : order.status)}
                  </Tag>
                </Descriptions.Item>
                <Descriptions.Item label="Trạng thái thanh toán">
                  <Tag color={getPaymentDisplayColor(order.isPaid)}>
                    {getPaymentDisplayText(order.isPaid)}
                  </Tag>
                </Descriptions.Item>
                <Descriptions.Item label="Tổng tiền">
                  <Text strong className="text-lg text-red-600">
                    {formatCurrency(order.totalPrice || 0)}
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
              {order.receiverInfo?.name || 'Chưa cập nhật'}
            </Descriptions.Item>
            <Descriptions.Item label="Email">
              {order.receiverInfo?.email || 'Chưa cập nhật'}
            </Descriptions.Item>
            <Descriptions.Item label="Số điện thoại">
              {order.receiverInfo?.phone || 'Chưa cập nhật'}
            </Descriptions.Item>
          </Descriptions>
        </Card>

        {/* Shipping Address */}
        <Card>
          <Title level={5} className="mb-4">Địa chỉ giao hàng</Title>
          <Descriptions column={1} size="small">
            <Descriptions.Item label="Địa chỉ chi tiết">
              {order.address?.detail || 'Chưa cập nhật'}
            </Descriptions.Item>
            <Descriptions.Item label="Phường/Xã">
              {order.address?.ward || 'Chưa cập nhật'}
            </Descriptions.Item>
            <Descriptions.Item label="Tỉnh/Thành phố">
              {order.address?.province || 'Chưa cập nhật'}
            </Descriptions.Item>
          </Descriptions>
        </Card>

        {/* Order Items */}
        <Card>
          <Title level={5} className="mb-4">Chi tiết đơn hàng</Title>
          <div className="mb-4">
            <Text type="secondary">{order.items?.length || 0} sản phẩm</Text>
          </div>
          
          <Table
            dataSource={order.items || []}
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
                <Text>Hủy bởi: {order.canceled.by || 'Không xác định'}</Text>
                <br />
                <Text>{order.canceled.description || 'Không có mô tả'}</Text>
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