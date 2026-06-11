/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect } from 'react';
import i18n from './i18n';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import Profile from './components/Profile';
import Topics from './components/Topics';
import Timeline from './components/Timeline';
import Media from './components/Media';
import Reviews from './components/Reviews';
import Footer from './components/Footer';
import Admin from './components/Admin';

export default function App() {
  const [isAdmin, setIsAdmin] = useState(window.location.pathname === '/admin');
  const [localesLoaded, setLocalesLoaded] = useState(false);

  useEffect(() => {
    // Sync URL popstate events for seamless routing without routers
    const handlePopState = () => {
      setIsAdmin(window.location.pathname === '/admin');
    };
    window.addEventListener('popstate', handlePopState);

    // Fetch dynamic locale revisions on start
    fetch('/api/locales')
      .then((res) => {
        if (!res.ok) throw new Error('Could not fetch latest custom locales');
        return res.json();
      })
      .then((data) => {
        // Load latest translations dynamically into active runtime locale bundle
        Object.entries(data).forEach(([lng, translation]) => {
          if (translation && typeof translation === 'object') {
            i18n.addResourceBundle(lng, 'translation', translation, true, true);
          }
        });
        // Refresh i18n view
        i18n.changeLanguage(i18n.language);
        setLocalesLoaded(true);
      })
      .catch((err) => {
        console.warn('Dynamic local preloader warning (using static pre-bundles):', err);
        setLocalesLoaded(true);
      });

    return () => {
      window.removeEventListener('popstate', handlePopState);
    };
  }, []);

  if (!localesLoaded) {
    return (
      <div className="min-h-screen bg-white flex flex-col items-center justify-center p-6 font-sans">
        <div className="w-5 h-5 border-2 border-zinc-950 border-t-transparent animate-spin rounded-full mb-3" />
        <p className="text-[10px] text-zinc-400 font-bold tracking-widest uppercase font-mono">Synchronizing...</p>
      </div>
    );
  }

  if (isAdmin) {
    return <Admin />;
  }

  return (
    <div className="min-h-screen bg-white text-gray-900 font-sans selection:bg-gray-900 selection:text-white">
      <Navbar />
      <main>
        <Hero />
        <Profile />
        <Topics />
        <Timeline />
        <Media />
        <Reviews />
      </main>
      <Footer />
    </div>
  );
}

