import ImageGallery from '../../components/media/ImageGallery';
import galleries from '../../data/galleries.json';
import VideoGallery from '../../components/media/VideoGallery';

export default function BehindBrochure() {
  return <main className="max-w-[1140px] mx-auto px-4 py-12 space-y-16">
    <VideoGallery videos={galleries.brochure.videos} />
    <ImageGallery images={galleries.brochure.images} label="Brochure behind" />
  </main>;
}
