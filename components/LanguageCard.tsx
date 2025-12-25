
import React from 'react';
import { ProgrammingLanguage, AppLanguage } from '../types';

interface Props {
  lang: ProgrammingLanguage;
  appLang: AppLanguage;
  onSelect: (id: string) => void;
}

const LanguageCard: React.FC<Props> = ({ lang, appLang, onSelect }) => {
  return (
    <div 
      onClick={() => onSelect(lang.id)}
      className="group cursor-pointer bg-white dark:bg-slate-800 rounded-2xl p-6 shadow-sm hover:shadow-xl transition-all border border-slate-100 dark:border-slate-700 hover:-translate-y-1"
    >
      <div className="flex items-start justify-between mb-4">
        <div className={`w-14 h-14 ${lang.color} rounded-2xl flex items-center justify-center text-3xl shadow-lg transform group-hover:scale-110 transition-transform`}>
          {lang.icon}
        </div>
        <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
          lang.difficulty === 'Beginner' ? 'bg-green-100 text-green-700' :
          lang.difficulty === 'Intermediate' ? 'bg-yellow-100 text-yellow-700' :
          'bg-red-100 text-red-700'
        }`}>
          {lang.difficulty}
        </span>
      </div>
      
      <h3 className="text-xl font-bold mb-2 text-slate-800 dark:text-white">{lang.name}</h3>
      <p className="text-slate-500 dark:text-slate-400 text-sm mb-4 line-clamp-2">
        {lang.description[appLang]}
      </p>
      
      <div className="flex flex-wrap gap-2">
        {lang.useCases.slice(0, 3).map((use, idx) => (
          <span key={idx} className="bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300 px-2 py-1 rounded text-[10px] font-medium uppercase tracking-wider">
            {use}
          </span>
        ))}
      </div>
    </div>
  );
};

export default LanguageCard;
