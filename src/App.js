import { lazy, Suspense } from 'react';
import { BrowserRouter, Routes, Route, Navigate, Link } from 'react-router-dom';
import Header from './components/layout/Header';
import ScrollToTop from './components/layout/ScrollToTop';
import Home from './pages/Home';

const MainTheme = lazy(() => import('./pages/project/MainTheme'));
const Teams = lazy(() => import('./pages/project/Teams'));
const TeamPage = lazy(() => import('./pages/project/TeamPage'));
const PortfolioPage = lazy(() => import('./pages/project/PortfolioPage'));
const LookBook = lazy(() => import('./pages/project/LookBook'));
const Runway = lazy(() => import('./pages/project/Runway'));
const ShowInfo = lazy(() => import('./pages/info/ShowInfo'));
const ArchivePage = lazy(() => import('./pages/info/ArchivePage'));
const BehindShow = lazy(() => import('./pages/behind/BehindShow'));
const BehindBrochure = lazy(() => import('./pages/behind/BehindBrochure'));
const BehindMaking = lazy(() => import('./pages/behind/BehindMaking'));

export default function App() {
  return (
    <BrowserRouter basename="/2025">
      <ScrollToTop />
      <Header />
      <Suspense fallback={<p role="status" className="py-20 text-center">불러오는 중…</p>}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/project" element={<Navigate to="/project/main-theme" replace />} />
          <Route path="/project/main-theme" element={<MainTheme />} />
          <Route path="/teams" element={<Teams />} />
          <Route path="/team/:teamId" element={<TeamPage />} />
          <Route path="/portfolio/:portfolioUrl" element={<PortfolioPage />} />
          <Route path="/project/look-book" element={<LookBook />} />
          <Route path="/project/runway" element={<Runway />} />
          <Route path="/show-info" element={<Navigate to="/show-info/exhibition" replace />} />
          <Route path="/show info" element={<Navigate to="/show-info/exhibition" replace />} />
          <Route path="/show-info/:section" element={<ShowInfo />} />
          <Route path="/behind" element={<Navigate to="/behind/show" replace />} />
          <Route path="/behind/show" element={<BehindShow />} />
          <Route path="/behind/brochure" element={<BehindBrochure />} />
          <Route path="/behind/making" element={<BehindMaking />} />
          <Route path="/archive" element={<ArchivePage />} />
          <Route path="*" element={
            <main className="px-4 py-20 text-center">
              <h1 className="text-2xl font-bold mb-4">페이지를 찾을 수 없습니다</h1>
              <Link to="/" className="underline">홈으로 돌아가기</Link>
            </main>
          } />
        </Routes>
      </Suspense>
    </BrowserRouter>
  );
}
