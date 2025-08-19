export default function NewProduct() {
  return (
    <div className="bg-white">
      <div className="max-w-default mx-auto ">
        <h2 className="text-2xl font-bold text-center mb-6">
          SẢN PHẨM BÁN CHẠY
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-5">
          {/* Sản phẩm 1 */}
          <div className="bg-white p-4 rounded-lg shadow-md text-center">
            <div className="relative">
              <img
                src="https://product.hstatic.net/200000174405/product/1_d97150e46b334d67af9e4b6f41979dfe_master.jpg"
                alt="Giày Adidas"
                className="w-full h-55 object-cover"
              />
              <span className="absolute top-2 left-2 bg-red-500 text-white text-xs font-bold py-1 px-2 rounded">
                SALE
              </span>
            </div>
            <p className="mt-2 text-sm line-clamp-1">
              Giày Adidas Chính hãng - EQ21 Run Nam - Trắng | JapanSport
            </p>
            <p className="text-red-600 font-bold mt-1">2.500.000đ</p>
            <p className="text-gray-500 line-through">2.800.000đ</p>
            <button className="mt-2 bg-red-500 text-white py-1 px-4 rounded hover:bg-red-600">
              Chi tiết
            </button>
          </div>
          {/* Sản phẩm 2 */}
          <div className="bg-white p-4 rounded-lg shadow-md text-center">
            <div className="relative">
              <img
                src="https://product.hstatic.net/200000174405/product/1_d97150e46b334d67af9e4b6f41979dfe_master.jpg"
                alt="Giày Adidas"
                className="w-full h-55 object-cover"
              />
              <span className="absolute top-2 left-2 bg-red-500 text-white text-xs font-bold py-1 px-2 rounded">
                SALE
              </span>
            </div>
            <p className="mt-2 text-sm ">
              Giày Adidas Chính hãng - SolarBoost 3 Nam - Đen
            </p>
            <p className="text-red-600 font-bold mt-1">1.480.000đ</p>
            <p className="text-gray-500 line-through">1.680.000đ</p>
            <button className="mt-2 bg-red-500 text-white py-1 px-4 rounded hover:bg-red-600">
              Chi tiết
            </button>
          </div>
          {/* Sản phẩm 3 */}
          <div className="bg-white p-4 rounded-lg shadow-md text-center">
            <div className="relative">
              <img
                src="https://product.hstatic.net/200000174405/product/1_d97150e46b334d67af9e4b6f41979dfe_master.jpg"
                alt="Giày Nike"
                className="w-full h-55 object-cover"
              />
              <span className="absolute top-2 left-2 bg-red-500 text-white text-xs font-bold py-1 px-2 rounded">
                SALE
              </span>
            </div>
            <p className="mt-2 text-sm line-clamp-1">
              Giày Nike Chính hãng - Air Zoom Rival Fly 3 Nam - Đen
            </p>
            <p className="text-red-600 font-bold mt-1">2.450.000đ</p>
            <p className="text-gray-500 line-through">2.650.000đ</p>
            <button className="mt-2 bg-red-500 text-white py-1 px-4 rounded hover:bg-red-600">
              Chi tiết
            </button>
          </div>
          {/* Sản phẩm 4 */}
          <div className="bg-white p-4 rounded-lg shadow-md text-center">
            <div className="relative">
              <img
                src="https://product.hstatic.net/200000174405/product/1_d97150e46b334d67af9e4b6f41979dfe_master.jpg"
                alt="Giày Adidas"
                className="w-full h-55 object-cover"
              />
              <span className="absolute top-2 left-2 bg-red-500 text-white text-xs font-bold py-1 px-2 rounded">
                SALE
              </span>
            </div>
            <p className="mt-2 text-sm line-clamp-1 al">
              Giày Adidas Chính hãng - UltraBoost 21 Nữ - Trắng
            </p>
            <p className="text-red-600 font-bold mt-1">5.200.000đ</p>
            <p className="text-gray-500 line-through">5.500.000đ</p>
            <button className="mt-2 bg-red-500 text-white py-1 px-4 rounded hover:bg-red-600">
              Chi tiết
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
