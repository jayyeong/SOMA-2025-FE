import ImageGallery from '../../components/media/ImageGallery';
import galleries from '../../data/galleries.json';

export default function BehindShow() {
  return <main className="max-w-[1140px] mx-auto px-4 py-12 space-y-16">
    <div className="w-full aspect-video"><iframe src="https://www.youtube.com/embed/Si8vAV6KxEM" title="SHOW BEHIND" loading="lazy" allowFullScreen className="w-full h-full border-0" /></div>
    <ImageGallery images={galleries.show.images} label="Show behind" />
  </main>;
}
