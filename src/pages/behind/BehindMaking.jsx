import ImageGallery from '../../components/media/ImageGallery';
import galleries from '../../data/galleries.json';

export default function BehindMaking() {
  return <main className="max-w-[1140px] mx-auto px-4 py-12 space-y-16">
    
    <ImageGallery images={galleries.making.images} label="Making behind" />
  </main>;
}
