import { HashRouter, Routes, Route, useLocation } from 'react-router-dom';
import { useEffect } from 'react';
import { ModalProvider } from './context/ModalContext';
import { FavoritesProvider } from './context/FavoritesContext';
import Header from './components/Header/Header';
import Footer from './components/Footer/Footer';
import BackToTop from './components/BackToTop/BackToTop';
import CallbackModal from './components/CallbackModal/CallbackModal';
import Home from './pages/Home/Home';
import Tours from './pages/Tours/Tours';
import TourDetail from './pages/TourDetail/TourDetail';
import Calculator from './pages/Calculator/Calculator';
import Gallery from './pages/Gallery/Gallery';
import About from './pages/About/About';
import Contacts from './pages/Contacts/Contacts';
import NotFound from './pages/NotFound/NotFound';

function ScrollToTop() {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'instant' as ScrollBehavior });
  }, [pathname]);

  return null;
}

export default function App() {
  return (
    <FavoritesProvider>
      <ModalProvider>
        <HashRouter>
          {/* При смене маршрута — наверх */}
          <ScrollToTop />

          <Header />

          <main>
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/tours" element={<Tours />} />
              <Route path="/tours/:id" element={<TourDetail />} />
              <Route path="/calculator" element={<Calculator />} />
              <Route path="/gallery" element={<Gallery />} />
              <Route path="/about" element={<About />} />
              <Route path="/contacts" element={<Contacts />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </main>

          <Footer />
          <BackToTop />
          <CallbackModal />
        </HashRouter>
      </ModalProvider>
    </FavoritesProvider>
  );
}
