import { Link } from "react-router-dom";

type Props = {
  productId: string;
  thumbnail: string;
  stock: number;
};

const ThumbnailImage = ({ productId, thumbnail, stock }: Props) => {
  return (
    <Link
      to={`/product/${productId}`}
      className="block h-40 w-30 min-w-10 rounded-md object-cover p-2"
    >
      {stock === 0 ? (
        <div className="relative">
          <img
            src={thumbnail}
            alt={`cart thumbnail`}
            className="w-full object-contain blur-xs filter"
          />
          <span className="absolute top-[50%] left-[50%] translate-x-[-50%] translate-y-[-50%] text-sm whitespace-nowrap text-red-500 [text-shadow:2px_2px_4px_rgba(0,0,0,0.5)]">
            Hết hàng
          </span>
        </div>
      ) : (
        <img
          src={thumbnail}
          alt={`cart thumbnail`}
          className="w-full object-contain"
        />
      )}
    </Link>
  );
};

export default ThumbnailImage;
