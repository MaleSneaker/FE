export default function SimilarProducts() {
  return (
    <div className="bg-white py-6 mt-10">
      <div className="max-w-default mx-auto px-4">
        <h2 className="text-2xl font-bold text-center mb-6">
          SẢN PHẨM TƯƠNG TỰ
        </h2>
        <div className="flex items-center justify-between">
          <button className="text-gray-500 hover:text-gray-700">&lt;</button>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 flex-1">

            <div className="bg-white p-4 rounded-lg shadow-md text-center relative">
              <div className="relative">
                <img
                  src="https://product.hstatic.net/200000174405/product/1_d97150e46b334d67af9e4b6f41979dfe_master.jpg"
                  alt="Quần Nike Nam"
                  className="w-full h-48 object-cover rounded-lg"
                />
                <span className="absolute top-2 left-2 bg-red-500 text-white text-xs font-bold py-1 px-2 rounded">
                  SALE
                </span>
              </div>
              <p className="mt-2 text-sm line-clamp-2">
                Quần Nike Nam Chính Hãng - Dri-FIT Victory - Màu Trắng
              </p>
              <p className="text-red-600 font-bold mt-1">1.100.000đ</p>
              <p className="text-gray-500 line-through">2.400.000đ</p>
              <button className="mt-2 bg-red-500 text-white py-1 px-4 rounded hover:bg-red-600">
                Chi tiết
              </button>
            </div>

            <div className="bg-white p-4 rounded-lg shadow-md text-center relative">
              <div className="relative">
                <img
                  src="https://product.hstatic.net/200000174405/product/1_d97150e46b334d67af9e4b6f41979dfe_master.jpg"
                  alt="Quần Lacoste Nam"
                  className="w-full h-48 object-cover rounded-lg"
                />
                <span className="absolute top-2 left-2 bg-red-500 text-white text-xs font-bold py-1 px-2 rounded">
                  SALE
                </span>
              </div>
              <p className="mt-2 text-sm line-clamp-2">
                Quần Lacoste Nam Chính Hãng - Abrasion Resistant Tennis
              </p>
              <p className="text-red-600 font-bold mt-1">990.000đ</p>
              <p className="text-gray-500 line-through">3.500.000đ</p>
              <button className="mt-2 bg-red-500 text-white py-1 px-4 rounded hover:bg-red-600">
                Chi tiết
              </button>
            </div>

            <div className="bg-white p-4 rounded-lg shadow-md text-center relative">
              <div className="relative">
                <img
                  src="https://product.hstatic.net/200000174405/product/1_d97150e46b334d67af9e4b6f41979dfe_master.jpg"
                  alt="Quần Under Armour Nam"
                  className="w-full h-48 object-cover rounded-lg"
                />
                <span className="absolute top-2 left-2 bg-red-500 text-white text-xs font-bold py-1 px-2 rounded">
                  SALE
                </span>
              </div>
              <p className="mt-2 text-sm line-clamp-2">
                Quần Under Armour Nam Chính Hãng - UA Defender Pants
              </p>
              <p className="text-red-600 font-bold mt-1">950.000đ</p>
              <p className="text-gray-500 line-through">2.900.000đ</p>
              <button className="mt-2 bg-red-500 text-white py-1 px-4 rounded hover:bg-red-600">
                Chi tiết
              </button>
            </div>

            {/* Sản phẩm 4 */}
            <div className="bg-white p-4 rounded-lg shadow-md text-center relative">
              <div className="relative">
                <img
                  src="https://product.hstatic.net/200000174405/product/1_d97150e46b334d67af9e4b6f41979dfe_master.jpg"
                  alt="Quần Golf Adidas Nam"
                  className="w-full h-48 object-cover rounded-lg"
                />
                <span className="absolute top-2 left-2 bg-red-500 text-white text-xs font-bold py-1 px-2 rounded">
                  SALE
                </span>
              </div>
              <p className="mt-2 text-sm line-clamp-2">
                Quần Golf Adidas Nam Chính Hãng - Skateboard Joggers
              </p>
              <p className="text-red-600 font-bold mt-1">980.000đ</p>
              <p className="text-gray-500 line-through">2.900.000đ</p>
              <button className="mt-2 bg-red-500 text-white py-1 px-4 rounded hover:bg-red-600">
                Chi tiết
              </button>
            </div>
          </div>
          <button className="text-gray-500 hover:text-gray-700">&gt;</button>
        </div>
      </div>
    </div>
  );
}
