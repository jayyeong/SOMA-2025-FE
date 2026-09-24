import { useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import { X } from 'lucide-react';

export default function ImageLightbox({ src, onClose }) {
  const closeButton = useRef(null);
  useEffect(() => {
    const previousFocus = document.activeElement;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    closeButton.current?.focus();
    const keydown = event => {
      if (event.key === 'Escape') onClose();
      if (event.key === 'Tab') { event.preventDefault(); closeButton.current?.focus(); }
    };
    document.addEventListener('keydown', keydown);
    return () => { document.body.style.overflow = previousOverflow; document.removeEventListener('keydown', keydown); previousFocus?.focus(); };
  }, [onClose]);
  return createPortal(<div role="dialog" aria-modal="true" aria-label="런웨이 사진 확대" className="fixed inset-0 z-[100] flex items-center justify-center bg-black/70" onClick={onClose}>
    <button ref={closeButton} onClick={onClose} className="absolute top-6 right-6 text-white" aria-label="사진 닫기"><X size={32} /></button>
    <img src={src} alt="확대한 런웨이 사진" className="max-h-[90vh] max-w-[90vw] object-contain" onClick={event => event.stopPropagation()} />
  </div>, document.body);
}
