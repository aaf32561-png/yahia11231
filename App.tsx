import React, { useState, useEffect, useMemo } from 'react';
import { AppLanguage, ProgrammingLanguage } from './types';
import { languages as initialLanguages } from './data/languages';
import LanguageCard from './components/LanguageCard';
import AITutor from './components/AITutor';
import ProjectHelper from './components/ProjectHelper';
import { GeminiService } from './services/geminiService';

const App: React.FC = () => {
  const [appLang, setAppLang] = useState<AppLanguage>('ar');
  const [selectedLanguage, setSelectedLanguage] = useState<ProgrammingLanguage | null>(null);
  const [isScrolled, setIsScrolled] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [searching, setSearching] = useState(false);
  
  const gemini = useMemo(() => new GeminiService(), []);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 10);
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchQuery.trim() || searching) return;

    setSearching(true);
    try {
      const q = searchQuery.toLowerCase().trim();
      const local = initialLanguages.find(l => l.name.toLowerCase() === q || l.id === q);
      
      if (local) {
        setSelectedLanguage(local);
      } else {
        const guide = await gemini.getDynamicLanguageGuide(searchQuery, appLang);
        const dynamic: ProgrammingLanguage = {
          id: q.replace(/\s+/g, '-'),
          name: searchQuery,
          icon: '✨',
          color: 'bg-indigo-600',
          difficulty: 'Intermediate',
          useCases: guide.useCases || [],
          description: { 
            en: appLang === 'en' ? String(guide.description) : '', 
            ar: appLang === 'ar' ? String(guide.description) : '' 
          },
          tools: (guide.tools || []).map((t: any) => ({
            name: t.name,
            platform: t.platform,
            url: t.url,
            description: { en: t.description, ar: t.description }
          })),
          helloWorld: guide.helloWorld
        };
        setSelectedLanguage(dynamic);
      }
      
      setTimeout(() => {
        const el = document.getElementById('details');
        if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }, 200);
    } catch (err) {
      alert(appLang === 'ar' ? 'فشل الاتصال بالذكاء الاصطناعي، يرجى التحقق من الإنترنت.' : 'AI connection failed. Check your internet.');
    } finally {
      setSearching(false);
    }
  };

  return (
    <div className={`min-h-screen bg-slate-50 dark:bg-slate-950 transition-colors duration-500 pb-16 ${appLang === 'ar' ? 'rtl font-["Cairo"]' : 'ltr font-["Inter"]'}`} dir={appLang === 'ar' ? 'rtl' : 'ltr'}>
      {/* Navbar - Sticky & Clean */}
      <nav className={`fixed top-0 w-full z-50 transition-all duration-300 ${isScrolled ? 'glass-nav shadow-sm py-2' : 'bg-transparent py-4'}`}>
        <div className="max-w-7xl mx-auto px-5 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <img src="icon.svg" className="w-10 h-10 rounded-2xl shadow-md" alt="Logo" />
            <h1 className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 to-purple-600">
              CodeMaster
            </h1>
          </div>
          <button 
            onClick={() => setAppLang(l => l === 'ar' ? 'en' : 'ar')}
            className="px-4 py-1.5 rounded-full bg-indigo-600 text-white text-xs font-bold hover:bg-indigo-700 transition-transform active:scale-95 shadow-lg"
          >
            {appLang === 'ar' ? 'English' : 'العربية'}
          </button>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="pt-32 pb-12 px-5 bg-gradient-to-b from-indigo-50/50 to-transparent">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl md:text-6xl font-black text-slate-900 mb-4 tracking-tight leading-tight">
            {appLang === 'ar' ? 'مستقبلك يبدأ بالكود' : 'Your Future Starts with Code'}
          </h2>
          <p className="text-slate-600 mb-8 max-w-xl mx-auto">
            {appLang === 'ar' 
              ? 'تطبيقك الشامل لتعلم أي لغة برمجة بأسلوب ممتع وذكي.' 
              : 'Your all-in-one app to learn any language with fun and AI.'}
          </p>
          
          <form onSubmit={handleSearch} className="max-w-md mx-auto relative group">
            <input 
              type="text" 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={appLang === 'ar' ? 'ابحث عن لغة...' : 'Search language...'}
              className="w-full pl-6 pr-28 py-4 rounded-3xl border-0 bg-white shadow-2xl focus:ring-2 focus:ring-indigo-500 outline-none text-slate-800 transition-all"
            />
            <button 
              type="submit"
              disabled={searching}
              className="absolute right-2 top-2 bottom-2 px-6 bg-indigo-600 text-white rounded-2xl font-bold text-sm shadow-md active:scale-95 disabled:opacity-50"
            >
              {searching ? '...' : (appLang === 'ar' ? 'ابدأ' : 'Start')}
            </button>
          </form>
        </div>
      </section>

      <main className="max-w-7xl mx-auto px-5 mt-4">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          <div className="lg:col-span-8 space-y-12">
            <div>
              <h3 className="text-xl font-bold mb-6 text-slate-800 flex items-center gap-2">
                <span className="w-1.5 h-6 bg-indigo-600 rounded-full"></span>
                {appLang === 'ar' ? 'لغات ننصح بها' : 'Recommended Languages'}
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                {initialLanguages.map(l => (
                  <LanguageCard 
                    key={l.id} 
                    lang={l} 
                    appLang={appLang} 
                    onSelect={(id) => {
                      setSelectedLanguage(initialLanguages.find(x => x.id === id) || null);
                      setTimeout(() => document.getElementById('details')?.scrollIntoView({behavior:'smooth'}), 100);
                    }} 
                  />
                ))}
              </div>
            </div>

            {selectedLanguage && (
              <div id="details" className="bg-white rounded-[2.5rem] p-8 shadow-xl border border-slate-100 animate-in fade-in slide-in-from-bottom-5 duration-500">
                <div className="flex items-center justify-between mb-8">
                  <div className="flex items-center gap-5">
                    <div className={`w-16 h-16 ${selectedLanguage.color} rounded-2xl flex items-center justify-center text-3xl text-white shadow-lg`}>
                      {selectedLanguage.icon}
                    </div>
                    <div>
                      <h2 className="text-3xl font-bold text-slate-900">{selectedLanguage.name}</h2>
                      <span className="text-indigo-600 font-bold text-[10px] uppercase tracking-widest">{selectedLanguage.difficulty}</span>
                    </div>
                  </div>
                  <button onClick={() => setSelectedLanguage(null)} className="p-3 bg-slate-50 rounded-full active:scale-90 transition-transform">
                    <svg className="w-5 h-5 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" /></svg>
                  </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                  <div className="space-y-8">
                    <div>
                      <h4 className="font-bold text-slate-800 mb-3">{appLang === 'ar' ? 'نظرة عامة' : 'Overview'}</h4>
                      <p className="text-slate-600 leading-relaxed text-sm">
                        {selectedLanguage.description[appLang] || selectedLanguage.description.ar || selectedLanguage.description.en}
                      </p>
                    </div>
                    <div>
                      <h4 className="font-bold text-slate-800 mb-3">{appLang === 'ar' ? 'أين تُستخدم؟' : 'Where is it used?'}</h4>
                      <div className="flex flex-wrap gap-2">
                        {selectedLanguage.useCases.map((u, i) => (
                          <span key={i} className="bg-indigo-50 text-indigo-700 px-4 py-1.5 rounded-xl text-xs font-semibold">{u}</span>
                        ))}
                      </div>
                    </div>
                  </div>

                  <div className="space-y-8">
                    {selectedLanguage.helloWorld && (
                      <div className="bg-slate-900 rounded-3xl p-5 shadow-inner">
                        <div className="flex items-center gap-1.5 mb-3 opacity-50">
                          <div className="w-2.5 h-2.5 rounded-full bg-red-500"></div>
                          <div className="w-2.5 h-2.5 rounded-full bg-yellow-500"></div>
                          <div className="w-2.5 h-2.5 rounded-full bg-green-500"></div>
                        </div>
                        <pre className="text-indigo-300 font-mono text-xs overflow-x-auto">
                          {selectedLanguage.helloWorld}
                        </pre>
                      </div>
                    )}
                    <div>
                      <h4 className="font-bold text-slate-800 mb-4">{appLang === 'ar' ? 'أفضل الأدوات' : 'Best Tools'}</h4>
                      <div className="grid gap-3">
                        {selectedLanguage.tools.map((t, i) => (
                          <a key={i} href={t.url} target="_blank" className="flex items-center justify-between p-4 bg-slate-50 rounded-2xl hover:bg-white hover:shadow-md transition-all border border-transparent hover:border-indigo-100">
                            <div className="flex items-center gap-3">
                              <span className="text-xl">🚀</span>
                              <div>
                                <h5 className="text-sm font-bold text-slate-900">{t.name}</h5>
                                <p className="text-[10px] text-slate-500">{t.platform}</p>
                              </div>
                            </div>
                            <svg className="w-4 h-4 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3" /></svg>
                          </a>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>

          <div className="lg:col-span-4 space-y-8">
            <AITutor appLang={appLang} />
            <ProjectHelper appLang={appLang} />
          </div>

        </div>
      </main>

      <footer className="text-center py-12 opacity-30 text-[10px] font-bold tracking-widest uppercase">
        CodeMaster AI &copy; 2025
      </footer>
    </div>
  );
};

export default App;