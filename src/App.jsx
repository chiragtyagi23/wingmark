import { useEffect, useRef, useState } from 'react';
import {
  BrowserRouter,
  Routes,
  Route,
  useLocation,
} from 'react-router-dom';
import PageLoader from './components/PageLoader';
import MobileNav from './components/MobileNav';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import StickyCTA from './components/StickyCTA';
import HomePage from './pages/HomePage';
import LandPage from './pages/LandPage';
import LandDetailPage from './pages/LandDetailPage';
import PlotPage from './pages/PlotPage';
import PlotDetailPage from './pages/PlotDetailPage';

if (typeof window !== 'undefined' && 'scrollRestoration' in window.history) {
  window.history.scrollRestoration = 'manual';
}

function ScrollManager() {
  const location = useLocation();
  const isInitialLoadRef = useRef(true);

  useEffect(() => {
    if (isInitialLoadRef.current) {
      isInitialLoadRef.current = false;

      if (location.hash) {
        window.history.replaceState(
          null,
          '',
          location.pathname + location.search
        );
      }
      window.scrollTo({ top: 0, behavior: 'auto' });
      return;
    }

    if (location.hash) {
      const id = location.hash.replace('#', '');
      const tryScroll = () => {
        const el = document.getElementById(id);
        if (el) {
          el.scrollIntoView({ behavior: 'smooth' });
        } else {
          window.setTimeout(tryScroll, 50);
        }
      };
      window.setTimeout(tryScroll, 60);
      return;
    }

    window.scrollTo({ top: 0, behavior: 'auto' });
  }, [location.pathname, location.hash]);

  return null;
}

function Layout() {
  const location = useLocation();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [navScrolled, setNavScrolled] = useState(false);
  const [activeSection, setActiveSection] = useState('hero');
  const [loaderHidden, setLoaderHidden] = useState(false);

  useEffect(() => {
    const timer = window.setTimeout(() => setLoaderHidden(true), 2000);
    return () => window.clearTimeout(timer);
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      setNavScrolled(window.scrollY > 80);
    };

    window.addEventListener('scroll', handleScroll);
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    const reveals = document.querySelectorAll('.reveal');
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('visible');
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.1, rootMargin: '0px 0px -40px 0px' }
    );

    reveals.forEach((element) => observer.observe(element));
    return () => observer.disconnect();
  }, [location.pathname]);

  useEffect(() => {
    if (location.pathname !== '/') {
      setActiveSection('');
      return;
    }

    const sections = Array.from(document.querySelectorAll('section[id], div[id]'));

    const handleActiveSection = () => {
      const scrollY = window.scrollY;
      let current = 'hero';

      sections.forEach((section) => {
        if (scrollY >= section.offsetTop - 120) {
          current = section.id;
        }
      });

      setActiveSection(current);
    };

    handleActiveSection();
    window.addEventListener('scroll', handleActiveSection);
    return () => window.removeEventListener('scroll', handleActiveSection);
  }, [location.pathname]);

  return (
    <>
      <PageLoader loaderHidden={loaderHidden} />
      <MobileNav open={mobileOpen} onClose={() => setMobileOpen(false)} />
      <Navbar
        scrolled={navScrolled}
        activeSection={activeSection}
        onMobileOpen={() => setMobileOpen(true)}
      />
      <ScrollManager />
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/land" element={<LandPage />} />
        <Route path="/land/:slug" element={<LandDetailPage />} />
        <Route path="/plot" element={<PlotPage />} />
        <Route path="/plot/:slug" element={<PlotDetailPage />} />
      </Routes>
      <Footer />
      <StickyCTA />
    </>
  );
}

function App() {
  return (
    <BrowserRouter>
      <Layout />
    </BrowserRouter>
  );
}

export default App;
