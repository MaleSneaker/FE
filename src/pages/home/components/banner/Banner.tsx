import { useEffect, useState } from "react";
import banner1 from "../../../../assets/img/banner.jpg";
import banner2 from "../../../../assets/img/banner2.jpg";
import banner3 from "../../../../assets/img/banner6.jpg";

const images = [banner1, banner2, banner3];

export default function Banner() {
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrent((prev) => (prev + 1) % images.length);
    }, 3000); // chuyển mỗi 3s
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="relative w-full h-[700px] overflow-hidden">
      {images.map((img, index) => (
        <div
          key={index}
          className={`absolute w-full h-full bg-center bg-cover transition-opacity duration-3000 ease-in-out ${
            index === current ? "opacity-100 z-10" : "opacity-0 z-0"
          }`}
          style={{ backgroundImage: `url(${img})` }}
        />
      ))}
      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
        {images.map((_, i) => (
          <div
            key={i}
            className={`w-3 h-3 rounded-full ${
              i === current ? "bg-white" : "bg-gray-400"
            }`}
          />
        ))}
      </div>
    </div>
  );
}
