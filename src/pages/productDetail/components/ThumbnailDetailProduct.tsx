import { Swiper, SwiperSlide, type SwiperRef } from 'swiper/react';
import 'swiper/css';
import { Image } from 'antd';
import { DownOutlined, UpOutlined } from '@ant-design/icons';
import { useCallback, useEffect, useRef, useState } from 'react';
import { A11y, Navigation } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';

export default function ThumbnailProductsDetail({
    images,
}: {
    images: string[];
}) {
    const swiperRef = useRef<SwiperRef>(null);
    const [indexImage, setIndexImage] = useState<number>(0);
    const nextSlide = useCallback(() => {
        if (!swiperRef.current) return;
        swiperRef.current.swiper.slideNext();
    }, []);

    const prevSlide = useCallback(() => {
        if (!swiperRef.current) return;
        swiperRef.current.swiper.slidePrev();
    }, []);
    const handleClickImage = (item: number) => {
        setIndexImage(item);
    };
    useEffect(() => {
        if (swiperRef.current) {
            swiperRef.current.swiper.slideTo(indexImage - 1);
        }
    }, [indexImage]);
    console.log(images)
    return (
        <div className='flex gap-5'>
            <div className='relative h-[60vh] w-[30%] overflow-hidden py-8'>
                <Swiper
                    ref={swiperRef}
                    direction='vertical'
                    modules={[Navigation, A11y]}
                    spaceBetween={8}
                    slidesPerView={3}
                    loop
                    navigation={false}
                    keyboard={{ enabled: true, onlyInViewport: false }}
                    className='h-full'
                >
                    {images.map((item, index) => (
                        <SwiperSlide
                            onClick={() => handleClickImage(index)}
                            key={index}
                            className='flex h-[200px] cursor-pointer items-center justify-center'
                        >
                            <img
                                src={item}
                                className={`h-full w-full rounded-lg object-cover ${index === indexImage ? 'border border-black' : ''}`}
                                alt=''
                            />
                        </SwiperSlide>
                    ))}
                </Swiper>
                {images.length > 3 && (
                    <>
                        <div
                            onClick={prevSlide}
                            className='absolute top-0 left-[50%] z-[1] translate-x-[-50%] cursor-pointer rounded-[2px] bg-black/50 px-2 py-1 duration-300 select-none hover:bg-black/40'
                        >
                            <UpOutlined style={{ color: '#fff', fontSize: 14 }} />
                        </div>
                        <div
                            onClick={nextSlide}
                            className='absolute bottom-0 left-[50%] z-[1] translate-x-[-50%] cursor-pointer rounded-[2px] bg-black/50 px-2 py-1 duration-300 select-none hover:bg-black/40'
                        >
                            <DownOutlined style={{ color: '#fff', fontSize: 14 }} />
                        </div>
                    </>
                )}
            </div>

            <div className='flex w-[100%] items-start justify-center overflow-hidden'>
                <Image src={images[indexImage]} className='max-h-[800px] w-[100%] rounded-lg object-cover' alt='' />
            </div>
        </div>
    );
}
