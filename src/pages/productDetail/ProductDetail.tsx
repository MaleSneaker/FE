import ProductInfo from "./components/ProductInfo";
import SimilarProducts from "./components/SimilarProducts";

export default function ProductDetail() {
  return (
    <>
      <ProductInfo />
      <hr className="mt-20 "/>
      <SimilarProducts />
    </>
  );
}
