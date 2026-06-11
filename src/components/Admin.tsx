import React, { useState, useEffect } from 'react';
import { 
  ArrowLeft, LogOut, Save, Plus, Trash2, Globe, Sparkles, 
  User, Image as ImageIcon, Briefcase, FileText, Award, CheckCircle2, AlertCircle, RefreshCw
} from 'lucide-react';

interface ExperienceItem {
  year: string;
  title: string;
  subtitle: string;
  desc: string;
}

interface ServiceItem {
  title: string;
  desc: string;
  bullets: string[];
  priceOnline: string;
  priceMeetup: string;
}

interface MediaItem {
  id: string;
  title: string;
  imageUrl: string;
  category: string;
}

interface LocaleData {
  nav: {
    profile: string;
    timeline: string;
    services: string;
    media: string;
    reviews: string;
  };
  hero: {
    name: string;
    location: string;
    role: string;
    description: string;
    imageUrl?: string;
  };
  profile: {
    title: string;
    subtitle: string;
    p1: string;
    p2: string;
    advantage_title: string;
    advantage_desc: string;
    endorsement_title: string;
    endorsement_desc: string;
    status_experts?: string;
    status_projects?: string;
    status_rating?: string;
    status_experience?: string;
    status_role?: string;
    exp_value: string;
    rating_value: string;
    role_value: string;
    honors_title: string;
    honors: {
      [key: string]: { cat: string; title: string };
    };
  };
  experience: {
    title: string;
    subtitle: string;
    items: ExperienceItem[];
  };
  services: {
    title: string;
    subtitle: string;
    online: string;
    meetup: string;
    [key: string]: any; // matches item1, item2, etc.
  };
  media: {
    title: string;
    subtitle: string;
    items: MediaItem[];
  };
  reviews: any;
}

