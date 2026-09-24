import { useState } from 'react';
import { X } from 'lucide-react';

export default function VideoGallery({ videos }) {
  const [expanded, setExpanded] = useState(null);
  return <section className="flex flex-col md:flex-row gap-4">
    {videos.map((video, index) => {
      if (expanded !== null && expanded !== index) return null;
      return <div key={video.src} className="w-full flex-1 min-w-0">
        <div className="aspect-video relative rounded-lg shadow-md overflow-hidden group">
          {expanded === index ? <>
            <iframe src={video.src} title={video.title} allowFullScreen className="w-full h-full border-0" />
            <button onClick={() => setExpanded(null)} aria-label={`${video.title} 닫기`} className="absolute top-4 right-4 p-3 rounded-full bg-white/90 text-black shadow-2xl"><X size={28} /></button>
          </> : <button onClick={() => setExpanded(index)} aria-label={`${video.title} 재생`} className="w-full h-full">
            <img src={video.thumb} alt="" loading="lazy" decoding="async" className="w-full h-full object-cover transition-transform group-hover:scale-105" />
            <span className="absolute inset-0 bg-black/30 flex items-center justify-center">
              <svg className="w-14 h-14 text-white/90" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M8 5v14l11-7z" /></svg>
            </span>
          </button>}
        </div>
      </div>;
    })}
  </section>;
}
