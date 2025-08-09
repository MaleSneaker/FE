import { EditOutlined } from "@ant-design/icons";
import { Input, Pagination, Table } from "antd";
import dayjs from "dayjs";
import { useCallback, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { TextCell } from "../../../components/common/TextCell";
import { getAllCategory } from "../../../services/category.service";
import type { ICategory } from "../../../types/category";
import type { IResponse } from "../../../types/api";

export default function ListCategory() {
  const [data, setData] = useState<IResponse<ICategory[]> | null>(null);
  const [isLoading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [inputValue, setInputValue] = useState("");
  const [textSearch, setTextSearch] = useState("");
  const [sortBy, setSortBy] = useState("createdAt");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");

  const fetchCategory = useCallback(async (params?: Record<string, any>) => {
    setLoading(true);
    try {
      const res = await getAllCategory(params);
      setData(res);
    } catch (error) {
      console.error(error);
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

  // Fetch data when page, search, sort changes
  useEffect(() => {
    const params: Record<string, any> = { page, sortBy, sortOrder };
    if (textSearch) {
      params.searchField = "_id,name,description";
      params.search = textSearch;
    }
    fetchCategory(params);
  }, [page, textSearch, sortBy, sortOrder, fetchCategory]);

  // Xử lý sự kiện sort của AntD Table
  const handleTableChange = (_pagination: any, _filters: any, sorter: any) => {
    if (sorter && sorter.field) {
      setSortBy(sorter.field);
      setSortOrder(sorter.order === "ascend" ? "asc" : "desc");
    }
  };

  const columns = [
    {
      title: "STT",
      key: "index",
      render: (_: any, __: any, index: number) => (
        <p className="text-center">{index + 1}</p>
      ),
    },
    {
      title: "Mã",
      dataIndex: "_id",
      key: "_id",
      width: 150,
      render: (id: string) => (
        <TextCell text={id} textClass="uppercase break-all" />
      ),
    },
    {
      title: "Tên danh mục",
      dataIndex: "name",
      key: "name",
      sorter: true, // bật sort
      width: 250,
      render: (name: string) => (
        <TextCell text={name} textClass="break-all font-semibold capitalize" />
      ),
    },
    {
      title: "Mô tả",
      dataIndex: "description",
      key: "description",
      render: (description: string) => (
        <TextCell
          text={description || "Chưa cập nhật mô tả"}
          clamp="1"
          textClass="break-all"
        />
      ),
    },
    {
      title: "Ngày tạo",
      dataIndex: "createdAt",
      key: "createdAt",
      sorter: true, // bật sort
      width: 200,
      render: (createdAt: string) => (
        <TextCell
          text={
            dayjs(createdAt).locale("vi-VN").format("YYYY-MM-DD | HH:mm") ||
            "Chưa cập nhật ngày tạo"
          }
          textClass="break-all"
        />
      ),
    },
    {
      title: "Hành động",
      key: "action",
      width: 200,
      render: (_: any, record: ICategory) => (
        <div>
          <Link
            to={`/admin/categories/edit/${record._id}`}
            className="flex items-center gap-2"
          >
            <EditOutlined /> Cập nhật
          </Link>
        </div>
      ),
    },
  ];

  return (
    <div className="py-4 mt-4 shadow-lg px-4 rounded-lg w-full min-h-[95vh]">
      <h3 className="text-lg font-semibold">Quản lý danh mục</h3>

      <div className="mt-4 flex items-center justify-between">
        <Input.Search
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          style={{ width: "600px" }}
          placeholder="Tìm kiếm danh mục"
          allowClear
        />
        <Link
          className="bg-blue-500 text-white py-1.5 px-4 rounded-md text-sm hover:opacity-80 duration-300"
          to="/admin/categories/create"
        >
          Tạo mới danh mục
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
