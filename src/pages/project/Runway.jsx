import { useState, useCallback } from 'react';
import ImageGallery from '../../components/media/ImageGallery';
import VideoGallery from '../../components/media/VideoGallery';
import ImageLightbox from '../../components/media/ImageLightbox';
import galleries from '../../data/galleries.json';

export default function Runway() {
  const [zoomSrc, setZoomSrc] = useState(null);
  const closeZoom = useCallback(() => setZoomSrc(null), []);
  return <main className="max-w-[1140px] mx-auto px-4 py-12 space-y-16">
    <VideoGallery videos={galleries.runway.videos} />
    <ImageGallery images={galleries.runway.images} label="Runway" runway onImageClick={setZoomSrc} />
    {zoomSrc && <ImageLightbox src={zoomSrc} onClose={closeZoom} />}
  </main>;
}
