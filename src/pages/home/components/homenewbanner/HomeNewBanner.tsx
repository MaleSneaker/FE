import { useEffect, useState } from "react";

const HomeNewBanner: React.FC = () => {
  const [isVisible, setIsVisible] = useState<boolean>(false);

  useEffect(() => {
    // Hiệu ứng fade-in khi component được render
    setTimeout(() => setIsVisible(true), 500);
  }, []);

  return (
    <section
      id="home-new-banner"
      className="max-w-default default:mx-auto py-8 bg-white"
    >
      <div className="w-full">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div
            className={` transition-opacity duration-1000 ease-in-out ${
              isVisible
                ? "opacity-100 translate-x-0"
                : "opacity-0 translate-x-10"
            }`}
          >
            <div className="home-new-banner-item">
              <div className="relative overflow-hidden rounded-lg h-[400px] md:h-[500px]">
                <img
                  className="w-full h-full object-cover"
                  src="https://bizweb.dktcdn.net/100/413/756/products/air-jordan-1-heritage-gs-575441-1667471269083.jpg?v=1730995505350"
                  alt="TOP"
                  loading="lazy"
                />
                <div className="absolute bottom-4 left-4 text-center">
                  <div className="text-xl md:text-2xl font-bold text-white mb-2 cursor-pointer">
                    TOP
                  </div>
                  <div className="bg-white text-black px-4 py-2 rounded hover:bg-gray-200 transition-colors cursor-pointer">
                    SHOP NOW
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div
            className={`pl-5 transition-opacity duration-1000 ease-in-out ${
              isVisible
                ? "opacity-100 -translate-x-0"
                : "opacity-0 -translate-x-10"
            }`}
          >
            <div className="home-new-banner-item">
              <div className="relative overflow-hidden rounded-lg h-[400px] md:h-[500px]">
                <img
                  className="w-full h-full object-cover"
                  src="https://down-vn.img.susercontent.com/file/vn-11134207-7r98o-lqpw01nslwzb2c"
                  alt="NEW COLLECTION"
                  loading="lazy"
                />
                <div className="absolute bottom-4 left-4 text-center">
                  <div className="text-xl md:text-2xl font-bold text-white mb-2 cursor-pointer">
                    GIÀY MỚI
                  </div>
                  <div className="bg-white text-black px-4 py-2 rounded hover:bg-gray-200 transition-colors cursor-pointer">
                    SHOP NOW
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HomeNewBanner;
