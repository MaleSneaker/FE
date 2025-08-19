export default function ProductInfo() {
  return (
    <div className="max-w-default mx-auto p-4 bg-white">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Hình ảnh sản phẩm */}
        <div className="space-y-4">
          <div className="grid grid-cols-1 gap-4">
            <img
              src="https://bizweb.dktcdn.net/100/413/756/products/air-jordan-1-heritage-gs-575441-1667471269083.jpg?v=1730995505350"
              alt="Sản phẩm chính"
              className="w-full h-96 object-cover rounded-lg"
            />
          </div>
          <div className="grid grid-cols-4 gap-2">
            <img
              src="https://bizweb.dktcdn.net/100/413/756/products/air-jordan-1-heritage-gs-575441-1667471269083.jpg?v=1730995505350"
              alt="Hình phụ 1"
              className="w-full h-24 object-cover rounded-lg cursor-pointer"
            />
            <img
              src="https://bizweb.dktcdn.net/100/413/756/products/air-jordan-1-heritage-gs-575441-1667471269083.jpg?v=1730995505350"
              alt="Hình phụ 2"
              className="w-full h-24 object-cover rounded-lg cursor-pointer"
            />
            <img
              src="https://bizweb.dktcdn.net/100/413/756/products/air-jordan-1-heritage-gs-575441-1667471269083.jpg?v=1730995505350"
              alt="Hình phụ 3"
              className="w-full h-24 object-cover rounded-lg cursor-pointer"
            />
            <img
              src="https://bizweb.dktcdn.net/100/413/756/products/air-jordan-1-heritage-gs-575441-1667471269083.jpg?v=1730995505350"
              alt="Hình phụ 4"
              className="w-full h-24 object-cover rounded-lg cursor-pointer"
            />
          </div>
        </div>

        {/* Thông tin sản phẩm */}
        <div className="space-y-4">
          <h1 className="text-2xl font-bold">Tên sản phẩm</h1>
          <p className="text-gray-600">Giá: 1.200.000đ</p>
          <div className="flex space-x-4">
            <div>
              <p className="font-semibold">Kích thước</p>
              <div className="flex space-x-2 mt-2">
                <button className="border border-gray-300 px-3 py-1 rounded hover:bg-gray-100">
                  Size 2
                </button>
                <button className="border border-gray-300 px-3 py-1 rounded hover:bg-gray-100">
                  Size 4
                </button>
                <button className="border border-gray-300 px-3 py-1 rounded hover:bg-gray-100">
                  Size 6
                </button>
                <button className="border border-gray-300 px-3 py-1 rounded hover:bg-gray-100">
                  Size 8
                </button>
                <button className="border border-gray-300 px-3 py-1 rounded hover:bg-gray-100">
                  Size 10
                </button>
              </div>
            </div>
            <div>
              <p className="font-semibold">Màu sắc</p>
              <div className="flex space-x-2 mt-2">
                <button className="w-6 h-6 bg-gray-300 rounded-full"></button>
              </div>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <p className="font-semibold">Số lượng</p>
            <button className="border border-gray-300 px-2 py-1">-</button>
            <span>1</span>
            <button className="border border-gray-300 px-2 py-1">+</button>
          </div>
          <div className="space-y-2">
            <button className="w-full bg-black text-white py-2 rounded hover:bg-gray-800">
              Thêm vào giỏ
            </button>
            <button className="w-full bg-gray-800 text-white py-2 rounded hover:bg-gray-900">
              Mua ngay
            </button>
          </div>
          <p className="text-gray-600 text-sm">
            Giao hàng tận nơi trên toàn quốc. Đổi trả dễ dàng trong vòng 7 ngày
            nếu sản phẩm lỗi. Liên hệ để được tư vấn chi tiết.
          </p>
          <div className="flex items-center space-x-2">
            <span className="text-blue-500">Chat ngay</span>
            <span className="text-blue-500">Zalo</span>
          </div>
        </div>
      </div>
    </div>
    
  );
}
