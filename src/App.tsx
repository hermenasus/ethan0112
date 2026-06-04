/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import Navbar from './components/Navbar';
import Hero from './components/Hero';
import Profile from './components/Profile';
import Contact from './components/Contact';
import Topics from './components/Topics';
import Timeline from './components/Timeline';
import Media from './components/Media';
import Reviews from './components/Reviews';
import Footer from './components/Footer';

export default function App() {
  return (
    <div className="min-h-screen bg-white text-gray-900 font-sans selection:bg-gray-900 selection:text-white">
      <Navbar />
      <main>
        <Hero />
        <Profile />
        <Contact />
        <Topics />
        <Timeline />
        <Media />
        <Reviews />
      </main>
      <Footer />
    </div>
  );
}

