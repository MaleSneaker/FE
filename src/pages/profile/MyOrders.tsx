import { useState, useEffect, useCallback } from "react";
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
  Input,
  Pagination,
} from "antd";
import { EyeOutlined, SearchOutlined, ReloadOutlined } from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import { useToast } from "../../context/ToastProvider";
import { formatCurrency, formatDate } from "../../utils";
import { getMyOrders } from "../../services/order.service";
import type { IOrder, IUserInfo } from "../../types/order";
import type { IResponse } from "../../types/api";
import type { ColumnsType } from "antd/es/table";

const { Title, Text } = Typography;
const { Option } = Select;

export default function MyOrders() {
  const navigate = useNavigate();
  const showToast = useToast();
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState<IResponse<IOrder[]> | null>(null);
  const [page, setPage] = useState(1);
  const [filters, setFilters] = useState({
    status: "",
    search: "",
  });

  const fetchOrders = useCallback(async () => {
    setLoading(true);
    try {
      const params = {
        page,
        limit: 10,
        search: filters.search || undefined,
        searchField: filters.search
          ? "receiverInfo.name,receiverInfo.email,receiverInfo.phone"
          : undefined,
        status: filters.status || undefined,
        sortBy: "createdAt",
        sortOrder: "desc" as const,
      };

      const response = await getMyOrders(params);
      console.log(response);
      // Ensure response has the expected structure
      if (response && typeof response === "object") {
        setData({
          docs: Array.isArray(response.docs) ? response.docs : [],
          totalDocs: response.totalDocs || 0,
          limit: response.limit || 10,
          totalPages: response.totalPages || 0,
          page: response.page || 1,
          pagingCounter: response.pagingCounter || 0,
          hasPrevPage: response.hasPrevPage || false,
          hasNextPage: response.hasNextPage || false,
          prevPage: response.prevPage || null,
          nextPage: response.nextPage || null,
        });
      } else {
        setData({
          docs: [],
          totalDocs: 0,
          limit: 10,
          totalPages: 0,
          page: 1,
          pagingCounter: 0,
          hasPrevPage: false,
          hasNextPage: false,
          prevPage: null,
          nextPage: null,
        });
      }
    } catch (error) {
      console.error("Error fetching orders:", error);
      showToast("error", "Không thể tải lịch sử đơn hàng");
      // Set empty data on error
      setData({
        docs: [],
        totalDocs: 0,
        limit: 10,
        totalPages: 0,
        page: 1,
        pagingCounter: 0,
        hasPrevPage: false,
        hasNextPage: false,
        prevPage: null,
        nextPage: null,
      });
    } finally {
      setLoading(false);
    }
  }, [page, filters, showToast]);

  useEffect(() => {
    fetchOrders();
  }, [fetchOrders]);

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
        return "Đang giao hàng";
      case "delivered":
        return "Đã giao hàng";
      case "done":
        return "Hoàn thành";
      case "cancelled":
        return "Đã hủy";
      default:
        return status;
    }
  };

  const getOrderStatistics = () => {
    if (!data || !data.docs || !Array.isArray(data.docs)) {
      return {
        total: 0,
        pending: 0,
        confirmed: 0,
        shipping: 0,
        delivered: 0,
        done: 0,
        cancelled: 0,
      };
    }

    const stats = data.docs.reduce((acc, order) => {
      if (order) {
        // Check if order is cancelled (by status or by having cancel info)
        if (order.status === 'cancelled' || (order.canceled && order.canceled.description)) {
          acc.cancelled = (acc.cancelled || 0) + 1;
        } else if (order.status) {
          acc[order.status] = (acc[order.status] || 0) + 1;
        }
      }
      return acc;
    }, {} as Record<string, number>);

    return {
      total: data.totalDocs || 0,
      pending: stats.pending || 0,
      confirmed: stats.confirmed || 0,
      shipping: stats.shipping || 0,
      delivered: stats.delivered || 0,
      done: stats.done || 0,
      cancelled: stats.cancelled || 0,
    };
  };

  const orderStats = getOrderStatistics();

  // Get payment status text and color
  const getPaymentStatusText = (isPaid: boolean) => {
    return isPaid ? "Đã thanh toán" : "Chưa thanh toán";
  };

  const getPaymentStatusColor = (isPaid: boolean) => {
    return isPaid ? "green" : "orange";
  };

  const getPaymentMethodText = (method: string) => {
    switch (method) {
      case "cod":
        return "Thanh toán khi nhận hàng";
      case "online":
        return "Thanh toán online";
      default:
        return method;
    }
  };

  const orderColumns: ColumnsType<IOrder> = [
    {
      title: "Mã đơn hàng",
      dataIndex: "_id",
      key: "_id",
      width: 120,
      render: (id: string) => <Text code>#{id?.slice(-8).toUpperCase() || 'N/A'}</Text>,
    },
    {
      title: "Người nhận hàng",
      dataIndex: "receiverInfo",
      key: "receiverInfo",
      width: 160,
      render: (receiverInfo: IUserInfo) => (
        <div>
          <Text strong>{receiverInfo?.name || 'Chưa cập nhật'}</Text>
          <br />
          <Text type="secondary" className="text-sm">
            {receiverInfo?.phone || 'Chưa có SĐT'}
          </Text>
        </div>
      ),
    },
    {
      title: "Tổng tiền",
      dataIndex: "totalPrice",
      key: "totalPrice",
      width: 120,
      render: (amount: number) => (
        <Text strong className="text-red-600">
          {formatCurrency(amount)}
        </Text>
      ),
      sorter: (a: IOrder, b: IOrder) => a.totalPrice - b.totalPrice,
    },
    {
      title: "Phương thức thanh toán",
      dataIndex: "paymentMethod",
      key: "paymentMethod",
      width: 180,
      render: (method: string) => (
        <Text>{getPaymentMethodText(method)}</Text>
      ),
    },
    {
      title: "Trạng thái thanh toán",
      dataIndex: "isPaid",
      key: "isPaid",
      width: 150,
      render: (isPaid: boolean) => (
        <Tag color={getPaymentStatusColor(isPaid)}>
          {getPaymentStatusText(isPaid)}
        </Tag>
      ),
    },
    {
      title: "Trạng thái đơn hàng",
      dataIndex: "status",
      key: "status",
      width: 140,
      render: (status: string, record: IOrder) => {
        // If order has cancel info, show as cancelled
        const effectiveStatus = (record.canceled && record.canceled.description) ? 'cancelled' : status;
        return (
          <Tag color={getStatusColor(effectiveStatus)}>{getStatusText(effectiveStatus)}</Tag>
        );
      },
    },
    {
      title: "Ngày đặt hàng",
      dataIndex: "createdAt",
      key: "createdAt",
      width: 120,
      render: (date: string) => formatDate(date),
      sorter: (a: IOrder, b: IOrder) =>
        new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime(),
    },
    {
      title: "Thao tác",
      key: "action",
      width: 120,
      fixed: 'right' as const,
      render: (_: unknown, record: IOrder) => (
        <Button
          type="primary"
          size="small"
          icon={<EyeOutlined />}
          onClick={() => navigate(`/orders/${record._id}`)}
        >
          Xem chi tiết
        </Button>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      <Card>
        <Title level={4} className="mb-4">
          Lịch sử đơn hàng
        </Title>

        {/* Order Statistics */}
        <div className="mb-6">
          <Row gutter={[16, 16]}>
            <Col xs={24} sm={12} md={6}>
              <Card size="small" className="text-center">
                <div className="text-2xl font-bold text-blue-600">
                  {orderStats.total}
                </div>
                <div className="text-sm text-gray-600">Tổng đơn hàng</div>
              </Card>
            </Col>
            <Col xs={24} sm={12} md={6}>
              <Card size="small" className="text-center">
                <div className="text-2xl font-bold text-orange-600">
                  {orderStats.pending}
                </div>
                <div className="text-sm text-gray-600">Chờ xác nhận</div>
              </Card>
            </Col>
            <Col xs={24} sm={12} md={6}>
              <Card size="small" className="text-center">
                <div className="text-2xl font-bold text-cyan-600">
                  {orderStats.shipping}
                </div>
                <div className="text-sm text-gray-600">Đang giao</div>
              </Card>
            </Col>
            <Col xs={24} sm={12} md={6}>
              <Card size="small" className="text-center">
                <div className="text-2xl font-bold text-green-600">
                  {orderStats.delivered + orderStats.done}
                </div>
                <div className="text-sm text-gray-600">Đã hoàn thành</div>
              </Card>
            </Col>
          </Row>
        </div>

        {/* Filters */}
        <div className="mb-4">
          <Row gutter={[16, 16]} align="middle">
            <Col xs={24} sm={12} md={10}>
              <Input
                placeholder="Tìm kiếm theo tên người nhận, email..."
                prefix={<SearchOutlined />}
                value={filters.search}
                onChange={(e) =>
                  setFilters((prev) => ({ ...prev, search: e.target.value }))
                }
                allowClear
                size="large"
              />
            </Col>
            <Col xs={24} sm={12} md={8}>
              <Select
                placeholder="Lọc theo trạng thái"
                style={{ width: "100%" }}
                allowClear
                value={filters.status || undefined}
                onChange={(value) =>
                  setFilters((prev) => ({ ...prev, status: value || "" }))
                }
                size="large"
              >
                <Option value="pending">Chờ xác nhận</Option>
                <Option value="confirmed">Đã xác nhận</Option>
                <Option value="shipping">Đang giao hàng</Option>
                <Option value="delivered">Đã giao hàng</Option>
                <Option value="done">Hoàn thành</Option>
                <Option value="cancelled">Đã hủy</Option>
              </Select>
            </Col>
            <Col xs={24} sm={12} md={6}>
              <Space>
                <Button
                  onClick={() => setFilters({ status: "", search: "" })}
                  disabled={!filters.status && !filters.search}
                  size="large"
                >
                  Xóa bộ lọc
                </Button>
                <Button
                  icon={<ReloadOutlined />}
                  onClick={fetchOrders}
                  loading={loading}
                  size="large"
                  type="primary"
                >
                  Làm mới
                </Button>
              </Space>
            </Col>
          </Row>
        </div>

        {/* Orders Table */}
        {loading ? (
          <div className="flex justify-center py-8">
            <Spin size="large" />
          </div>
        ) : data && data.docs && data.docs.length > 0 ? (
          <>
            <Table
              dataSource={data.docs}
              columns={orderColumns}
              rowKey="_id"
              pagination={false}
              scroll={{ x: 1200 }}
            />

            {data.totalDocs > 0 && (
              <div className="mt-4 flex justify-end">
                <Pagination
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
          </>
        ) : (
          <Empty
            description="Chưa có đơn hàng nào"
            image={Empty.PRESENTED_IMAGE_SIMPLE}
          />
        )}
      </Card>
    </div>
  );
}
