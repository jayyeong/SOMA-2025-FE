import { useEffect, useRef, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Youtube, Instagram, Menu, X, ArrowLeft } from 'lucide-react';
import { navigation } from '../../data/navigation';

function SocialLinks() {
  return <div className="flex gap-4">
    <a href="https://www.youtube.com/@kuappareldesign" target="_blank" rel="noopener noreferrer" aria-label="YouTube"><Youtube size={25} /></a>
    <a href="https://www.instagram.com/kuad_archive/" target="_blank" rel="noopener noreferrer" aria-label="Instagram"><Instagram size={25} /></a>
  </div>;
}

function MenuLink({ item, onClick, className }) {
  return item.path === '/2024'
    ? <a href="/2024/" className={className} onClick={onClick}>{item.name}</a>
    : <Link to={item.path} className={className} onClick={onClick}>{item.name}</Link>;
}

export default function Header() {
  const [hovered, setHovered] = useState(null);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [selected, setSelected] = useState(null);
  const menuButton = useRef(null);
  const panel = useRef(null);
  const { pathname } = useLocation();
  const closeMobile = () => { setMobileOpen(false); setSelected(null); };

  useEffect(() => { setHovered(null); setMobileOpen(false); setSelected(null); }, [pathname]);
  useEffect(() => {
    if (!mobileOpen) return;
    const previous = document.body.style.overflow;
    const trigger = menuButton.current;
    document.body.style.overflow = 'hidden';
    const keydown = event => {
      if (event.key === 'Escape') { setMobileOpen(false); setSelected(null); }
      if (event.key === 'Tab') {
        const items = panel.current?.querySelectorAll('button, a[href]');
        if (!items?.length) return;
        const first = items[0], last = items[items.length - 1];
        if (event.shiftKey && document.activeElement === first) { event.preventDefault(); last.focus(); }
        if (!event.shiftKey && document.activeElement === last) { event.preventDefault(); first.focus(); }
      }
    };
    document.addEventListener('keydown', keydown);
    return () => {
      document.body.style.overflow = previous;
      document.removeEventListener('keydown', keydown);
      trigger?.focus();
    };
  }, [mobileOpen]);
  useEffect(() => {
    if (mobileOpen) panel.current?.querySelector('button')?.focus();
  }, [mobileOpen, selected]);

  return <div className="relative">
    <div className={`hidden lg:block shadow transition-colors ${hovered ? 'bg-black text-white' : 'bg-white text-black'}`}
      onMouseLeave={() => setHovered(null)} onKeyDown={event => { if (event.key === 'Escape') setHovered(null); }}
      onBlur={event => { if (!event.currentTarget.contains(event.relatedTarget)) setHovered(null); }}>
      <header className="px-4">
        <div className="h-12 pt-4">
          <h1 className="text-sm leading-none font-medium mb-2">2025 KUAD GRADUATION FASHION SHOW</h1>
          <SocialLinks />
        </div>
        <div className="text-center py-4"><Link to="/" className="inline-block h-[40px] font-bold text-5xl leading-none">SOMA</Link></div>
      </header>
      <nav aria-label="주 메뉴" className="relative">
        <ul className="max-w-[1140px] mx-auto px-4 flex justify-between py-4">
          {navigation.map(item => <li key={item.title} onMouseEnter={() => setHovered(item)}>
            <Link to={item.path} onFocus={() => setHovered(item)} onClick={() => setHovered(null)}
              className="block text-[22px] leading-[30px] font-bold hover:opacity-70">{item.title}</Link>
          </li>)}
        </ul>
        {hovered && <div className="absolute w-full bg-white text-black z-50 shadow-lg">
          <div className="max-w-[1140px] mx-auto px-4 flex gap-24 py-12">
            <div className="w-1/3"><h2 className="text-3xl font-bold mb-6">{hovered.title}</h2><p className="text-gray-600 leading-relaxed whitespace-pre-line">{hovered.description}</p></div>
            <ul className="space-y-6 pt-4">{hovered.subItems.map(item => <li key={item.name}>
              <MenuLink item={item} onClick={() => setHovered(null)} className="text-lg font-medium hover:underline" />
            </li>)}</ul>
          </div>
        </div>}
      </nav>
    </div>
    <div className="lg:hidden">
      <header className="flex items-center justify-between bg-white px-4 py-3 shadow-sm">
        <Link to="/" className="text-xl font-bold">SOMA</Link>
        <button ref={menuButton} onClick={() => setMobileOpen(true)} aria-label="메뉴 열기" aria-expanded={mobileOpen}><Menu size={24} /></button>
      </header>
      {mobileOpen && <>
        <div className="fixed inset-0 bg-black/30 z-50" onClick={closeMobile} />
        <div ref={panel} role="dialog" aria-modal="true" aria-label="주 메뉴" className="fixed top-0 right-0 bottom-0 w-[288px] max-w-full bg-white z-50 flex flex-col">
          <div className="flex items-center justify-between p-4 border-b">
            {selected ? <button onClick={() => setSelected(null)} aria-label="이전 메뉴"><ArrowLeft size={24} /></button> : <span>SOMA</span>}
            {selected && <h2 className="font-semibold">{selected.title}</h2>}
            <button onClick={closeMobile} aria-label="메뉴 닫기"><X size={24} /></button>
          </div>
          <nav className="flex-1 overflow-y-auto px-6 py-8" aria-label="모바일 메뉴">
            <ul className="space-y-6">{selected
              ? selected.subItems.map(item => <li key={item.name}><MenuLink item={item} onClick={closeMobile} className="block py-2 text-base font-medium" /></li>)
              : navigation.map(item => <li key={item.title}><button className="w-full py-2 text-left text-2xl font-semibold" onClick={() => setSelected(item)}>{item.title}</button></li>)}</ul>
          </nav>
          <div className="p-6"><SocialLinks /></div>
        </div>
      </>}
    </div>
  </div>;
}
