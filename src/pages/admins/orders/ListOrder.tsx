/* eslint-disable @typescript-eslint/no-unused-vars */
import { EyeOutlined, ReloadOutlined, FilterOutlined } from "@ant-design/icons";
import { Button, Input, Pagination, Table, Tag, Typography, Select, DatePicker, Card } from "antd";
import type { TableProps } from "antd";
import dayjs from "dayjs";
import { useCallback, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { TextCell } from "../../../components/common/TextCell";
import type { IResponse } from "../../../types/api";
import type { IOrder } from "../../../types/order";
// import { getMyOrders } from "../../../services/order.service";

const { Title } = Typography;
const { RangePicker } = DatePicker;

// Mock data cho demo giao diện
const mockOrders: IOrder[] = [
  {
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
      province: "Hà Nội",
      ward: "Phùng Khoang",
      detail: "Số 123, Phùng Khoang, Phường Trung Văn"
    },
    items: [
      {
        productId: "product1",
        name: "Giày thể thao Chitu 7 PRO Nam",
        size: "40",
        quantity: 2,
        price: 1590000
      }
    ],
    note: "Giao hàng trong giờ hành chính",
    status: "pending" as const,
    paymentStatus: "unpaid" as const,
    paymentMethod: "cod" as const,
    totalPrice: 3210000,
    createdAt: "2025-09-17T09:02:04.000Z",
    updatedAt: "2025-09-17T09:02:04.000Z"
  },
  {
    _id: "67123456789abcdef0123457",
    userId: "user123",
    customerInfo: {
      name: "Nguyễn Văn Duy",
      email: "admin@gmail.com",
      phone: "0123456789"
    },
    receiverInfo: {
      name: "Trần Thị Mai",
      email: "mai.tran@gmail.com",
      phone: "0987654321"
    },
    address: {
      province: "Hồ Chí Minh",
      ward: "Phường 1",
      detail: "456 Nguyễn Văn Cừ, Quận 5"
    },
    items: [
      {
        productId: "product2",
        name: "Giày Nike Air Force 1",
        size: "42",
        quantity: 1,
        price: 2500000
      }
    ],
    status: "confirmed" as const,
    paymentStatus: "paid" as const,
    paymentMethod: "vnpay" as const,
    totalPrice: 2530000,
    createdAt: "2025-09-19T01:06:16.000Z",
    updatedAt: "2025-09-19T01:06:16.000Z"
  },
  {
    _id: "67123456789abcdef0123458",
    userId: "user456",
    customerInfo: {
      name: "Lê Minh Tuấn",
      email: "tuan.le@gmail.com",
      phone: "0912345678"
    },
    receiverInfo: {
      name: "Lê Minh Tuấn",
      email: "tuan.le@gmail.com",
      phone: "0912345678"
    },
    address: {
      province: "Đà Nẵng",
      ward: "Hải Châu",
      detail: "789 Lê Duẩn, Quận Hải Châu"
    },
    items: [
      {
        productId: "product3",
        name: "Giày Adidas Ultraboost 22",
        size: "41",
        quantity: 1,
        price: 1800000
      },
      {
        productId: "product4",
        name: "Tất thể thao Nike",
        size: "M",
        quantity: 3,
        price: 150000
      }
    ],
    status: "shipping" as const,
    paymentStatus: "paid" as const,
    paymentMethod: "banking" as const,
    totalPrice: 2250000,
    createdAt: "2025-09-20T14:30:00.000Z",
    updatedAt: "2025-09-20T14:30:00.000Z"
  },
  {
    _id: "67123456789abcdef0123459",
    userId: "user789",
    customerInfo: {
      name: "Phạm Thị Lan",
      email: "lan.pham@gmail.com",
      phone: "0934567890"
    },
    receiverInfo: {
      name: "Phạm Thị Lan",
      email: "lan.pham@gmail.com",
      phone: "0934567890"
    },
    address: {
      province: "Cần Thơ",
      ward: "Ninh Kiều",
      detail: "321 Trần Hưng Đạo, Quận Ninh Kiều"
    },
    items: [
      {
        productId: "product5",
        name: "Giày Converse Chuck Taylor",
        size: "38",
        quantity: 2,
        price: 1200000
      }
    ],
    status: "delivered" as const,
    paymentStatus: "paid" as const,
    paymentMethod: "cod" as const,
    totalPrice: 2430000,
    createdAt: "2025-09-18T11:15:30.000Z",
    updatedAt: "2025-09-21T09:45:00.000Z"
  },
  {
    _id: "67123456789abcdef012345a",
    userId: "user101",
    customerInfo: {
      name: "Hoàng Văn Nam",
      email: "nam.hoang@gmail.com",
      phone: "0956789012"
    },
    receiverInfo: {
      name: "Hoàng Văn Nam",
      email: "nam.hoang@gmail.com",
      phone: "0956789012"
    },
    address: {
      province: "Hải Phòng",
      ward: "Lê Chân",
      detail: "654 Điện Biên Phủ, Quận Lê Chân"
    },
    items: [
      {
        productId: "product6",
        name: "Giày Vans Old Skool",
        size: "43",
        quantity: 1,
        price: 1350000
      }
    ],
    canceled: {
      by: "customer",
      description: "Khách hàng thay đổi ý định"
    },
    status: "cancelled" as const,
    paymentStatus: "refunded" as const,
    paymentMethod: "momo" as const,
    totalPrice: 1380000,
    createdAt: "2025-09-16T16:20:45.000Z",
    updatedAt: "2025-09-17T10:30:00.000Z"
  }
];

