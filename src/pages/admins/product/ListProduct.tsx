import { DeleteOutlined, EditOutlined, UndoOutlined } from "@ant-design/icons";
import { Input, Pagination, Select, Table, Tag, Tooltip } from "antd";
import { useCallback, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { TextCell } from "../../../components/common/TextCell";
import { useToast } from "../../../context/ToastProvider";
import {
  getAllProduct,
  updateStatusProduct,
} from "../../../services/product.service";
import type { IResponse } from "../../../types/api";
import type { IProduct, ISize } from "../../../types/product";
import { formatCurrency } from "../../../utils";
import ModalMedia from "./components/ModalMedia";

export default function ListProduct() {
  const [data, setData] = useState<IResponse<IProduct[]> | null>(null);
  const [isLoading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [inputValue, setInputValue] = useState("");
  const [textSearch, setTextSearch] = useState("");
  const [sortBy, setSortBy] = useState("createdAt");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");
  const [status, setStatus] = useState<null | boolean>(null);
  const toast = useToast();
  const fetchProducts = useCallback(async (params?: Record<string, any>) => {
    setLoading(true);
    try {
      const res = await getAllProduct(params);
      setData(res);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  }, []);

  const changeStatusProduct = async (id: string, status: boolean) => {
    try {
      const res = await updateStatusProduct(id, status);
      fetchProducts();
      if (res.message) {
        toast("success", res.message);
        setStatus(null);
        setTextSearch("");
        setSortOrder("desc");
        setSortBy("createdAt");
      }
    } catch (error) {
      console.log(error);
    }
  };

  // Debounce search input
  useEffect(() => {
    const timeout = setTimeout(() => {
      setTextSearch(inputValue.trim());
      setPage(1);
    }, 500);
    return () => clearTimeout(timeout);
  }, [inputValue]);

  // Fetch data when page, search, sort changes
  useEffect(() => {
    const params: Record<string, any> = {
      page,
      sortBy,
      sortOrder,
      isDeleted: status,
    };
    if (textSearch) {
      params.searchField = "_id,name,description";
      params.search = textSearch;
    }
    const cleanedParams = Object.fromEntries(
      Object.entries(params).filter(
        ([_, v]) => v !== undefined && v !== null && v !== ""
      )
    );
    fetchProducts(cleanedParams);
  }, [page, textSearch, sortBy, status, sortOrder, fetchProducts]);

  // Xử lý sự kiện sort của AntD Table
  const handleTableChange = (_pagination: any, _filters: any, sorter: any) => {
    if (sorter && sorter.field) {
      setSortBy(sorter.field);
      setSortOrder(sorter.order === "ascend" ? "asc" : "desc");
    }
  };

  const columns = [
    {
      title: "Sản phẩm",
      dataIndex: "name",
      key: "name",
      sorter: true, // bật sort
      width: 250,
      render: (name: string, record: IProduct) => (
        <div>
          <Tag>
            <span className="text-[10px]">{record._id}</span>
          </Tag>
          <TextCell
            text={name}
            textClass="break-all pt-2 font-semibold capitalize text-blue-500"
          />
        </div>
      ),
    },
    {
      title: <p className="whitespace-nowrap">Ảnh sản phẩm</p>,
      dataIndex: "thumbnail",
      key: "thumbnail",
      render: (thumbnail: string, record: IProduct) => (
        <>
          <ModalMedia media={{ thumbnail, images: record.images }}>
            <div className="flex cursor-pointer hover:opacity-85 items-center justify-center">
              <img className="max-w-18" src={thumbnail} />
            </div>
          </ModalMedia>
        </>
      ),
    },
    {
      title: "Giá tiền",
      dataIndex: "price",
      key: "price",
      sorter: true, // bật sort
      width: 150,
      render: (price: number) => (
        <TextCell
          text={formatCurrency(price)}
          textClass="break-all font-semibold"
        />
      ),
    },
    {
      title: "Danh mục",
      dataIndex: "category",
      key: "category",
      width: 150,
      render: (category: { name: string; description: string }) => (
        <TextCell text={category.name} textClass="break-all font-semibold" />
      ),
    },
    {
      title: "Thương hiệu",
      dataIndex: "brand",
      key: "brand",
      width: 150,
      render: (brand: { name: string; description: string }) => (
        <TextCell text={brand.name} textClass="break-all font-semibold" />
      ),
    },
    {
      title: "Kích cỡ",
      dataIndex: "sizes",
      key: "description",
      render: (sizes: ISize[]) => (
        <div className="flex flex-wrap gap-3 items-start">
          {sizes.map((item) => (
            <Tooltip key={item.value} title={`Số lượng ${item.stock}`}>
              <Tag
                className="min-w-8 cursor-pointer"
                color={!item.stock ? "red" : "green"}
              >
                {item.value}
              </Tag>
            </Tooltip>
          ))}
        </div>
      ),
    },
    {
      title: "Trạng thái",
      dataIndex: "isDeleted",
      key: "isDeleted",
      render: (isDeleted: string) => (
        <Tag color={isDeleted ? "red" : "blue"}>
          {isDeleted ? "Đã bị ẩn" : "Hoạt động"}
        </Tag>
      ),
    },
    {
      title: "Hành động",
      key: "action",
      width: 200,
      render: (_: any, record: IProduct) => (
        <div>
          <Link to={`/admin/products/edit/${record._id}`}>
            <EditOutlined className="inline-block" /> Cập nhật
          </Link>
          <p
            onClick={() => changeStatusProduct(record._id, !record.isDeleted)}
            className={`hover:opacity-85 cursor-pointer mt-2 ${
              record.isDeleted ? "text-green-500" : "text-red-500"
            }`}
          >
            {record.isDeleted ? (
              <UndoOutlined className="inline-block" />
            ) : (
              <DeleteOutlined className="inline-block" />
            )}{" "}
            {record.isDeleted ? "Khôi phục" : "Ẩn đi"}
          </p>
        </div>
      ),
    },
  ];
  return (
    <div className="py-4 mt-4 shadow-lg px-4 rounded-lg w-full min-h-[95vh]">
      <h3 className="text-lg font-semibold">Quản lý sản phẩm</h3>

      <div className="mt-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Input.Search
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            style={{ width: "600px" }}
            placeholder="Tìm kiếm sản phẩm"
            allowClear
          />
          <Select
            style={{ minWidth: 150 }}
            onChange={(e) => setStatus(e)}
            value={status}
          >
            <Select.Option value={null}>
              <Tag>Tất cả trạng thái</Tag>
            </Select.Option>
            <Select.Option value={false}>
              <Tag color="blue">Hoạt động</Tag>
            </Select.Option>
            <Select.Option value={true}>
              <Tag color="red">Đã bị ẩn</Tag>
            </Select.Option>
          </Select>
        </div>

        <Link
          className="bg-blue-500 text-white py-1.5 px-4 rounded-md text-sm hover:opacity-80 duration-300"
          to="/admin/products/create"
        >
          Tạo mới sản phẩm
        </Link>
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
        />
        <div className="mt-6">
          <Pagination
            align="end"
            current={page}
            total={data ? data.totalDocs : 0}
            onChange={(p) => setPage(p)}
          />
        </div>
      </div>
    </div>
  );
}
