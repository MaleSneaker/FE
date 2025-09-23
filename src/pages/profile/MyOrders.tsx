import React, { useState, useEffect, useCallback, useMemo } from 'react';
import {
  Card,
  Typography,
  Table,
  Tag,
  Button,
  Spin,
  Empty,
  Space,
  Row,
  Col,
  Select,
  DatePicker,
  Input,
} from 'antd';
import {
  EyeOutlined,
  SearchOutlined,
  FilterOutlined,
  ReloadOutlined,
} from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastProvider';
import { formatCurrency, formatDate } from '../../utils';
import type { IOrder } from '../../types/order';

const { Title, Text } = Typography;
const { Option } = Select;
const { RangePicker } = DatePicker;

const MyOrders: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const showToast = useToast();
  
  const [loading, setLoading] = useState(false);
  const [orders, setOrders] = useState<IOrder[]>([]);
  const [filteredOrders, setFilteredOrders] = useState<IOrder[]>([]);
  const [filters, setFilters] = useState({
    status: '',
    dateRange: null as [any, any] | null,
    search: '',
  });

  // Mock data với nhiều đơn hàng hơn
  const mockOrders = useMemo((): IOrder[] => [
    {
      _id: '1',
      userId: user?._id || '',
      customerInfo: {
        name: user?.userName || 'Khách hàng',
        email: user?.email || '',
        phone: user?.phone || ''
      },
      receiverInfo: {
        name: 'Nguyễn Văn A',
        email: 'receiver@gmail.com',
        phone: '0901234567'
      },
      address: {
        province: 'TP.HCM',
        ward: 'Phường 1, Quận 1',
        detail: '123 Đường ABC'
      },
      items: [
        {
          productId: 'prod1',
          name: 'Nike Air Max 270',
          size: '42',
          quantity: 1,
          price: 3500000
        }
      ],
      totalPrice: 3500000,
      status: 'delivered',
      note: '',
      createdAt: '2024-01-15T10:30:00Z',
      updatedAt: '2024-01-20T14:20:00Z'
    },
    {
      _id: '2',
      userId: user?._id || '',
      customerInfo: {
        name: user?.userName || 'Khách hàng',
        email: user?.email || '',
        phone: user?.phone || ''
      },
      receiverInfo: {
        name: 'Nguyễn Văn A',
        email: 'receiver@gmail.com',
        phone: '0901234567'
      },
      address: {
        province: 'TP.HCM',
        ward: 'Phường 1, Quận 1',
        detail: '123 Đường ABC'
      },
      items: [
        {
          productId: 'prod2',
          name: 'Adidas Ultraboost 22',
          size: '41',
          quantity: 2,
          price: 4200000
        }
      ],
      totalPrice: 8400000,
      status: 'shipping',
      note: 'Giao hàng nhanh',
      createdAt: '2024-01-20T09:15:00Z',
      updatedAt: '2024-01-22T11:45:00Z'
    },
    {
      _id: '3',
      userId: user?._id || '',
      customerInfo: {
        name: user?.userName || 'Khách hàng',
        email: user?.email || '',
        phone: user?.phone || ''
      },
      receiverInfo: {
        name: 'Nguyễn Văn B',
        email: 'receiver2@gmail.com',
        phone: '0907654321'
      },
      address: {
        province: 'Hà Nội',
        ward: 'Phường Láng Thượng, Đống Đa',
        detail: '456 Đường XYZ'
      },
      items: [
        {
          productId: 'prod3',
          name: 'Converse Chuck Taylor All Star',
          size: '40',
          quantity: 1,
          price: 1800000
        },
        {
          productId: 'prod4',
          name: 'Vans Old Skool',
          size: '41',
          quantity: 1,
          price: 2200000
        }
      ],
      totalPrice: 4000000,
      status: 'confirmed',
      note: '',
      createdAt: '2024-01-25T14:20:00Z',
      updatedAt: '2024-01-25T15:10:00Z'
    },
    {
      _id: '4',
      userId: user?._id || '',
      customerInfo: {
        name: user?.userName || 'Khách hàng',
        email: user?.email || '',
        phone: user?.phone || ''
      },
      receiverInfo: {
        name: 'Nguyễn Văn A',
        email: 'receiver@gmail.com',
        phone: '0901234567'
      },
      address: {
        province: 'TP.HCM',
        ward: 'Phường 5, Quận 3',
        detail: '789 Đường DEF'
      },
      items: [
        {
          productId: 'prod5',
          name: 'Puma RS-X',
          size: '43',
          quantity: 1,
          price: 2800000
        }
      ],
      totalPrice: 2800000,
      status: 'pending',
      note: 'Gọi trước khi giao hàng',
      createdAt: '2024-01-28T08:45:00Z',
      updatedAt: '2024-01-28T08:45:00Z'
    },
    {
      _id: '5',
      userId: user?._id || '',
      customerInfo: {
        name: user?.userName || 'Khách hàng',
        email: user?.email || '',
        phone: user?.phone || ''
      },
      receiverInfo: {
        name: 'Nguyễn Văn C',
        email: 'receiver3@gmail.com',
        phone: '0903456789'
      },
      address: {
        province: 'Đà Nẵng',
        ward: 'Phường Hải Châu 1, Hải Châu',
        detail: '101 Đường GHI'
      },
      items: [
        {
          productId: 'prod6',
          name: 'New Balance 574',
          size: '42',
          quantity: 2,
          price: 3200000
        }
      ],
      totalPrice: 6400000,
      status: 'cancelled',
      note: '',
      canceled: {
        by: 'customer',
        description: 'Thay đổi ý định mua hàng'
      },
      createdAt: '2024-01-18T16:30:00Z',
      updatedAt: '2024-01-19T10:15:00Z'
    }
  ], [user]);

  const fetchOrders = useCallback(async () => {
    setLoading(true);
    try {
      // TODO: Replace with actual API call
      // const response = await userService.getMyOrders();
      // setOrders(response.data);
      
      // Using mock data for now
      setTimeout(() => {
        setOrders(mockOrders);
        setFilteredOrders(mockOrders);
        setLoading(false);
      }, 1000);
    } catch {
      showToast('error', 'Không thể tải lịch sử đơn hàng');
      setLoading(false);
    }
  }, [mockOrders, showToast]);

  useEffect(() => {
    fetchOrders();
  }, [fetchOrders]);

  // Filter orders based on filters
  useEffect(() => {
    let filtered = [...orders];

    // Filter by status
    if (filters.status) {
      filtered = filtered.filter(order => order.status === filters.status);
    }

    // Filter by search (order ID or product name)
    if (filters.search) {
      const searchLower = filters.search.toLowerCase();
      filtered = filtered.filter(order => 
        order._id.toLowerCase().includes(searchLower) ||
        order.items.some(item => item.name.toLowerCase().includes(searchLower))
      );
    }

    // Filter by date range
    if (filters.dateRange && filters.dateRange.length === 2) {
      const [startDate, endDate] = filters.dateRange;
      filtered = filtered.filter(order => {
        const orderDate = new Date(order.createdAt);
        return orderDate >= startDate.toDate() && orderDate <= endDate.toDate();
      });
    }

    setFilteredOrders(filtered);
  }, [orders, filters]);

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
      <Tag color={statusMap[status as keyof typeof statusMap]?.color || 'default'}>
        {statusMap[status as keyof typeof statusMap]?.text || status}
      </Tag>
    );
  };

  const getOrderStatistics = () => {
    const stats = {
      total: orders.length,
      pending: orders.filter(o => o.status === 'pending').length,
      shipping: orders.filter(o => o.status === 'shipping').length,
      delivered: orders.filter(o => o.status === 'delivered').length,
      cancelled: orders.filter(o => o.status === 'cancelled').length,
      totalAmount: orders.reduce((sum, order) => sum + order.totalPrice, 0)
    };
    return stats;
  };

  const orderColumns = [
    {
      title: 'Mã đơn hàng',
      dataIndex: '_id',
      key: '_id',
      render: (id: string) => (
        <Text code>#{id.slice(-6).toUpperCase()}</Text>
      ),
    },
    {
      title: 'Ngày đặt',
      dataIndex: 'createdAt',
      key: 'createdAt',
      render: (date: string) => formatDate(date),
      sorter: (a: IOrder, b: IOrder) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime(),
    },
    {
      title: 'Tổng tiền',
      dataIndex: 'totalPrice',
      key: 'totalPrice',
      render: (price: number) => (
        <Text strong className="text-red-600">
          {formatCurrency(price)}
        </Text>
      ),
      sorter: (a: IOrder, b: IOrder) => a.totalPrice - b.totalPrice,
    },
    {
      title: 'Trạng thái',
      dataIndex: 'status',
      key: 'status',
      render: (status: string) => getStatusTag(status),
      filters: [
        { text: 'Chờ xác nhận', value: 'pending' },
        { text: 'Đã xác nhận', value: 'confirmed' },
        { text: 'Đang chuẩn bị', value: 'preparing' },
        { text: 'Đang giao hàng', value: 'shipping' },
        { text: 'Đã giao hàng', value: 'delivered' },
        { text: 'Đã hủy', value: 'cancelled' },
      ],
      onFilter: (value: string | number | boolean, record: IOrder) => record.status === value,
    },
    {
      title: 'Thao tác',
      key: 'action',
      render: (_: unknown, record: IOrder) => (
        <Space>
          <Button
            type="link"
            icon={<EyeOutlined />}
            onClick={() => navigate(`/orders/${record._id}`)}
          >
            Chi tiết
          </Button>
        </Space>
      ),
    },
  ];

  const stats = getOrderStatistics();

  return (
    <div className="container mx-auto px-4 py-6">
      <div className="mb-6">
        <Title level={3}>Lịch sử đơn hàng</Title>
        <Text type="secondary">Quản lý và theo dõi tất cả đơn hàng của bạn</Text>
      </div>

      {/* Statistics Cards */}
      <Row gutter={[16, 16]} className="mb-6">
        <Col xs={12} sm={8} lg={4}>
          <Card size="small" className="text-center">
            <Text type="secondary" className="text-xs">Tổng đơn hàng</Text>
            <div className="text-2xl font-bold text-blue-600">{stats.total}</div>
          </Card>
        </Col>
        <Col xs={12} sm={8} lg={4}>
          <Card size="small" className="text-center">
            <Text type="secondary" className="text-xs">Đang giao</Text>
            <div className="text-2xl font-bold text-purple-600">{stats.shipping}</div>
          </Card>
        </Col>
        <Col xs={12} sm={8} lg={4}>
          <Card size="small" className="text-center">
            <Text type="secondary" className="text-xs">Hoàn thành</Text>
            <div className="text-2xl font-bold text-green-600">{stats.delivered}</div>
          </Card>
        </Col>
        <Col xs={12} sm={8} lg={4}>
          <Card size="small" className="text-center">
            <Text type="secondary" className="text-xs">Đã hủy</Text>
            <div className="text-2xl font-bold text-red-600">{stats.cancelled}</div>
          </Card>
        </Col>
        <Col xs={12} sm={8} lg={4}>
          <Card size="small" className="text-center">
            <Text type="secondary" className="text-xs">Tổng chi tiêu</Text>
            <div className="text-lg font-bold text-green-600">{formatCurrency(stats.totalAmount)}</div>
          </Card>
        </Col>
      </Row>

      {/* Filters */}
      <Card className="mb-6">
        <Row gutter={[16, 16]} align="middle">
          <Col xs={24} sm={12} md={6}>
            <Input
              placeholder="Tìm kiếm đơn hàng..."
              prefix={<SearchOutlined />}
              value={filters.search}
              onChange={(e) => setFilters(prev => ({ ...prev, search: e.target.value }))}
              allowClear
            />
          </Col>
          <Col xs={24} sm={12} md={6}>
            <Select
              placeholder="Trạng thái"
              value={filters.status || undefined}
              onChange={(value) => setFilters(prev => ({ ...prev, status: value || '' }))}
              allowClear
              className="w-full"
            >
              <Option value="pending">Chờ xác nhận</Option>
              <Option value="confirmed">Đã xác nhận</Option>
              <Option value="preparing">Đang chuẩn bị</Option>
              <Option value="shipping">Đang giao hàng</Option>
              <Option value="delivered">Đã giao hàng</Option>
              <Option value="cancelled">Đã hủy</Option>
            </Select>
          </Col>
          <Col xs={24} sm={12} md={8}>
            <RangePicker
              placeholder={['Từ ngày', 'Đến ngày']}
              value={filters.dateRange}
              onChange={(dates) => setFilters(prev => ({ ...prev, dateRange: dates }))}
              className="w-full"
            />
          </Col>
          <Col xs={24} sm={12} md={4}>
            <Space>
              <Button
                icon={<FilterOutlined />}
                onClick={() => setFilters({ status: '', dateRange: null, search: '' })}
              >
                Xóa bộ lọc
              </Button>
              <Button
                icon={<ReloadOutlined />}
                onClick={fetchOrders}
                loading={loading}
              >
                Tải lại
              </Button>
            </Space>
          </Col>
        </Row>
      </Card>

      {/* Orders Table */}
      <Card>
        <div className="mb-4 flex justify-between items-center">
          <Text strong>
            Hiển thị {filteredOrders.length} / {orders.length} đơn hàng
          </Text>
        </div>
        
        {loading ? (
          <div className="flex justify-center py-8">
            <Spin size="large" />
          </div>
        ) : filteredOrders.length > 0 ? (
          <Table
            dataSource={filteredOrders}
            columns={orderColumns}
            rowKey="_id"
            pagination={{
              pageSize: 10,
              showSizeChanger: true,
              showQuickJumper: true,
              showTotal: (total, range) => `${range[0]}-${range[1]} của ${total} đơn hàng`,
            }}
            scroll={{ x: 800 }}
          />
        ) : (
          <Empty 
            description="Không tìm thấy đơn hàng nào"
            image={Empty.PRESENTED_IMAGE_SIMPLE}
          />
        )}
      </Card>
    </div>
  );
};

export default MyOrders;