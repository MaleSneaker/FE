import { Link, useNavigate, useParams } from "react-router-dom";
import ProductSlider from "../../components/common/ProductSlider";
import { formatCurrency } from "../../utils";
import ThumbnailProductsDetail from "./components/ThumbnailDetailProduct";
import { useEffect, useState } from "react";
import type { IProduct } from "../../types/product";
import { getDetailProduct } from "../../services/product.service";
import { useToast } from "../../context/ToastProvider";
import ActionProduct from "./components/ActionProduct";
import { Spin } from "antd";
export default function ProductDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const toast = useToast();
  const [product, setProduct] = useState<IProduct>({} as IProduct);
  const [loading, setLoading] = useState(false);
  useEffect(() => {
    (async () => {
      setLoading(true);
      try {
        const data = await getDetailProduct(id as string);

        setProduct(data);
        setLoading(false);
      } catch (error) {
        setLoading(false);
        toast("info", "Có lỗi xảy ra vui lòng thử lại!");
        navigate("/");
      }
    })();
  }, []);
  return (
    <>
      {loading ? (
        <div className="flex justify-center items-center h-[90vh]">
          <Spin size="large" />
        </div>
      ) : (
        <>
          <div className="max-w-default mx-auto  bg-white">
            <div className="border-b border-gray-300 pb-4">
              <div className="flex  items-center gap-2 text-sm font-normal xl:mx-auto">
                <Link to={"/"} className="uppercase">
                  Trang chủ
                </Link> /
                <Link to={"/product"} className="uppercase">
                  Tất cả sản phẩm
                </Link>
                / <h3 className="uppercase">Chi tiết sản phẩm</h3>
              </div>
            </div>
            {product && (
              <>
                <div className="mx-6 my-20 max-w-7xl xl:mx-auto">
                  <div className="grid grid-cols-[60%_30%] gap-15">
                    <div>
                      {!product.images ? (
                        <div className="flex justify-center items-center">
                          Sản phẩm không có ảnh
                        </div>
                      ) : (
                        <ThumbnailProductsDetail
                          images={product.images as string[]}
                        />
                      )}
                    </div>
                    <div>
                      <h3 className="text-lg font-bold text-[#070707] uppercase">
                        {product?.name}
                      </h3>
                      <div className="mt-2 text-sm text-[#070707]">
                        <p className="capitalize">
                          Thương hiệu:{" "}
                          {product?.brand?.name || "Chưa phân loại"}
                        </p>
                        <p className="capitalize">
                          Danh mục:{" "}
                          {product?.category?.name || "Chưa phân loại"}
                        </p>
                        <p className="uppercase">Mã sản phẩm: {product._id}</p>
                      </div>
                      <p className="my-4 text-2xl font-bold text-[#070707]">
                        {formatCurrency(product.price)}
                      </p>
                      <ActionProduct product={product} />
                    </div>
                  </div>
                </div>
                <div className="my-12">
                  <h2 className="text-xl font-medium">Mô tả của sản phẩm</h2>
                  <p className="mt-4">{product.description}</p>
                </div>
              </>
            )}
          </div>
          <ProductSlider
            isPending={false}
            data={[]}
            title="SẢN PHẨM TƯƠNG TỰ"
          />
        </>
      )}
    </>
  );
}
