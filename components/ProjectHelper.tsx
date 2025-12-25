import React, { useState, useMemo } from 'react';
import { AppLanguage, ProjectRoadmap } from '../types';
import { GeminiService } from '../services/geminiService';

interface Props {
  appLang: AppLanguage;
}

const ProjectHelper: React.FC<Props> = ({ appLang }) => {
  const [idea, setIdea] = useState('');
  const [roadmap, setRoadmap] = useState<ProjectRoadmap | null>(null);
  const [loading, setLoading] = useState(false);
  
  const gemini = useMemo(() => new GeminiService(), []);

  const handleGenerate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!idea.trim() || loading) return;
    setLoading(true);
    try {
      const result = await gemini.generateProjectRoadmap(idea, appLang);
      setRoadmap(result);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 shadow-xl border border-orange-100 dark:border-slate-800">
      <h3 className="text-xl font-bold mb-4 flex items-center gap-2 text-orange-600">
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.628.283a2 2 0 01-1.631 0l-.628-.283a6 6 0 00-3.86-.517l-2.387.477a2 2 0 00-1.022.547V18.318a2 2 0 00.586 1.414l2.586 2.586a2 2 0 001.414.586h10.828a2 2 0 001.414-.586l2.586-2.586a2 2 0 00.586-1.414v-2.89z" />
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 8a3 3 0 11-6 0 3 3 0 016 0z" />
        </svg>
        {appLang === 'ar' ? 'مساعد المشاريع' : 'Project Builder'}
      </h3>
      
      <p className="text-sm text-slate-500 mb-6">
        {appLang === 'ar' 
          ? 'اكتب فكرتك وسنقوم بتحويلها إلى خطة عمل برمجية!' 
          : 'Write your idea and we will turn it into a coding roadmap!'}
      </p>

      <form onSubmit={handleGenerate} className="space-y-4">
        <textarea
          value={idea}
          onChange={(e) => setIdea(e.target.value)}
          placeholder={appLang === 'ar' ? 'مثال: تطبيق لتنظيم الوقت' : 'Example: A todo app'}
          className="w-full p-4 rounded-2xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 focus:ring-2 focus:ring-orange-500 outline-none h-24 text-sm"
        />
        <button
          type="submit"
          disabled={loading}
          className="w-full py-3 bg-orange-600 hover:bg-orange-700 text-white rounded-xl font-bold transition-all disabled:opacity-50"
        >
          {loading ? (appLang === 'ar' ? 'جاري التخطيط...' : 'Planning...') : (appLang === 'ar' ? 'أنشئ خطة المشروع' : 'Create Roadmap')}
        </button>
      </form>

      {roadmap && (
        <div className="mt-8 space-y-6 animate-in fade-in duration-500">
          <div className="p-4 bg-orange-50 dark:bg-orange-900/20 rounded-2xl border border-orange-100 dark:border-orange-800/30">
            <h4 className="font-bold text-orange-800 dark:text-orange-400 text-lg mb-1">{roadmap.title}</h4>
            <div className="flex gap-2 mb-4">
              <span className="text-[10px] font-bold uppercase px-2 py-0.5 bg-white dark:bg-slate-800 rounded border border-orange-200">{roadmap.difficulty}</span>
              {roadmap.languages.map((l, i) => (
                <span key={i} className="text-[10px] font-bold uppercase px-2 py-0.5 bg-orange-200 text-orange-800 rounded">{l}</span>
              ))}
            </div>
          </div>

          <div className="space-y-4">
            {roadmap.steps.map((step, idx) => (
              <div key={idx} className="relative pl-8 rtl:pl-0 rtl:pr-8 border-l-2 rtl:border-l-0 rtl:border-r-2 border-orange-200 dark:border-slate-700 pb-4 last:border-0">
                <div className="absolute -left-[9px] rtl:-right-[9px] top-0 w-4 h-4 rounded-full bg-orange-500 border-4 border-white dark:border-slate-900"></div>
                <h5 className="font-bold text-slate-800 dark:text-slate-200 text-sm mb-1">{step.title}</h5>
                <p className="text-xs text-slate-500 dark:text-slate-400">{step.description}</p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default ProjectHelper;