/* eslint-disable @typescript-eslint/no-unused-vars */
import { EyeOutlined, ReloadOutlined, FilterOutlined } from "@ant-design/icons";
import {
  Button,
  Input,
  Pagination,
  Table,
  Tag,
  Typography,
  Select,
  DatePicker,
  Card,
} from "antd";
import type { TableProps } from "antd";
import dayjs from "dayjs";
import { useCallback, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { TextCell } from "../../../components/common/TextCell";
import type { IResponse } from "../../../types/api";
import type { IOrder } from "../../../types/order";
import { getAllOrders } from "../../../services/order.service";

const { Title } = Typography;
const { RangePicker } = DatePicker;

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
  const [statusFilter, setStatusFilter] = useState<string | undefined>(
    undefined
  );
  const [paymentStatusFilter, setPaymentStatusFilter] = useState<
    boolean | undefined
  >(undefined);
  const [dateRange, setDateRange] = useState<[dayjs.Dayjs, dayjs.Dayjs] | null>(
    null
  );
  const [showFilters, setShowFilters] = useState(false);

  const fetchOrders = useCallback(
    async (params?: {
      page?: number;
      limit?: number;
      search?: string;
      searchField?: string;
      sortBy?: string;
      sortOrder?: "asc" | "desc";
      status?: string;
      isPaid?: boolean;
      paymentMethod?: string;
      startDate?: string;
      endDate?: string;
    }) => {
      setLoading(true);
      try {
        const response = await getAllOrders(params);
        setData(response);
      } catch (error) {
        console.error("Error fetching orders:", error);
      } finally {
        setLoading(false);
      }
    },
    []
  );

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
      sortOrder?: "asc" | "desc";
      status?: string;
      isPaid?: boolean;
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

    if (paymentStatusFilter !== undefined) {
      params.isPaid = paymentStatusFilter;
    }

    if (dateRange) {
      params.startDate = dateRange[0].format("YYYY-MM-DD");
      params.endDate = dateRange[1].format("YYYY-MM-DD");
    }

    fetchOrders(params);
  }, [
    page,
    textSearch,
    sortBy,
    sortOrder,
    statusFilter,
    paymentStatusFilter,
    dateRange,
    fetchOrders,
  ]);

  // Handle table sort
  const handleTableChange: TableProps<IOrder>["onChange"] = (
    _pagination,
    _filters,
    sorter
  ) => {
    if (sorter && !Array.isArray(sorter) && sorter.field) {
      setSortBy(String(sorter.field));
      setSortOrder(sorter.order === "ascend" ? "asc" : "desc");
    }
  };

  // Get status color
  const getStatusColor = (status: string) => {
    switch (status) {
      case "pending":
        return "orange";
      case "confirmed":
        return "blue";
      case "shipping":
        return "cyan";
      case "delivered":
        return "green";
      case "done":
        return "success";
      case "cancelled":
        return "red";
      default:
        return "default";
    }
  };

  // Get status text
  const getStatusText = (status: string) => {
    switch (status) {
      case "pending":
        return "Chờ xác nhận";
      case "confirmed":
        return "Đã xác nhận";
      case "shipping":
        return "Đang giao";
      case "delivered":
        return "Đã giao";
      case "done":
        return "Hoàn thành";
      case "cancelled":
        return "Đã hủy";
      default:
        return status;
    }
  };

  // Get payment status color based on isPaid
  const getPaymentStatusColor = (isPaid: boolean) => {
    return isPaid ? "green" : "orange";
  };

  // Get payment status text based on isPaid
  const getPaymentStatusText = (isPaid: boolean) => {
    return isPaid ? "Đã thanh toán" : "Chưa thanh toán";
  };

  // Get payment method text
  const getPaymentMethodText = (paymentMethod: string) => {
    switch (paymentMethod) {
      case "cod":
        return "Thanh toán khi nhận hàng";
      case "online":
        return "Thanh toán online";
      default:
        return paymentMethod || "Chưa xác định";
    }
  };

  // Calculate order statistics
  const getOrderStatistics = () => {
    if (!data || !data.docs) {
      return {
        total: 0,
        pending: 0,
        confirmed: 0,
        shipping: 0,
        delivered: 0,
        done: 0,
        cancelled: 0,
        unpaid: 0,
        paid: 0,
        refunded: 0,
        failed: 0,
      };
    }

    const stats = data.docs.reduce((acc, order) => {
      // Check if order is cancelled (by status or by having cancel info)
      if (order.status === 'cancelled' || (order.canceled && order.canceled.description)) {
        acc.cancelled = (acc.cancelled || 0) + 1;
      } else {
        acc[order.status] = (acc[order.status] || 0) + 1;
      }
      return acc;
    }, {} as Record<string, number>);

    const paymentStats = data.docs.reduce((acc, order) => {
      if (order.isPaid) {
        acc.paid = (acc.paid || 0) + 1;
      } else {
        acc.unpaid = (acc.unpaid || 0) + 1;
      }
      return acc;
    }, {} as Record<string, number>);

    return {
      total: data.totalDocs,
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
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
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
      title: "Người nhận hàng",
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
      render: (email: string) => <TextCell text={email} textClass="text-sm" />,
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
      render: (status: string, record: IOrder) => {
        // If order has cancel info, show as cancelled
        const effectiveStatus = (record.canceled && record.canceled.description) ? 'cancelled' : status;
        return (
          <Tag color={getStatusColor(effectiveStatus)}>{getStatusText(effectiveStatus)}</Tag>
        );
      },
    },
    {
      title: "Trạng thái thanh toán",
      dataIndex: "isPaid",
      key: "isPaid",
      width: 160,
      render: (isPaid: boolean) => (
        <Tag color={getPaymentStatusColor(isPaid)}>
          {getPaymentStatusText(isPaid)}
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
          text={getPaymentMethodText(paymentMethod || 'Chưa xác định')}
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
          <Title level={5} className="mb-3">
            Thống kê trạng thái đơn hàng
          </Title>
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-4">
            <Card size="small" className="text-center">
              <div className="text-2xl font-bold text-blue-600">
                {orderStats.total}
              </div>
              <div className="text-sm text-gray-600">Tổng đơn hàng</div>
            </Card>
            <Card size="small" className="text-center">
              <div className="text-2xl font-bold text-orange-600">
                {orderStats.pending}
              </div>
              <div className="text-sm text-gray-600">Chờ xác nhận</div>
            </Card>
            <Card size="small" className="text-center">
              <div className="text-2xl font-bold text-blue-600">
                {orderStats.confirmed}
              </div>
              <div className="text-sm text-gray-600">Đã xác nhận</div>
            </Card>
            <Card size="small" className="text-center">
              <div className="text-2xl font-bold text-cyan-600">
                {orderStats.shipping}
              </div>
              <div className="text-sm text-gray-600">Đang giao</div>
            </Card>
            <Card size="small" className="text-center">
              <div className="text-2xl font-bold text-green-600">
                {orderStats.delivered}
              </div>
              <div className="text-sm text-gray-600">Đã giao</div>
            </Card>
            <Card size="small" className="text-center">
              <div className="text-2xl font-bold text-green-700">
                {orderStats.done}
              </div>
              <div className="text-sm text-gray-600">Hoàn thành</div>
            </Card>
            <Card size="small" className="text-center">
              <div className="text-2xl font-bold text-red-600">
                {orderStats.cancelled}
              </div>
              <div className="text-sm text-gray-600">Đã hủy</div>
            </Card>
          </div>
        </div>

        <div>
          <Title level={5} className="mb-3">
            Thống kê trạng thái thanh toán
          </Title>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <Card size="small" className="text-center">
              <div className="text-2xl font-bold text-orange-600">
                {orderStats.unpaid}
              </div>
              <div className="text-sm text-gray-600">Chưa thanh toán</div>
            </Card>
            <Card size="small" className="text-center">
              <div className="text-2xl font-bold text-green-600">
                {orderStats.paid}
              </div>
              <div className="text-sm text-gray-600">Đã thanh toán</div>
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
                <label className="block text-sm font-medium mb-2">
                  Trạng thái đơn hàng
                </label>
                <Select
                  style={{ width: "100%" }}
                  placeholder="Chọn trạng thái"
                  allowClear
                  value={statusFilter}
                  onChange={setStatusFilter}
                  options={[
                    { value: "pending", label: "Chờ xác nhận" },
                    { value: "confirmed", label: "Đã xác nhận" },
                    { value: "shipping", label: "Đang giao" },
                    { value: "delivered", label: "Đã giao" },
                    { value: "done", label: "Hoàn thành" },
                    { value: "cancelled", label: "Đã hủy" },
                  ]}
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">
                  Trạng thái thanh toán
                </label>
                <Select
                  style={{ width: "100%" }}
                  placeholder="Chọn trạng thái thanh toán"
                  allowClear
                  value={paymentStatusFilter}
                  onChange={setPaymentStatusFilter}
                  options={[
                    { value: false, label: "Chưa thanh toán" },
                    { value: true, label: "Đã thanh toán" },
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