export default function Admin() {
  const [password, setPassword] = useState('');
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [loginError, setLoginError] = useState('');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [statusMessage, setStatusMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  // Separate locale datasets
  const [locales, setLocales] = useState<{
    en: LocaleData | null;
    'zh-CN': LocaleData | null;
    'zh-TW': LocaleData | null;
  }>({ en: null, 'zh-CN': null, 'zh-TW': null });

  // Current selected locale for form fields edits
  const [editLang, setEditLang] = useState<'zh-TW' | 'zh-CN' | 'en'>('zh-TW');
  
  // Active editing tab in admin panel
  const [activeTab, setActiveTab] = useState<'hero' | 'profile' | 'experience' | 'services' | 'media'>('hero');

  useEffect(() => {
    // Check local authentication state
    const adminToken = localStorage.getItem('adminToken');
    if (adminToken === 'admin-authorized-token-2026') {
      setIsLoggedIn(true);
    }
    fetchLocales();
  }, []);

  const fetchLocales = async () => {
    try {
      setLoading(true);
      const res = await fetch('/api/locales');
      if (res.ok) {
        const data = await res.json();
        setLocales(data);
      } else {
        console.error('Failed to load locales');
      }
    } catch (err) {
      console.error('Error fetching locales', err);
    } finally {
      setLoading(false);
    }
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError('');
    try {
      const res = await fetch('/api/admin/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password }),
      });
      if (res.ok) {
        const data = await res.json();
        localStorage.setItem('adminToken', data.token);
        setIsLoggedIn(true);
      } else {
        const errData = await res.json();
        setLoginError(errData.error || 'Login failed');
      }
    } catch (err) {
      setLoginError('Error connecting to authentication server');
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('adminToken');
    setIsLoggedIn(false);
  };

  const handleSaveAll = async () => {
    setSaving(true);
    setStatusMessage(null);
    const storedToken = localStorage.getItem('adminToken') || '';
    
    try {
      const currentPassword = password || 'ethan2026'; // fallbacks if they refreshed page
      const res = await fetch('/api/save-locales', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          en: locales.en,
          'zh-CN': locales['zh-CN'],
          'zh-TW': locales['zh-TW'],
          password: currentPassword
        }),
      });

      if (res.ok) {
        setStatusMessage({ type: 'success', text: 'All categories successfully synced & saved in 3 languages!' });
        // Force refresh locale translation context dynamically on client
        await fetchLocales();
        setTimeout(() => {
          // Soft redirect/refresh to pull new configurations safely
          window.location.reload();
        }, 1500);
      } else {
        const err = await res.json();
        setStatusMessage({ type: 'error', text: err.error || 'Failed to save changes.' });
      }
    } catch (error) {
      setStatusMessage({ type: 'error', text: 'Network connection failure on save.' });
    } finally {
      setSaving(false);
    }
  };

  // Safe accessor to get current editing language state
  const curLocale = locales[editLang];

  // Global field update utility for simple key paths
  const updateField = (section: keyof LocaleData, field: string, value: any) => {
    if (!curLocale) return;
    
    setLocales({
      ...locales,
      [editLang]: {
        ...curLocale,
        [section]: {
          ...((curLocale[section] as any) || {}),
          [field]: value
        }
      }
    });
  };

  // Update object path values like profile.honors.item1.title
  const updateHonorsField = (itemKey: string, prop: 'cat' | 'title', value: string) => {
    if (!curLocale) return;
    setLocales({
      ...locales,
      [editLang]: {
        ...curLocale,
        profile: {
          ...curLocale.profile,
          honors: {
            ...curLocale.profile.honors,
            [itemKey]: {
              ...curLocale.profile.honors[itemKey],
              [prop]: value
            }
          }
        }
      }
    });
  };

  // Add a new career experience across all languages synchronously
  const handleAddExperience = () => {
    const updated = { ...locales };
    const languages: ('en' | 'zh-CN' | 'zh-TW')[] = ['en', 'zh-CN', 'zh-TW'];
    
    languages.forEach(lng => {
      if (updated[lng]) {
        const expItems = [...(updated[lng]!.experience.items || [])];
        expItems.unshift({
          year: '2026 - Present',
          title: lng === 'en' ? 'New Advisor Role' : '新增顧問職位',
          subtitle: lng === 'en' ? 'Venture Capital / Enterprise' : '企業與投資機構',
          desc: lng === 'en' ? 'Introduce your key accomplishments here.' : '在此介紹實戰歷程與核心成績。'
        });
        updated[lng]!.experience.items = expItems;
      }
    });
    setLocales(updated);
  };

  // Delete experience at index across all languages
  const handleDeleteExperience = (index: number) => {
    const updated = { ...locales };
    const languages: ('en' | 'zh-CN' | 'zh-TW')[] = ['en', 'zh-CN', 'zh-TW'];
    
    languages.forEach(lng => {
      if (updated[lng]) {
        const expItems = [...(updated[lng]!.experience.items || [])];
        expItems.splice(index, 1);
        updated[lng]!.experience.items = expItems;
      }
    });
    setLocales(updated);
  };

  // Update specific experience block
  const handleUpdateExperience = (index: number, field: keyof ExperienceItem, value: string) => {
    if (!curLocale) return;
    const expItems = [...(curLocale.experience.items || [])];
    if (expItems[index]) {
      expItems[index] = { ...expItems[index], [field]: value };
      setLocales({
        ...locales,
        [editLang]: {
          ...curLocale,
          experience: {
            ...curLocale.experience,
            items: expItems
          }
        }
      });
    }
  };

  // Dynamic Topics / Consultant services updates
  const handleUpdateServiceField = (itemKey: string, field: keyof ServiceItem, value: any) => {
    if (!curLocale) return;
    setLocales({
      ...locales,
      [editLang]: {
        ...curLocale,
        services: {
          ...curLocale.services,
          [itemKey]: {
            ...curLocale.services[itemKey],
            [field]: value
          }
        }
      }
    });
  };

  // Adding premium tags / bullet values inside consultations
  const handleUpdateBullet = (itemKey: string, bulletIndex: number, value: string) => {
    if (!curLocale) return;
    const svc = curLocale.services[itemKey];
    if (svc && svc.bullets) {
      const bullets = [...svc.bullets];
      bullets[bulletIndex] = value;
      handleUpdateServiceField(itemKey, 'bullets', bullets);
    }
  };

  const handleAddBullet = (itemKey: string) => {
    if (!curLocale) return;
    const svc = curLocale.services[itemKey];
    if (svc) {
      const bullets = [...(svc.bullets || []), 'New custom feature / bullet'];
      handleUpdateServiceField(itemKey, 'bullets', bullets);
    }
  };

  const handleDeleteBullet = (itemKey: string, bulletIndex: number) => {
    if (!curLocale) return;
    const svc = curLocale.services[itemKey];
    if (svc && svc.bullets) {
      const bullets = [...svc.bullets];
      bullets.splice(bulletIndex, 1);
      handleUpdateServiceField(itemKey, 'bullets', bullets);
    }
  };

  // Add a new Media photo honors block across all languages
  const handleAddMedia = () => {
    const nextId = String(Date.now());
    const updated = { ...locales };
    const languages: ('en' | 'zh-CN' | 'zh-TW')[] = ['en', 'zh-CN', 'zh-TW'];
    
    languages.forEach(lng => {
      if (updated[lng]) {
        const mediaItems = [...(updated[lng]!.media.items || [])];
        mediaItems.push({
          id: nextId,
          title: lng === 'en' ? 'New Media / Honor Coverage Title' : '新增媒體大會或演講榮譽',
          imageUrl: '/ethan_chen_professional_headshot_1780492073621.png',
          category: lng === 'en' ? 'Press' : '媒體報導'
        });
        updated[lng]!.media.items = mediaItems;
      }
    });
    setLocales(updated);
  };

  // Delete media item across all languages
  const handleDeleteMedia = (id: string) => {
    const updated = { ...locales };
    const languages: ('en' | 'zh-CN' | 'zh-TW')[] = ['en', 'zh-CN', 'zh-TW'];
    
    languages.forEach(lng => {
      if (updated[lng]) {
        const mediaItems = (updated[lng]!.media.items || []).filter(item => item.id !== id);
        updated[lng]!.media.items = mediaItems;
      }
    });
    setLocales(updated);
  };

  // Update specific media field
  const handleUpdateMediaField = (id: string, field: keyof MediaItem, value: string) => {
    if (!curLocale) return;
    const mediaItems = curLocale.media.items.map(item => {
      if (item.id === id) {
        return { ...item, [field]: value };
      }
      return item;
    });

    setLocales({
      ...locales,
      [editLang]: {
        ...curLocale,
        media: {
          ...curLocale.media,
          items: mediaItems
        }
      }
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-zinc-50 flex flex-col items-center justify-center p-6 font-sans">
        <RefreshCw className="animate-spin text-zinc-900 mb-4" size={24} />
         <p className="text-zinc-600 font-medium">Loading administrative consoles...</p>
      </div>
    );
  }

  // LOGIN PAGE
  if (!isLoggedIn) {
    return (
      <div className="min-h-screen bg-zinc-50 flex items-center justify-center p-6 font-sans">
        <div className="w-full max-w-md bg-white border border-zinc-200 p-8 shadow-sm">
          <div className="mb-8">
            <h1 className="text-2xl font-bold tracking-tight text-zinc-900">Ethan Advisor ADMIN</h1>
            <p className="text-sm text-zinc-500 mt-1">Authenticating administrative console</p>
          </div>

          <form onSubmit={handleLogin} className="space-y-6">
            <div>
              <label className="block text-xs font-bold text-zinc-400 uppercase tracking-widest mb-1.5">
                Admin Password
              </label>
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter password..."
                className="w-full px-4 py-3 bg-zinc-50 border border-zinc-200 focus:border-zinc-900 focus:bg-white outline-none transition-all text-sm rounded-none"
              />
            </div>

            {loginError && (
              <div className="text-xs text-red-600 font-medium bg-red-50 p-3 flex items-center gap-2">
                <AlertCircle size={14} />
                <span>{loginError} (Default password is ethan2026)</span>
              </div>
            )}

            <button
              type="submit"
              className="w-full bg-zinc-900 hover:bg-zinc-800 text-white font-bold py-3 text-xs uppercase tracking-widest transition-all"
            >
              Sign In
            </button>
          </form>

          <div className="mt-8 pt-6 border-t border-zinc-100 flex justify-center">
            <a
              href="/"
              className="inline-flex items-center gap-1.5 text-xs text-zinc-400 hover:text-zinc-900 transition-colors"
            >
              <ArrowLeft size={12} /> Return to Public Site
            </a>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-zinc-50 font-sans">
      {/* Admin Header bar */}
      <header className="sticky top-0 z-50 bg-white border-b border-zinc-200 px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="flex flex-col">
            <h1 className="text-lg font-bold text-zinc-950 tracking-tight flex items-center gap-2">
              <Sparkles size={16} className="text-amber-500" /> Admin Console
            </h1>
            <span className="text-[10px] text-zinc-400 font-semibold tracking-wider uppercase font-mono">Ethan Chen Portfolio v1.5</span>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={handleSaveAll}
            disabled={saving}
            className="flex items-center gap-2 px-5 py-2.5 bg-green-700 hover:bg-green-800 text-white text-xs font-bold uppercase tracking-widest transition-all shadow-sm"
          >
            {saving ? <RefreshCw className="animate-spin" size={14} /> : <Save size={14} />}
            {saving ? 'Saving...' : 'Sync & Save'}
          </button>
          <a
            href="/"
            className="flex items-center gap-1.5 px-4 py-2 border border-zinc-200 text-zinc-600 hover:text-zinc-900 text-xs font-bold uppercase tracking-widest transition-all"
          >
            <ArrowLeft size={14} /> Close
          </a>
          <button
            onClick={handleLogout}
            className="p-2.5 text-zinc-400 hover:text-red-600 hover:bg-red-50 transition-all"
            title="Sign Out"
          >
            <LogOut size={16} />
          </button>
        </div>
      </header>

      <div className="max-w-7xl mx-auto p-6 md:p-8">
        {/* Status notification banner */}
        {statusMessage && (
          <div className={`p-4 mb-8 flex items-start gap-3 border ${
            statusMessage.type === 'success' 
              ? 'bg-green-50 border-green-200 text-green-800 animate-fadeIn' 
              : 'bg-red-50 border-red-200 text-red-800'
          }`}>
            {statusMessage.type === 'success' ? <CheckCircle2 size={18} className="mt-0.5" /> : <AlertCircle size={18} className="mt-0.5" />}
            <div>
              <p className="text-sm font-semibold">{statusMessage.text}</p>
              {statusMessage.type === 'success' && <p className="text-xs text-green-600/80 mt-1">The website is reloading state...</p>}
            </div>
          </div>
        )}

        {/* Dynamic global control header */}
        <div className="flex flex-col md:flex-row gap-6 items-start md:items-center justify-between mb-8 pb-6 border-b border-zinc-200">
          <div>
            <h2 className="text-sm font-bold text-zinc-400 uppercase tracking-widest">Active Editing Version</h2>
            <p className="text-xs text-zinc-500 mt-1">Complete your fields for one language tab, toggle translation tab, and submit your changes.</p>
          </div>

          <div className="flex bg-zinc-200 p-1">
            <button
              onClick={() => setEditLang('zh-TW')}
              className={`px-4 py-1.5 text-xs font-bold uppercase tracking-widest transition-all ${editLang === 'zh-TW' ? 'bg-zinc-950 text-white shadow-sm' : 'text-zinc-600 hover:text-zinc-900'}`}
            >
              繁體中文 (zh-TW)
            </button>
            <button
              onClick={() => setEditLang('zh-CN')}
              className={`px-4 py-1.5 text-xs font-bold uppercase tracking-widest transition-all ${editLang === 'zh-CN' ? 'bg-zinc-950 text-white shadow-sm' : 'text-zinc-600 hover:text-zinc-900'}`}
            >
              简体中文 (zh-CN)
            </button>
            <button
              onClick={() => setEditLang('en')}
              className={`px-4 py-1.5 text-xs font-bold uppercase tracking-widest transition-all ${editLang === 'en' ? 'bg-zinc-950 text-white shadow-sm' : 'text-zinc-600 hover:text-zinc-900'}`}
            >
              English (en)
            </button>
          </div>
        </div>

        {/* Primary editing grid with Sidebar */}
        <div className="grid md:grid-cols-4 gap-8">
          {/* Main Sidebar controls */}
          <aside className="space-y-2">
            <div className="p-3 text-[10px] font-bold text-zinc-400 uppercase tracking-widest italic block">Manage Profile Elements</div>
            <button
              onClick={() => setActiveTab('hero')}
              className={`w-full text-left px-4 py-3 text-xs font-bold uppercase tracking-wider flex items-center gap-3 border transition-all ${
                activeTab === 'hero' ? 'bg-zinc-950 text-white border-zinc-950 shadow-sm' : 'bg-white hover:bg-zinc-100 border-zinc-200 text-zinc-600'
              }`}
            >
              <User size={14} /> 1. Hero & Cover
            </button>
            <button
              onClick={() => setActiveTab('profile')}
              className={`w-full text-left px-4 py-3 text-xs font-bold uppercase tracking-wider flex items-center gap-3 border transition-all ${
                activeTab === 'profile' ? 'bg-zinc-950 text-white border-zinc-950 shadow-sm' : 'bg-white hover:bg-zinc-100 border-zinc-200 text-zinc-600'
              }`}
            >
              <FileText size={14} /> 2. Profile Details
            </button>
            <button
              onClick={() => setActiveTab('experience')}
              className={`w-full text-left px-4 py-3 text-xs font-bold uppercase tracking-wider flex items-center gap-3 border transition-all ${
                activeTab === 'experience' ? 'bg-zinc-950 text-white border-zinc-950 shadow-sm' : 'bg-white hover:bg-zinc-100 border-zinc-200 text-zinc-600'
              }`}
            >
              <Briefcase size={14} /> 3. Experiences
            </button>
            <button
              onClick={() => setActiveTab('services')}
              className={`w-full text-left px-4 py-3 text-xs font-bold uppercase tracking-wider flex items-center gap-3 border transition-all ${
                activeTab === 'services' ? 'bg-zinc-950 text-white border-zinc-950 shadow-sm' : 'bg-white hover:bg-zinc-100 border-zinc-200 text-zinc-600'
              }`}
            >
              <Globe size={14} /> 4. Consultation Topics
            </button>
            <button
              onClick={() => setActiveTab('media')}
              className={`w-full text-left px-4 py-3 text-xs font-bold uppercase tracking-wider flex items-center gap-3 border transition-all ${
                activeTab === 'media' ? 'bg-zinc-950 text-white border-zinc-950 shadow-sm' : 'bg-white hover:bg-zinc-100 border-zinc-200 text-zinc-600'
              }`}
            >
              <Award size={14} /> 5. Global Media Honors
            </button>
          </aside>

          {/* Form container component */}
          <div className="md:col-span-3 bg-white border border-zinc-200 p-6 md:p-8">
            {curLocale ? (
              <div>
                {/* 1. HERO EDITOR */}
                {activeTab === 'hero' && (
                  <div className="space-y-6">
                    <div className="pb-4 border-b border-zinc-100">
                      <h3 className="text-xl font-bold text-zinc-950 flex items-center gap-2">
                        <User size={18} /> Hero & Cover Area
                      </h3>
                      <p className="text-xs text-zinc-500 mt-1">Adjust top profile cover photo and description credentials.</p>
                    </div>

                    <div className="grid md:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-xs font-bold text-zinc-400 uppercase tracking-widest mb-1.5">
                          Professional Headshot Image URL / Path
                        </label>
                        <input
                          type="text"
                          value={curLocale.hero.imageUrl || ''}
                          onChange={(e) => updateField('hero', 'imageUrl', e.target.value)}
                          placeholder="/ethan_chen_professional_headshot_1780492073621.png"
                          className="w-full px-4 py-2.5 bg-zinc-50 border border-zinc-200 text-sm focus:bg-white focus:border-zinc-950 outline-none outline-none"
                        />
                        <span className="text-[10px] text-zinc-400 mt-1 block font-medium">Relative location in project or external secure HTTPS absolute photo source.</span>
                      </div>

                      <div>
                        <label className="block text-xs font-bold text-zinc-400 uppercase tracking-widest mb-1.5">
                          Full Representative Name / Display Title
                        </label>
                        <input
                          type="text"
                          value={curLocale.hero.name || ''}
                          onChange={(e) => updateField('hero', 'name', e.target.value)}
                          placeholder="Ethan Chen"
                          className="w-full px-4 py-2.5 bg-zinc-50 border border-zinc-200 text-sm focus:bg-white focus:border-zinc-950 outline-none"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-bold text-zinc-400 uppercase tracking-widest mb-1.5">
                          Cities / Hub Location Coordinates
                        </label>
                        <input
                          type="text"
                          value={curLocale.hero.location || ''}
                          onChange={(e) => updateField('hero', 'location', e.target.value)}
                          placeholder="Beijing / Shanghai / Taipei"
                          className="w-full px-4 py-2.5 bg-zinc-50 border border-zinc-200 text-sm focus:bg-white focus:border-zinc-950 outline-none"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-bold text-zinc-400 uppercase tracking-widest mb-1.5">
                          Active Professional Role Label
                        </label>
                        <input
                          type="text"
                          value={curLocale.hero.role || ''}
                          onChange={(e) => updateField('hero', 'role', e.target.value)}
                          placeholder="All-rounder Advisor"
                          className="w-full px-4 py-2.5 bg-zinc-50 border border-zinc-200 text-sm focus:bg-white focus:border-zinc-950 outline-none"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-zinc-400 uppercase tracking-widest mb-1.5">
                        Introductory Summary / Core Description Pitch
                      </label>
                      <textarea
                        rows={5}
                        value={curLocale.hero.description || ''}
                        onChange={(e) => updateField('hero', 'description', e.target.value)}
                        placeholder="Provide details about composite background..."
                        className="w-full px-4 py-2.5 bg-zinc-50 border border-zinc-200 text-sm focus:bg-white focus:border-zinc-950 outline-none"
                      />
                    </div>
                  </div>
                )}

                {/* 2. PROFILE DETAILS EDITOR */}
                {activeTab === 'profile' && (
                  <div className="space-y-6">
                    <div className="pb-4 border-b border-zinc-100">
                      <h3 className="text-xl font-bold text-zinc-950 flex items-center gap-2">
                        <FileText size={18} /> Profile Bio & Credentials
                      </h3>
                      <p className="text-xs text-zinc-500 mt-1">Modify biography summary, core indicators, advantage boxes, and profile honors.</p>
                    </div>

                    <div className="grid md:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-xs font-bold text-zinc-400 uppercase tracking-widest mb-1.5">
                          Composite Section title
                        </label>
                        <input
                          type="text"
                          value={curLocale.profile.title || ''}
                          onChange={(e) => updateField('profile', 'title', e.target.value)}
                          className="w-full px-4 py-2.5 bg-zinc-50 border border-zinc-200 text-sm focus:bg-white focus:border-zinc-950 outline-none"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-bold text-zinc-400 uppercase tracking-widest mb-1.5">
                          Subtitle Description
                        </label>
                        <input
                          type="text"
                          value={curLocale.profile.subtitle || ''}
                          onChange={(e) => updateField('profile', 'subtitle', e.target.value)}
                          className="w-full px-4 py-2.5 bg-zinc-50 border border-zinc-200 text-sm focus:bg-white focus:border-zinc-950 outline-none"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-zinc-400 uppercase tracking-widest mb-1.5">
                        Biography Paragraph 1
                      </label>
                      <textarea
                        rows={4}
                        value={curLocale.profile.p1 || ''}
                        onChange={(e) => updateField('profile', 'p1', e.target.value)}
                        className="w-full px-4 py-2.5 bg-zinc-50 border border-zinc-200 text-sm focus:bg-white focus:border-zinc-950 outline-none"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-zinc-400 uppercase tracking-widest mb-1.5">
                        Biography Paragraph 2
                      </label>
                      <textarea
                        rows={4}
                        value={curLocale.profile.p2 || ''}
                        onChange={(e) => updateField('profile', 'p2', e.target.value)}
                        className="w-full px-4 py-2.5 bg-zinc-50 border border-zinc-200 text-sm focus:bg-white focus:border-zinc-950 outline-none"
                      />
                    </div>

                    <div className="border border-zinc-100 p-4 space-y-4 bg-zinc-50/50">
                      <h4 className="text-xs font-bold uppercase tracking-wider text-zinc-500">Core Advantage Sub-Box</h4>
                      <div className="grid md:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-[10px] font-bold text-zinc-400 uppercase mb-1">Advantage Title</label>
                          <input
                            type="text"
                            value={curLocale.profile.advantage_title || ''}
                            onChange={(e) => updateField('profile', 'advantage_title', e.target.value)}
                            className="w-full px-3 py-2 bg-white border border-zinc-200 text-xs focus:border-zinc-950 outline-none text-sm"
                          />
                        </div>
                        <div>
                          <label className="block text-[10px] font-bold text-zinc-400 uppercase mb-1">Advantage Details</label>
                          <input
                            type="text"
                            value={curLocale.profile.advantage_desc || ''}
                            onChange={(e) => updateField('profile', 'advantage_desc', e.target.value)}
                            className="w-full px-3 py-2 bg-white border border-zinc-200 text-xs focus:border-zinc-950 outline-none text-sm"
                          />
                        </div>
                      </div>
                    </div>

                    <div className="border border-zinc-100 p-4 space-y-4 bg-zinc-50/50">
                      <h4 className="text-xs font-bold uppercase tracking-wider text-zinc-500">Professional Endorsement Box</h4>
                      <div className="grid md:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-[10px] font-bold text-zinc-400 uppercase mb-1">Endorsement Title</label>
                          <input
                            type="text"
                            value={curLocale.profile.endorsement_title || ''}
                            onChange={(e) => updateField('profile', 'endorsement_title', e.target.value)}
                            className="w-full px-3 py-2 bg-white border border-zinc-200 text-xs focus:border-zinc-950 outline-none text-sm"
                          />
                        </div>
                        <div>
                          <label className="block text-[10px] font-bold text-zinc-400 uppercase mb-1">Endorsement Details</label>
                          <input
                            type="text"
                            value={curLocale.profile.endorsement_desc || ''}
                            onChange={(e) => updateField('profile', 'endorsement_desc', e.target.value)}
                            className="w-full px-3 py-2 bg-white border border-zinc-200 text-xs focus:border-zinc-950 outline-none text-sm"
                          />
                        </div>
                      </div>
                    </div>

                    <div className="border border-zinc-100 p-4 space-y-4 bg-zinc-50/50">
                      <h4 className="text-xs font-bold uppercase tracking-wider text-zinc-500">Core Metrics Value</h4>
                      <div className="grid grid-cols-3 gap-4">
                        <div>
                          <label className="block text-[10px] font-bold text-zinc-400 uppercase mb-1">Experience Years</label>
                          <input
                            type="text"
                            value={curLocale.profile.exp_value || ''}
                            onChange={(e) => updateField('profile', 'exp_value', e.target.value)}
                            className="w-full px-3 py-2 bg-white border border-zinc-200 text-xs focus:border-zinc-950 outline-none text-sm"
                          />
                        </div>
                        <div>
                          <label className="block text-[10px] font-bold text-zinc-400 uppercase mb-1">Zaih Platform Rating</label>
                          <input
                            type="text"
                            value={curLocale.profile.rating_value || ''}
                            onChange={(e) => updateField('profile', 'rating_value', e.target.value)}
                            className="w-full px-3 py-2 bg-white border border-zinc-200 text-xs focus:border-zinc-950 outline-none text-sm"
                          />
                        </div>
                        <div>
                          <label className="block text-[10px] font-bold text-zinc-400 uppercase mb-1">Focus Identity</label>
                          <input
                            type="text"
                            value={curLocale.profile.role_value || ''}
                            onChange={(e) => updateField('profile', 'role_value', e.target.value)}
                            className="w-full px-3 py-2 bg-white border border-zinc-200 text-xs focus:border-zinc-950 outline-none text-sm"
                          />
                        </div>
                      </div>
                    </div>

                    {/* Profile Honors Sub-items */}
                    <div className="border border-zinc-100 p-4 space-y-4">
                      <h4 className="text-xs font-bold uppercase tracking-wider text-zinc-500">Profile Block Honors (Quick list of 4 items)</h4>
                      <div className="grid md:grid-cols-2 gap-4">
                        {['item1', 'item2', 'item3', 'item4'].map(key => (
                          <div key={key} className="p-3 border border-zinc-200 bg-white space-y-2">
                            <span className="text-[10px] font-bold text-zinc-400 uppercase block">Honor {key === 'item1' ? '1' : key === 'item2' ? '2' : key === 'item3' ? '3' : '4'}</span>
                            <div className="space-y-1.5">
                              <input
                                type="text"
                                placeholder="Category (e.g. Media)"
                                value={curLocale.profile.honors?.[key]?.cat || ''}
                                onChange={(e) => updateHonorsField(key, 'cat', e.target.value)}
                                className="w-full px-2.5 py-1.5 bg-zinc-50 border border-zinc-100 text-xs focus:bg-white focus:border-zinc-950 outline-none"
                              />
                              <input
                                type="text"
                                placeholder="Honor Title"
                                value={curLocale.profile.honors?.[key]?.title || ''}
                                onChange={(e) => updateHonorsField(key, 'title', e.target.value)}
                                className="w-full px-2.5 py-1.5 bg-zinc-50 border border-zinc-100 text-xs focus:bg-white focus:border-zinc-950 outline-none"
                              />
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                )}

                {/* 3. PRACTICAL EXPERIENCES EDITOR */}
                {activeTab === 'experience' && (
                  <div className="space-y-6">
                    <div className="pb-4 border-b border-zinc-100 flex items-center justify-between">
                      <div>
                        <h3 className="text-xl font-bold text-zinc-950 flex items-center gap-2">
                          <Briefcase size={18} /> Practical Career Timeline
                        </h3>
                        <p className="text-xs text-zinc-500 mt-1">Add, update, or remove practical executive experiences blocks.</p>
                      </div>
                      <button
                        onClick={handleAddExperience}
                        className="flex items-center gap-1.5 px-3 py-1.5 bg-zinc-900 text-white text-xs font-semibold uppercase tracking-wider hover:bg-zinc-850 transition-colors"
                      >
                        <Plus size={12} /> Add Experience
                      </button>
                    </div>

                    <div className="space-y-6">
                      {(curLocale.experience.items || []).map((exp, expIdx) => (
                        <div key={expIdx} className="p-5 border border-zinc-200 hover:border-zinc-500 transition-all bg-zinc-50/20 relative group">
                          <button
                            onClick={() => handleDeleteExperience(expIdx)}
                            className="absolute top-4 right-4 text-zinc-300 hover:text-red-600 transition-colors"
                            title="Delete Experience"
                          >
                            <Trash2 size={16} />
                          </button>

                          <span className="text-[10px] font-black italic text-zinc-200 uppercase block mb-3">Position #{expIdx + 1}</span>
                          
                          <div className="grid md:grid-cols-3 gap-4">
                            <div>
                              <label className="block text-[10px] font-bold text-zinc-400 uppercase tracking-wider mb-1">Time Range / Span</label>
                              <input
                                type="text"
                                value={exp.year || ''}
                                onChange={(e) => handleUpdateExperience(expIdx, 'year', e.target.value)}
                                placeholder="e.g. 2017 - 2024"
                                className="w-full px-3 py-2 bg-white border border-zinc-200 text-xs focus:border-zinc-950 outline-none font-mono font-bold"
                              />
                            </div>
                            <div>
                              <label className="block text-[10px] font-bold text-zinc-400 uppercase tracking-wider mb-1">Professional Job Title</label>
                              <input
                                type="text"
                                value={exp.title || ''}
                                onChange={(e) => handleUpdateExperience(expIdx, 'title', e.target.value)}
                                placeholder="Co-founder & COO"
                                className="w-full px-3 py-2 bg-white border border-zinc-200 text-xs focus:border-zinc-950 outline-none"
                              />
                            </div>
                            <div>
                              <label className="block text-[10px] font-bold text-zinc-400 uppercase tracking-wider mb-1">Company / Subtitle</label>
                              <input
                                type="text"
                                value={exp.subtitle || ''}
                                onChange={(e) => handleUpdateExperience(expIdx, 'subtitle', e.target.value)}
                                placeholder="ASUS / Linxi Venture"
                                className="w-full px-3 py-2 bg-white border border-zinc-200 text-xs focus:border-zinc-950 outline-none"
                              />
                            </div>
                          </div>

                          <div className="mt-4">
                            <label className="block text-[10px] font-bold text-zinc-400 uppercase tracking-wider mb-1">Task Descriptions & Contributions summary</label>
                            <textarea
                              rows={2}
                              value={exp.desc || ''}
                              onChange={(e) => handleUpdateExperience(expIdx, 'desc', e.target.value)}
                              placeholder="Describe core metrics or management duties..."
                              className="w-full px-3 py-2 bg-white border border-zinc-200 text-xs focus:border-zinc-950 outline-none"
                            />
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* 4. ADVISORY SERVICES (TOPICS) EDITOR */}
                {activeTab === 'services' && (
                  <div className="space-y-6">
                    <div className="pb-4 border-b border-zinc-100">
                      <h3 className="text-xl font-bold text-zinc-950 flex items-center gap-2">
                        <Globe size={18} /> Consulting Topics & Services
                      </h3>
                      <p className="text-xs text-zinc-500 mt-1">Configure pricing, descriptions, titles, and list items for each of the 5 advisory plans.</p>
                    </div>

                    <div className="space-y-8">
                      {['item1', 'item2', 'item3', 'item4', 'item5'].map((key, topicIdx) => {
                        const svc = curLocale.services?.[key] || { title: '', desc: '', bullets: [], priceOnline: '', priceMeetup: '' };
                        return (
                          <div key={key} className="p-6 border border-zinc-250 bg-zinc-50/10 space-y-4">
                            <div className="flex items-center justify-between border-b border-zinc-100 pb-2">
                              <span className="text-xs font-bold text-zinc-400 tracking-widest uppercase italic">Advisory Category #{topicIdx + 1} ({key})</span>
                            </div>

                            <div className="grid md:grid-cols-2 gap-4">
                              <div className="md:col-span-2">
                                <label className="block text-[10px] font-bold text-zinc-400 uppercase mb-1">Advisory Services Title</label>
                                <input
                                  type="text"
                                  value={svc.title || ''}
                                  onChange={(e) => handleUpdateServiceField(key, 'title', e.target.value)}
                                  placeholder="Type plans details..."
                                  className="w-full px-3 py-2 bg-white border border-zinc-200 text-xs focus:border-zinc-950 outline-none text-sm font-semibold text-zinc-900"
                                />
                              </div>

                              <div className="md:col-span-2">
                                <label className="block text-[10px] font-bold text-zinc-400 uppercase mb-1">Service Brief Description</label>
                                <textarea
                                  rows={2}
                                  value={svc.desc || ''}
                                  onChange={(e) => handleUpdateServiceField(key, 'desc', e.target.value)}
                                  placeholder="Summarize target audiences and help metrics..."
                                  className="w-full px-3 py-2 bg-white border border-zinc-200 text-xs focus:border-zinc-950 outline-none"
                                />
                              </div>

                              <div>
                                <label className="block text-[10px] font-bold text-zinc-400 uppercase mb-1">Online Price Quote</label>
                                <input
                                  type="text"
                                  value={svc.priceOnline || ''}
                                  onChange={(e) => handleUpdateServiceField(key, 'priceOnline', e.target.value)}
                                  placeholder="¥499/h"
                                  className="w-full px-3 py-2 bg-white border border-zinc-200 text-xs focus:border-zinc-950 outline-none font-mono"
                                />
                              </div>

                              <div>
                                <label className="block text-[10px] font-bold text-zinc-400 uppercase mb-1">Offline Meetup Price Quote</label>
                                <input
                                  type="text"
                                  value={svc.priceMeetup || ''}
                                  onChange={(e) => handleUpdateServiceField(key, 'priceMeetup', e.target.value)}
                                  placeholder="¥2000/2h"
                                  className="w-full px-3 py-2 bg-white border border-zinc-200 text-xs focus:border-zinc-950 outline-none font-mono"
                                />
                              </div>
                            </div>

                            {/* Bullet value list updates */}
                            <div className="space-y-3 bg-white p-4 border border-zinc-150">
                              <div className="flex items-center justify-between">
                                <h4 className="text-[10px] font-bold text-zinc-400 uppercase">Core Benefits / Takeaways List</h4>
                                <button
                                  onClick={() => handleAddBullet(key)}
                                  className="flex items-center gap-1 px-2 py-1 bg-zinc-100 hover:bg-zinc-200 text-[10px] font-semibold text-zinc-800"
                                >
                                  <Plus size={10} /> Add bullet
                                </button>
                              </div>

                              {Array.isArray(svc.bullets) && svc.bullets.map((bValue, bIdx) => (
                                <div key={bIdx} className="flex items-center gap-2">
                                  <span className="text-zinc-300 text-xs font-mono">/</span>
                                  <input
                                    type="text"
                                    value={bValue || ''}
                                    onChange={(e) => handleUpdateBullet(key, bIdx, e.target.value)}
                                    className="flex-1 px-2 py-1 bg-zinc-50 text-xs border border-zinc-100 focus:bg-white outline-none focus:border-zinc-950"
                                  />
                                  <button
                                    onClick={() => handleDeleteBullet(key, bIdx)}
                                    className="p-1 text-zinc-300 hover:text-red-500 hover:bg-red-50"
                                    title="Delete Bullet"
                                  >
                                    <Trash2 size={12} />
                                  </button>
                                </div>
                              ))}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}

                {/* 5. GLOBAL MEDIA HONORS EDITOR */}
                {activeTab === 'media' && (
                  <div className="space-y-6">
                    <div className="pb-4 border-b border-zinc-100 flex items-center justify-between">
                      <div>
                        <h3 className="text-xl font-bold text-zinc-950 flex items-center gap-2">
                          <Award size={18} /> Global Media & Honors Area
                        </h3>
                        <p className="text-xs text-zinc-500 mt-1">Manage global industry coverage list. Add new images, edit categories or titles, and delete obsolete entries.</p>
                      </div>
                      <button
                        onClick={handleAddMedia}
                        className="flex items-center gap-1.5 px-3 py-1.5 bg-zinc-900 text-white text-xs font-semibold uppercase tracking-wider hover:bg-zinc-850 transition-colors"
                      >
                        <Plus size={12} /> Add Hero Item
                      </button>
                    </div>

                    <div className="grid md:grid-cols-2 gap-6">
                      {(curLocale.media.items || []).map((item, mIdx) => (
                        <div key={item.id} className="p-4 border border-zinc-200 bg-zinc-50/20 rounded relative group flex flex-col justify-between">
                          <button
                            onClick={() => handleDeleteMedia(item.id)}
                            className="absolute top-4 right-4 text-zinc-350 hover:text-red-600 transition-colors"
                            title="Delete this honor block"
                          >
                            <Trash2 size={16} />
                          </button>

                          <div className="space-y-3">
                            <span className="text-[10px] font-bold text-zinc-400 block tracking-wider uppercase">ARCHIVE 0{mIdx + 1}</span>
                            
                            <div>
                              <label className="block text-[10px] font-bold text-zinc-400 uppercase mb-1">Discussions Title / Description</label>
                              <input
                                type="text"
                                value={item.title || ''}
                                onChange={(e) => handleUpdateMediaField(item.id, 'title', e.target.value)}
                                placeholder="Title of interview..."
                                className="w-full px-2.5 py-1.5 bg-white border border-zinc-200 text-xs focus:border-zinc-950 outline-none font-medium"
                              />
                            </div>

                            <div>
                              <label className="block text-[10px] font-bold text-zinc-400 uppercase mb-1">Categories Label</label>
                              <input
                                type="text"
                                value={item.category || ''}
                                onChange={(e) => handleUpdateMediaField(item.id, 'category', e.target.value)}
                                placeholder="Media / Activity / Honor"
                                className="w-full px-2.5 py-1.5 bg-white border border-zinc-200 text-xs focus:border-zinc-950 outline-none"
                              />
                            </div>

                            <div>
                              <label className="block text-[10px] font-bold text-zinc-400 uppercase mb-1">Image URL / Local File Path</label>
                              <input
                                type="text"
                                value={item.imageUrl || ''}
                                onChange={(e) => handleUpdateMediaField(item.id, 'imageUrl', e.target.value)}
                                placeholder="Path..."
                                className="w-full px-2.5 py-1.5 bg-white border border-zinc-200 text-xs focus:border-zinc-950 outline-none font-mono"
                              />
                            </div>
                          </div>

                          <div className="mt-4 pt-3 border-t border-zinc-100 flex items-center justify-between">
                            <div className="text-[10px] font-medium text-zinc-400">Media Preview:</div>
                            <div className="w-16 h-10 bg-zinc-100 border overflow-hidden">
                              <img
                                src={item.imageUrl}
                                alt="preview"
                                className="w-full h-full object-cover"
                                onError={(e) => {
                                  (e.target as HTMLImageElement).src = '/ethan_chen_professional_headshot_1780492073621.png';
                                }}
                              />
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className="text-center p-12">
                <AlertCircle size={24} className="text-zinc-400 mx-auto mb-2" />
                <p className="text-zinc-500 text-sm">Failed to resolve locale profile. Please check localization configuration files.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
