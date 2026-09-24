import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';

export default function ImageGallery({ images, label, onImageClick, runway = false }) {
  return <section aria-label={label}>
    <Swiper navigation modules={[Navigation]} spaceBetween={runway ? 8 : 20}
      slidesPerView={runway ? 2 : 1}
      breakpoints={runway ? { 768: { slidesPerView: 3 }, 1024: { slidesPerView: 4 } } : { 640: { slidesPerView: 2 }, 1024: { slidesPerView: 3 } }}
      className="w-full select-none">
      {images.map((src, index) => <SwiperSlide key={src} className="flex justify-center items-center">
        {onImageClick ? <button onClick={() => onImageClick(src)} aria-label={`${label} ${index + 1} 확대`} className="w-full">
          <img src={src} alt={`${label} ${index + 1}`} loading="lazy" decoding="async" draggable={false} className="w-full h-full object-contain" />
        </button> : <img src={src} alt={`${label} ${index + 1}`} loading="lazy" decoding="async" className="w-full max-h-[80vh] object-contain" />}
      </SwiperSlide>)}
    </Swiper>
  </section>;
}
