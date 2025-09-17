import { useEffect, useState } from "react";
import Banner from "./components/banner/Banner";
import HomeNewBanner from "./components/homenewbanner/HomeNewBanner";
import type { IProduct } from "../../types/product";
import { getAllProduct } from "../../services/product.service";
import ProductSlider from "../../components/common/ProductSlider";

export default function HomePage() {
  const [newProducts, setNewProducts] = useState<IProduct[]>([]);
  const [isNewProductLoading, setNewProductsLoading] = useState(false);
  const [hotProducts, setHotProducts] = useState<IProduct[]>([]);
  const [isHotProductsLoading, setHotProductsLoading] = useState(false)
  useEffect(() => {
    (async () => {
      setNewProductsLoading(true);
      try {
        const { docs } = await getAllProduct({ limit: 10, sortOrder: "desc", isDeleted: false  });
        setNewProducts(docs);
        setNewProductsLoading(false);
      } catch (error) {
        setNewProductsLoading(false);
      }
    })();
    (async () => {
      setHotProductsLoading(true);
      try {
        const { docs } = await getAllProduct({ limit: 10, sortBy: 'sold', sortOrder: "desc", isDeleted: false });
        setHotProducts(docs);
        setHotProductsLoading(false);
      } catch (error) {
        setHotProductsLoading(false);
      }
    })();
  }, []);
  return (
    <>
      <Banner />
      <HomeNewBanner />
      <section className="max-w-default  default:mx-auto mx-8">
        <ProductSlider<IProduct[]>
          isPending={isNewProductLoading}
          title="Sản phẩm mới"
          description="Những sản phẩm xu hướng thời trang mới"
          data={newProducts}
        />
      </section>
      <section className="max-w-default mt-12  default:mx-auto mx-8">
        <ProductSlider<IProduct[]>
          isPending={isHotProductsLoading}
          title="Sản phẩm bán chạy"
          description="Những sản phẩm được mua nhiều nhất ở Male sneaker"
          data={hotProducts}
        />
      </section>
    </>
  );
}
