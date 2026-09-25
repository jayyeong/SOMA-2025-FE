import { useEffect, useRef, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Youtube, Instagram, Menu, X, ArrowLeft, ChevronRight } from 'lucide-react';
import { navigation } from '../../data/navigation';
import '../../styles/mobile-menu.css';

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
  const [lastSelected, setLastSelected] = useState(null);
  const menuButton = useRef(null);
  const panel = useRef(null);
  const { pathname } = useLocation();
  const closeMobile = () => { setMobileOpen(false); setSelected(null); };

  useEffect(() => { setHovered(null); setMobileOpen(false); setSelected(null); }, [pathname]);
  useEffect(() => {
    const desktop = window.matchMedia('(min-width: 1024px)');
    const closeOnDesktop = () => { if (desktop.matches) { setMobileOpen(false); setSelected(null); } };
    desktop.addEventListener('change', closeOnDesktop);
    return () => desktop.removeEventListener('change', closeOnDesktop);
  }, []);
  useEffect(() => {
    if (!mobileOpen) return;
    const previous = document.body.style.overflow;
    const trigger = menuButton.current;
    document.body.style.overflow = 'hidden';
    const keydown = event => {
      if (event.key === 'Escape') { setMobileOpen(false); setSelected(null); }
      if (event.key === 'Tab') {
        const items = Array.from(panel.current?.querySelectorAll('button, a[href]') || []).filter(item => !item.closest('[inert]'));
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
    if (!mobileOpen) return;
    const frame = requestAnimationFrame(() => {
      panel.current?.querySelector(selected ? '[data-layer="detail"] button' : '[data-layer="root"] button')?.focus();
    });
    return () => cancelAnimationFrame(frame);
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
        <div ref={panel} role="dialog" aria-modal="true" aria-label="주 메뉴" className="mobile-menu">
          <div data-layer="root" className="mobile-menu__root" inert={Boolean(selected)} aria-hidden={selected ? true : undefined}>
            <div className="mobile-menu__heading">
              <span className="text-xl font-bold">SOMA</span>
              <button onClick={closeMobile} aria-label="메뉴 닫기" className="mobile-menu__icon"><X size={24} /></button>
            </div>
            <nav className="mobile-menu__links" aria-label="모바일 메뉴">
              {navigation.map(item => <button key={item.title} className="mobile-menu__category" onClick={() => { setLastSelected(item); setSelected(item); }} aria-expanded={selected === item}>
                {item.title}<ChevronRight size={20} aria-hidden="true" />
              </button>)}
            </nav>
            <div className="mobile-menu__social"><SocialLinks /></div>
          </div>
          {selected && <button className="mobile-menu__previous" onClick={() => setSelected(null)} aria-label="이전 메뉴로 돌아가기" />}
          <div data-layer="detail" onTransitionEnd={event => {
            if (selected && event.target === event.currentTarget && event.propertyName === 'transform') event.currentTarget.querySelector('button')?.focus();
          }} className={`mobile-menu__detail ${selected ? 'is-open' : ''}`} inert={!selected} aria-hidden={!selected}>
            <div className="mobile-menu__heading">
              <button onClick={() => setSelected(null)} className="mobile-menu__back" aria-label="전체 메뉴로 돌아가기"><ArrowLeft size={20} />MENU</button>
              <button onClick={closeMobile} aria-label="메뉴 닫기" className="mobile-menu__icon"><X size={24} /></button>
            </div>
            <nav className="mobile-menu__links" aria-label={lastSelected ? `${lastSelected.title} 메뉴` : '하위 메뉴'}>
              <h2 className="text-xl font-bold mb-5">{lastSelected?.title}</h2>
              {lastSelected?.subItems.map(item => <MenuLink key={item.name} item={item} onClick={closeMobile} className="mobile-menu__link" />)}
            </nav>
            <div className="mobile-menu__social"><SocialLinks /></div>
          </div>
        </div>
      </>}
    </div>
  </div>;
}
