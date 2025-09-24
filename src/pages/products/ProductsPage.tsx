import {
  CaretDownOutlined,
  CaretUpOutlined,
  ReloadOutlined,
} from "@ant-design/icons";
import { Button, Pagination, Popover, Space, Spin } from "antd";
import { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import ProductCard from "../../components/ProductCard/ProductCard";
import { getAllProduct } from "../../services/product.service";
import type { IResponse } from "../../types/api";
import type { IProduct } from "../../types/product";
import FilterSideBar from "./components/FilterSideBar";
import SizeList from "./components/SizeList";
import PriceList from "./components/PriceList";

const ProductsPage = () => {
  const [isSizeOpen, setIsSizeOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isPriceOpen, setIsPriceOpen] = useState(false);
  const [data, setData] = useState<IResponse<IProduct[]>>();
  const location = useLocation();
  const [params, setParams] = useState<{
    [key: string]: string | number | undefined;
  }>(() => {
    const searchParams = new URLSearchParams(location.search);
    const initialParams: { [key: string]: string | number } = {};
    searchParams.forEach((value, key) => {
      initialParams[key] = value;
    });
    if (!initialParams.page) initialParams.page = "1";
    return initialParams;
  });
  useEffect(() => {
    (async () => {
      setIsLoading(true);
      try {
        const res = await getAllProduct({
          isDeleted: false,
          limit: 6,
          ...(() => {
            const { selectPrice, ...rest } = params;
            return rest;
          })(),
          searchField: "name",
        });
        setData(res);
        setIsLoading(false);
      } catch (error) {
        setIsLoading(false);
        console.log(error);
      }
    })();
  }, [params]);

  const handleUpdateParams = (key: string, value: string | number) => {
    setParams((prev) => {
      if (value === undefined || value === null || value === "") {
        const updated = { ...prev };
        delete updated[key];
        return updated;
      }
      if (prev[key] === value) {
        return prev;
      }
      return {
        ...prev,
        [key]: value,
      };
    });
    setIsPriceOpen(false);
    setIsSizeOpen(false);
  };
  useEffect(() => {
    const searchParams = new URLSearchParams(location.search);
    searchParams.forEach((value, key) => {
      setParams((prev) => {
        if (prev[key] === value) {
          const updated = { ...prev };
          return updated;
        }
        return {
          ...prev,
          [key]: value,
        };
      });
    });
  }, [location]);
  return (
    <>
      <div className="mt-4">
        <div className="border-b border-gray-300 pb-4">
          <div className="mx-6 flex max-w-7xl items-center gap-2 text-sm font-normal xl:mx-auto">
            <Link to={"/"} className="uppercase">
              Trang chủ
            </Link>{" "}
            / <h3 className="uppercase">Tất cả sản phẩm</h3> /{" "}
          </div>
        </div>
      </div>
      <div className="lg:max-w-standard mx-auto mt-14 w-full xl:max-w-7xl">
        <div className="flex gap-4">
          <div className="basis-96">
            <FilterSideBar updateParams={handleUpdateParams} query={params} />
          </div>
          <div className="basis-full">
            <div className="mb-14 flex justify-between">
              <span className="text-xl font-extrabold">Sản phẩm mới</span>
              <div className="flex gap-20">
                <Popover
                  content={
                    <SizeList
                      params={params}
                      updateParams={handleUpdateParams}
                    />
                  }
                  trigger="click"
                  placement="bottom"
                  open={isSizeOpen}
                >
                  <div
                    className="text-secondary flex cursor-pointer items-center gap-1 text-[0.938rem] font-semibold select-none"
                    onClick={() => setIsSizeOpen(!isSizeOpen)}
                  >
                    Kích cỡ
                    {isSizeOpen ? <CaretUpOutlined /> : <CaretDownOutlined />}
                  </div>
                </Popover>
                <Popover
                  content={
                    <PriceList
                      handleUpdateParams={handleUpdateParams}
                      params={params}
                    />
                  }
                  trigger="click"
                  placement="bottom"
                  open={isPriceOpen}
                >
                  <div
                    onClick={() => setIsPriceOpen(!isPriceOpen)}
                    className="text-secondary flex cursor-pointer items-center gap-1 text-[0.938rem] font-semibold select-none"
                  >
                    Giá{" "}
                    {isPriceOpen ? <CaretUpOutlined /> : <CaretDownOutlined />}
                  </div>
                </Popover>
              </div>
            </div>
            <div>
              {Object.keys(params).filter((key) => key !== "page").length >
                0 && (
                <div className="mb-3">
                  <Button
                    onClick={() => {
                      setParams({ page: "1" });
                    }}
                    icon={<ReloadOutlined />}
                  >
                    Đặt lại
                  </Button>
                </div>
              )}

              {isLoading && (
                <div className="relative flex min-h-[800px] items-center justify-center">
                  <Spin size="large" />
                </div>
              )}
              {!isLoading &&
                (data?.docs?.length !== 0 ? (
                  <div
                    className={`grid
                 relative gap-2 grid-cols-1 md:grid-cols-2 lg:grid-cols-3`}
                  >
                    {data?.docs?.map((product) => (
                      <ProductCard product={product} key={product._id} />
                    ))}
                  </div>
                ) : (
                  <div className="min-h-[500px] flex justify-center items-center">
                    Không có sản phẩm
                  </div>
                ))}
              {data && (
                <Space className="m-10 flex w-full justify-center">
                  <Pagination
                    pageSize={data.limit}
                    total={data.totalDocs}
                    current={data.page}
                    onChange={(page) => handleUpdateParams("page", page)}
                    size="default"
                  />
                </Space>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default ProductsPage;
