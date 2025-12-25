
import React, { useState, useEffect } from 'react';
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
  const gemini = new GeminiService();

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchQuery.trim() || searching) return;

    setSearching(true);
    try {
      const localLang = initialLanguages.find(l => l.name.toLowerCase() === searchQuery.toLowerCase());
      if (localLang) {
        setSelectedLanguage(localLang);
      } else {
        const guideData = await gemini.getDynamicLanguageGuide(searchQuery, appLang);
        const dynamicLang: ProgrammingLanguage = {
          id: searchQuery.toLowerCase(),
          name: searchQuery,
          icon: '✨',
          color: 'bg-indigo-500',
          difficulty: 'Intermediate',
          useCases: (guideData.useCases as string[]) || [],
          description: { 
            en: appLang === 'en' ? String(guideData.description || '') : '', 
            ar: appLang === 'ar' ? String(guideData.description || '') : '' 
          },
          tools: (guideData.tools as any[])?.map(t => ({
            name: t.name,
            platform: t.platform,
            url: t.url,
            description: { en: t.description, ar: t.description }
          })) || [],
          helloWorld: guideData.helloWorld
        };
        setSelectedLanguage(dynamicLang);
      }
      document.getElementById('details')?.scrollIntoView({ behavior: 'smooth' });
    } catch (err) {
      alert(appLang === 'ar' ? 'عذراً، لم نتمكن من العثور على هذه اللغة.' : 'Sorry, we couldn\'t find details for this language.');
    } finally {
      setSearching(false);
    }
  };

  const toggleLang = () => {
    setAppLang(prev => prev === 'ar' ? 'en' : 'ar');
  };

  return (
    <div className={`min-h-screen bg-slate-50 dark:bg-slate-950 transition-colors duration-500 ${appLang === 'ar' ? 'rtl font-["Cairo"]' : 'ltr font-["Inter"]'}`} dir={appLang === 'ar' ? 'rtl' : 'ltr'}>
      {/* Navbar */}
      <nav className={`fixed top-0 w-full z-50 transition-all duration-300 ${isScrolled ? 'glass shadow-md py-3' : 'bg-transparent py-6'}`}>
        <div className="max-w-7xl mx-auto px-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <img src="public/icon.svg" className="w-10 h-10 rounded-xl shadow-lg" alt="Logo" />
            <h1 className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 to-purple-600">
              CodeMaster AI
            </h1>
          </div>
          
          <button 
            onClick={toggleLang}
            className="px-4 py-2 rounded-full border border-slate-200 dark:border-slate-700 bg-white/80 dark:bg-slate-800/80 hover:bg-white text-xs font-bold transition-all shadow-sm"
          >
            {appLang === 'ar' ? 'English' : 'العربية'}
          </button>
        </div>
      </nav>

      {/* Hero with Search */}
      <section className="pt-32 pb-12 px-4 bg-gradient-to-b from-indigo-50 to-white dark:from-slate-900 dark:to-slate-950">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl md:text-6xl font-extrabold text-slate-900 dark:text-white mb-6 leading-tight">
            {appLang === 'ar' ? 'تعلم أي لغة برمجة في العالم' : 'Learn Any Programming Language'}
          </h2>
          <p className="text-lg text-slate-600 dark:text-slate-400 mb-10 max-w-2xl mx-auto">
            {appLang === 'ar'
              ? 'ابحث عن أي لغة، من الأسهل للأصعب، واحصل على أدوات المشاريع والشرح المبسط فوراً.'
              : 'Search for any language, from easiest to hardest, and get project tools and simplified explanations instantly.'}
          </p>
          
          <form onSubmit={handleSearch} className="max-w-xl mx-auto relative group">
            <input 
              type="text" 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={appLang === 'ar' ? 'ابحث عن لغة (مثال: Java, Rust, SQL)...' : 'Search language (e.g. Java, Rust, SQL)...'}
              className="w-full pl-6 pr-32 py-5 rounded-2xl border-2 border-transparent bg-white dark:bg-slate-800 shadow-2xl focus:border-indigo-500 outline-none dark:text-white group-hover:shadow-indigo-100 dark:group-hover:shadow-none transition-all"
            />
            <button 
              type="submit"
              disabled={searching}
              className="absolute right-2 top-2 bottom-2 px-6 bg-indigo-600 text-white rounded-xl font-bold hover:bg-indigo-700 transition-all shadow-lg disabled:opacity-50"
            >
              {searching ? (appLang === 'ar' ? 'جاري البحث...' : 'Searching...') : (appLang === 'ar' ? 'ابدأ' : 'Start')}
            </button>
          </form>
        </div>
      </section>

      <main className="max-w-7xl mx-auto px-4 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          <div className="lg:col-span-8 space-y-12">
            <div>
              <h3 className="text-2xl font-bold mb-8 text-slate-800 dark:text-white">
                {appLang === 'ar' ? 'لغات مقترحة للمبتدئين' : 'Suggested for Beginners'}
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {initialLanguages.map(lang => (
                  <LanguageCard 
                    key={lang.id} 
                    lang={lang} 
                    appLang={appLang} 
                    onSelect={(id) => setSelectedLanguage(initialLanguages.find(l => l.id === id) || null)} 
                  />
                ))}
              </div>
            </div>

            {selectedLanguage && (
              <div id="details" className="bg-white dark:bg-slate-900 rounded-3xl p-8 shadow-2xl border border-indigo-100 dark:border-slate-800 animate-in fade-in slide-in-from-bottom-8 duration-500">
                <div className="flex items-center justify-between mb-8">
                  <div className="flex items-center gap-4">
                    <div className={`w-16 h-16 ${selectedLanguage.color} rounded-2xl flex items-center justify-center text-4xl shadow-xl text-white`}>
                      {selectedLanguage.icon}
                    </div>
                    <div>
                      <h2 className="text-3xl font-bold text-slate-800 dark:text-white">{selectedLanguage.name}</h2>
                      <span className="text-indigo-600 dark:text-indigo-400 font-bold text-xs uppercase tracking-widest">{selectedLanguage.difficulty}</span>
                    </div>
                  </div>
                  <button onClick={() => setSelectedLanguage(null)} className="p-2 bg-slate-100 dark:bg-slate-800 rounded-full hover:rotate-90 transition-all">
                    <svg className="w-5 h-5 text-slate-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" /></svg>
                  </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                  <div className="space-y-6">
                    <div>
                      <h4 className="font-bold text-slate-800 dark:text-white mb-2">{appLang === 'ar' ? 'ما هي هذه اللغة؟' : 'What is it?'}</h4>
                      <p className="text-slate-600 dark:text-slate-400 leading-relaxed text-sm">
                        {selectedLanguage.description[appLang] || selectedLanguage.description.ar || selectedLanguage.description.en}
                      </p>
                    </div>
                    
                    <div>
                      <h4 className="font-bold text-slate-800 dark:text-white mb-3">{appLang === 'ar' ? 'مجالات الاستخدام' : 'Common Uses'}</h4>
                      <div className="flex flex-wrap gap-2">
                        {selectedLanguage.useCases.map((use, idx) => (
                          <span key={idx} className="bg-indigo-50 dark:bg-slate-800 text-indigo-700 dark:text-indigo-300 px-3 py-1 rounded-lg text-xs font-bold">{use}</span>
                        ))}
                      </div>
                    </div>
                  </div>

                  <div className="space-y-6">
                    {selectedLanguage.helloWorld && (
                      <div className="bg-slate-900 rounded-2xl p-4 overflow-hidden shadow-inner">
                        <div className="flex justify-between items-center mb-2 px-1">
                          <span className="text-[10px] text-slate-500 font-mono">CODE EXAMPLE</span>
                          <div className="flex gap-1">
                            <div className="w-2 h-2 rounded-full bg-red-500"></div>
                            <div className="w-2 h-2 rounded-full bg-yellow-500"></div>
                            <div className="w-2 h-2 rounded-full bg-green-500"></div>
                          </div>
                        </div>
                        <pre className="text-xs text-indigo-300 font-mono overflow-x-auto p-2">
                          {selectedLanguage.helloWorld}
                        </pre>
                      </div>
                    )}

                    <div>
                      <h4 className="font-bold text-slate-800 dark:text-white mb-3">{appLang === 'ar' ? 'أدوات مقترحة' : 'Suggested Tools'}</h4>
                      <div className="space-y-2">
                        {selectedLanguage.tools.map((tool, idx) => (
                          <a key={idx} href={tool.url} target="_blank" className="flex items-center justify-between p-3 bg-slate-50 dark:bg-slate-800 rounded-xl hover:bg-indigo-50 dark:hover:bg-indigo-900/20 border border-transparent hover:border-indigo-200 transition-all">
                            <div className="flex items-center gap-3">
                              <span className="text-xl">🛠️</span>
                              <div>
                                <p className="text-sm font-bold text-slate-800 dark:text-white leading-tight">{tool.name}</p>
                                <p className="text-[10px] text-slate-500">{tool.platform}</p>
                              </div>
                            </div>
                            <svg className="w-4 h-4 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" /></svg>
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
            <ProjectHelper appLang={appLang} />
            <AITutor appLang={appLang} />
          </div>

        </div>
      </main>

      <footer className="bg-slate-900 text-white py-12 mt-20 border-t border-slate-800">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <p className="text-slate-500 text-sm mb-2">CodeMaster AI - {appLang === 'ar' ? 'بوابتك لعالم البرمجة' : 'Your Gateway to Coding'}</p>
          <p className="text-[10px] text-slate-700 tracking-widest uppercase font-bold">&copy; 2025 ALL RIGHTS RESERVED</p>
        </div>
      </footer>
    </div>
  );
};

export default App;