const mockResponse: IResponse<IOrder[]> = {
  docs: mockOrders,
  totalDocs: 5,
  limit: 10,
  totalPages: 1,
  page: 1,
  pagingCounter: 1,
  hasPrevPage: false,
  hasNextPage: false,
  prevPage: null,
  nextPage: null
};

export default function ListOrder() {
  const navigate = useNavigate();
  const [data, setData] = useState<IResponse<IOrder[]> | null>(null);
  const [isLoading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [inputValue, setInputValue] = useState("");
  const [textSearch, setTextSearch] = useState("");
  const [sortBy, setSortBy] = useState("createdAt");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");
  
  // Filter states
  const [statusFilter, setStatusFilter] = useState<string | undefined>(undefined);
  const [paymentStatusFilter, setPaymentStatusFilter] = useState<string | undefined>(undefined);
  const [dateRange, setDateRange] = useState<[dayjs.Dayjs, dayjs.Dayjs] | null>(null);
  const [showFilters, setShowFilters] = useState(false);

  const fetchOrders = useCallback(async (params?: {
    page?: number;
    limit?: number;
    search?: string;
    searchField?: string;
    sortBy?: string;
    sortOrder?: 'asc' | 'desc';
    status?: string;
    paymentStatus?: string;
    startDate?: string;
    endDate?: string;
  }) => {
    setLoading(true);
    try {
      // Comment API call để sử dụng mock data
      // const response = await getMyOrders(params);
      
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 800));
      
      // Filter mock data based on search and filters
      let filteredOrders = mockOrders;
      
      // Search filter
      if (params?.search) {
        const searchLower = params.search.toLowerCase();
        filteredOrders = filteredOrders.filter(order => 
          order.customerInfo.name.toLowerCase().includes(searchLower) ||
          order.customerInfo.email.toLowerCase().includes(searchLower)
        );
      }
      
      // Status filter
      if (params?.status) {
        filteredOrders = filteredOrders.filter(order => order.status === params.status);
      }
      
      // Payment status filter
      if (params?.paymentStatus) {
        filteredOrders = filteredOrders.filter(order => order.paymentStatus === params.paymentStatus);
      }
      

      if (params?.startDate && params?.endDate) {
        const startDate = dayjs(params.startDate);
        const endDate = dayjs(params.endDate);
        filteredOrders = filteredOrders.filter(order => {
          const orderDate = dayjs(order.createdAt);
          return orderDate.isAfter(startDate) && orderDate.isBefore(endDate.add(1, 'day'));
        });
      }
      

      const startIndex = ((params?.page || 1) - 1) * (params?.limit || 10);
      const endIndex = startIndex + (params?.limit || 10);
      const paginatedOrders = filteredOrders.slice(startIndex, endIndex);
      
      const response: IResponse<IOrder[]> = {
        docs: paginatedOrders,
        totalDocs: filteredOrders.length,
        limit: params?.limit || 10,
        totalPages: Math.ceil(filteredOrders.length / (params?.limit || 10)),
        page: params?.page || 1,
        pagingCounter: startIndex + 1,
        hasPrevPage: (params?.page || 1) > 1,
        hasNextPage: endIndex < filteredOrders.length,
        prevPage: null,
        nextPage: null
      };
      
      setData(response);
    } catch (error) {
      console.error('Error fetching orders:', error);
    } finally {
      setLoading(false);
    }
  }, []);

  // Debounce search input
  useEffect(() => {
    const timeout = setTimeout(() => {
      setTextSearch(inputValue.trim());
      setPage(1);
    }, 500);
    return () => clearTimeout(timeout);
  }, [inputValue]);

  // Fetch data when page, search, sort, filters change
  useEffect(() => {
    const params: {
      page?: number;
      limit?: number;
      search?: string;
      searchField?: string;
      sortBy?: string;
      sortOrder?: 'asc' | 'desc';
      status?: string;
      paymentStatus?: string;
      startDate?: string;
      endDate?: string;
    } = { page, sortBy, sortOrder };
    
    if (textSearch) {
      params.searchField = "customerInfo.name,customerInfo.email";
      params.search = textSearch;
    }
    
    if (statusFilter) {
      params.status = statusFilter;
    }
    
    if (paymentStatusFilter) {
      params.paymentStatus = paymentStatusFilter;
    }
    
    if (dateRange) {
      params.startDate = dateRange[0].format('YYYY-MM-DD');
      params.endDate = dateRange[1].format('YYYY-MM-DD');
    }
    
    fetchOrders(params);
  }, [page, textSearch, sortBy, sortOrder, statusFilter, paymentStatusFilter, dateRange, fetchOrders]);

  // Handle table sort
  const handleTableChange: TableProps<IOrder>['onChange'] = (_pagination, _filters, sorter) => {
    if (sorter && !Array.isArray(sorter) && sorter.field) {
      setSortBy(String(sorter.field));
      setSortOrder(sorter.order === "ascend" ? "asc" : "desc");
    }
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

  // Get payment status color
  const getPaymentStatusColor = (paymentStatus: string) => {
    switch (paymentStatus) {
      case "unpaid": return "orange";
      case "paid": return "green";
      case "refunded": return "blue";
      case "failed": return "red";
      default: return "default";
    }
  };

  // Get payment status text
  const getPaymentStatusText = (paymentStatus: string) => {
    switch (paymentStatus) {
      case "unpaid": return "Chưa thanh toán";
      case "paid": return "Đã thanh toán";
      case "refunded": return "Đã hoàn tiền";
      case "failed": return "Thanh toán thất bại";
      default: return paymentStatus;
    }
  };

  // Get payment method text
  const getPaymentMethodText = (paymentMethod: string) => {
    switch (paymentMethod) {
      case "cod": return "Thanh toán khi nhận hàng";
      case "vnpay": return "VNPay";
      case "momo": return "MoMo";
      case "banking": return "Chuyển khoản ngân hàng";
      default: return paymentMethod;
    }
  };

  // Calculate order statistics
  const getOrderStatistics = () => {
    const stats = mockOrders.reduce((acc, order) => {
      acc[order.status] = (acc[order.status] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);
    
    const paymentStats = mockOrders.reduce((acc, order) => {
      if (order.paymentStatus) {
        acc[order.paymentStatus] = (acc[order.paymentStatus] || 0) + 1;
      }
      return acc;
    }, {} as Record<string, number>);
    
    return {
      total: mockOrders.length,
      pending: stats.pending || 0,
      confirmed: stats.confirmed || 0,
      shipping: stats.shipping || 0,
      delivered: stats.delivered || 0,
      done: stats.done || 0,
      cancelled: stats.cancelled || 0,
      unpaid: paymentStats.unpaid || 0,
      paid: paymentStats.paid || 0,
      refunded: paymentStats.refunded || 0,
      failed: paymentStats.failed || 0,
    };
  };

  const orderStats = getOrderStatistics();

  // Format currency
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND'
    }).format(amount);
  };

  const columns = [
    {
      title: "Mã đơn hàng",
      key: "orderCode",
      width: 150,
      render: (_: unknown, record: IOrder) => (
        <TextCell 
          text={`#${record._id.slice(-8).toUpperCase()}`} 
          textClass="font-mono text-sm break-all" 
        />
      ),
    },
    {
      title: "Tên khách hàng",
      dataIndex: ["customerInfo", "name"],
      key: "customerName",
      sorter: true,
      width: 180,
      render: (name: string) => (
        <TextCell text={name} textClass="font-semibold" />
      ),
    },
    {
      title: "Email",
      dataIndex: ["customerInfo", "email"],
      key: "customerEmail",
      width: 200,
      render: (email: string) => (
        <TextCell text={email} textClass="text-sm" />
      ),
    },
    {
      title: "Tổng tiền",
      dataIndex: "totalPrice",
      key: "totalPrice",
      sorter: true,
      width: 120,
      render: (total: number) => (
        <TextCell 
          text={formatCurrency(total)} 
          textClass="font-semibold text-blue-600" 
        />
      ),
    },
    {
      title: "Trạng thái đơn hàng",
      dataIndex: "status",
      key: "status",
      width: 150,
      render: (status: string) => (
        <Tag color={getStatusColor(status)}>
          {getStatusText(status)}
        </Tag>
      ),
    },
    {
      title: "Trạng thái thanh toán",
      dataIndex: "paymentStatus",
      key: "paymentStatus",
      width: 160,
      render: (paymentStatus: string) => (
        <Tag color={getPaymentStatusColor(paymentStatus)}>
          {getPaymentStatusText(paymentStatus)}
        </Tag>
      ),
    },
    {
      title: "Phương thức thanh toán",
      dataIndex: "paymentMethod",
      key: "paymentMethod",
      width: 180,
      render: (paymentMethod: string) => (
        <TextCell 
          text={getPaymentMethodText(paymentMethod)} 
          textClass="text-sm" 
        />
      ),
    },
    {
      title: "Ngày đặt hàng",
      dataIndex: "createdAt",
      key: "createdAt",
      sorter: true,
      width: 150,
      render: (createdAt: string) => (
        <TextCell
          text={dayjs(createdAt).format("DD/MM/YYYY HH:mm")}
          textClass="text-sm"
        />
      ),
    },
    {
      title: "Thao tác",
      key: "action",
      width: 120,
      render: (_: unknown, record: IOrder) => (
        <Button 
          type="primary"
          size="small"
          icon={<EyeOutlined />}
          onClick={() => navigate(`/admin/orders/${record._id}`)}
        >
          Xem chi tiết
        </Button>
      ),
    },
  ];

  return (
    <div className="py-4 mt-4 shadow-lg px-4 rounded-lg w-full min-h-[95vh]">
      <Title level={3}>Quản Lý Đơn Hàng</Title>

      {/* Order Statistics */}
      <div className="space-y-4 mt-4">
        <div>
          <Title level={5} className="mb-3">Thống kê trạng thái đơn hàng</Title>
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-4">
            <Card size="small" className="text-center">
              <div className="text-2xl font-bold text-blue-600">{orderStats.total}</div>
              <div className="text-sm text-gray-600">Tổng đơn hàng</div>
            </Card>
            <Card size="small" className="text-center">
              <div className="text-2xl font-bold text-orange-600">{orderStats.pending}</div>
              <div className="text-sm text-gray-600">Chờ xác nhận</div>
            </Card>
            <Card size="small" className="text-center">
              <div className="text-2xl font-bold text-blue-600">{orderStats.confirmed}</div>
              <div className="text-sm text-gray-600">Đã xác nhận</div>
            </Card>
            <Card size="small" className="text-center">
              <div className="text-2xl font-bold text-cyan-600">{orderStats.shipping}</div>
              <div className="text-sm text-gray-600">Đang giao</div>
            </Card>
            <Card size="small" className="text-center">
              <div className="text-2xl font-bold text-green-600">{orderStats.delivered}</div>
              <div className="text-sm text-gray-600">Đã giao</div>
            </Card>
            <Card size="small" className="text-center">
              <div className="text-2xl font-bold text-green-700">{orderStats.done}</div>
              <div className="text-sm text-gray-600">Hoàn thành</div>
            </Card>
            <Card size="small" className="text-center">
              <div className="text-2xl font-bold text-red-600">{orderStats.cancelled}</div>
              <div className="text-sm text-gray-600">Đã hủy</div>
            </Card>
          </div>
        </div>

        <div>
          <Title level={5} className="mb-3">Thống kê trạng thái thanh toán</Title>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <Card size="small" className="text-center">
              <div className="text-2xl font-bold text-orange-600">{orderStats.unpaid}</div>
              <div className="text-sm text-gray-600">Chưa thanh toán</div>
            </Card>
            <Card size="small" className="text-center">
              <div className="text-2xl font-bold text-green-600">{orderStats.paid}</div>
              <div className="text-sm text-gray-600">Đã thanh toán</div>
            </Card>
            <Card size="small" className="text-center">
              <div className="text-2xl font-bold text-blue-600">{orderStats.refunded}</div>
              <div className="text-sm text-gray-600">Đã hoàn tiền</div>
            </Card>
            <Card size="small" className="text-center">
              <div className="text-2xl font-bold text-red-600">{orderStats.failed}</div>
              <div className="text-sm text-gray-600">Thanh toán thất bại</div>
            </Card>
          </div>
        </div>
      </div>

      <div className="mt-6 space-y-4">

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Input.Search
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              style={{ width: "400px" }}
              placeholder="Tìm kiếm theo tên khách hàng, email..."
              allowClear
            />
            <Button 
              icon={<FilterOutlined />}
              onClick={() => setShowFilters(!showFilters)}
              type={showFilters ? "primary" : "default"}
            >
              Bộ lọc
            </Button>
          </div>
          <Button 
            icon={<ReloadOutlined />}
            onClick={() => {
              setStatusFilter(undefined);
              setPaymentStatusFilter(undefined);
              setDateRange(null);
              setInputValue("");
              fetchOrders();
            }}
            loading={isLoading}
          >
            Làm mới
          </Button>
        </div>

        {/* Filters Panel */}
        {showFilters && (
          <Card size="small">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div>
                <label className="block text-sm font-medium mb-2">Trạng thái đơn hàng</label>
                <Select
                  style={{ width: "100%" }}
                  placeholder="Chọn trạng thái"
                  allowClear
                  value={statusFilter}
                  onChange={setStatusFilter}
                  options={[
                    { value: 'pending', label: 'Chờ xác nhận' },
                    { value: 'confirmed', label: 'Đã xác nhận' },
                    { value: 'shipping', label: 'Đang giao' },
                    { value: 'delivered', label: 'Đã giao' },
                    { value: 'done', label: 'Hoàn thành' },
                    { value: 'cancelled', label: 'Đã hủy' },
                  ]}
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-2">Trạng thái thanh toán</label>
                <Select
                  style={{ width: "100%" }}
                  placeholder="Chọn trạng thái thanh toán"
                  allowClear
                  value={paymentStatusFilter}
                  onChange={setPaymentStatusFilter}
                  options={[
                    { value: 'unpaid', label: 'Chưa thanh toán' },
                    { value: 'paid', label: 'Đã thanh toán' },
                    { value: 'refunded', label: 'Đã hoàn tiền' },
                    { value: 'failed', label: 'Thanh toán thất bại' },
                  ]}
                />
              </div>
              
              
              <div className="flex items-end">
                <Button 
                  onClick={() => {
                    setStatusFilter(undefined);
                    setPaymentStatusFilter(undefined);
                    setDateRange(null);
                  }}
                >
                  Xóa bộ lọc
                </Button>
              </div>
            </div>
          </Card>
        )}
      </div>

      <div className="mt-6">
        <Table
          loading={isLoading}
          bordered
          dataSource={data ? data.docs : []}
          columns={columns}
          pagination={false}
          rowKey="_id"
          onChange={handleTableChange}
          scroll={{ x: 1000 }}
        />
        
        {data && data.totalDocs > 0 && (
          <div className="mt-6">
            <Pagination
              align="end"
              current={page}
              total={data.totalDocs}
              pageSize={data.limit}
              onChange={(p) => setPage(p)}
              showSizeChanger={false}
              showQuickJumper
              showTotal={(total, range) => 
                `${range[0]}-${range[1]} của ${total} đơn hàng`
              }
            />
          </div>
        )}
      </div>
    </div>
  );
}