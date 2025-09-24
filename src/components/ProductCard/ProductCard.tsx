import { Link } from "react-router-dom";
import type { IProduct } from "../../types/product";
import { formatCurrency } from "../../utils";

export default function ProductCard({ product }: { product: IProduct }) {
  return (
    <div className="group overflow-hidden select-none">
      <div className="relative">
        <div
          className="overflow-hidden rounded-md bg-gray-200"
          style={{
            backgroundImage: `url(${product?.thumbnail})`,
            backgroundSize: "cover",
            backgroundPosition: "center",
            backgroundRepeat: "no-repeat",
            height: "427px",
          }}
        >
          {/* <img src={product.thumbnail} alt='product' className='h-[327px] w-full object-contain ' /> */}
        </div>

        {/* <div className='text-red absolute top-0 right-0 bg-white px-6 py-1.5 text-xs font-semibold text-red-500'>
                    <span>-30%</span>
                </div> */}
        <Link
          to={`/product/${product?._id}`}
          className="absolute top-0 bottom-0 left-0 flex w-full -translate-x-full overflow-hidden rounded-md bg-black/50 opacity-0 duration-300 group-hover:translate-x-0 group-hover:opacity-100"
        >
          <span className="hover:text-black absolute top-[50%] right-[10%] left-[10%] block border border-white px-4 py-1.5 text-center font-bold text-white uppercase hover:bg-white">
            Xem thêm
          </span>
        </Link>
      </div>
      <Link
        to={`/product/${product?._id}`}
        className="text-secondary hover:text-black mt-3 mb-5 block text-center text-sm font-bold duration-300"
      >
        {product?.name}
      </Link>
      <div className="flex items-center justify-center gap-3">
        <span className="text-primary block text-center text-base font-bold">
          {formatCurrency(product?.price)}
        </span>
        {/* <span className='block text-center text-base font-light text-red-500 line-through'>
                    {formatCurrency(100000)}
                </span> */}
      </div>
    </div>
  );
}
