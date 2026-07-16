import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

export default function GlobalHeader() {
  const navigate = useNavigate();
  const location = useLocation();
  const { currentLang, setCurrentLang, t } = useLanguage();

  return (
    <header className="bg-green-700 text-white shadow-md z-20 shrink-0">
      <div className="flex items-center justify-between px-3 sm:px-4 py-3 max-w-7xl mx-auto w-full gap-2">
        
        {/* Left Section: Back Button + Punjab Logo */}
        <div className="flex items-center gap-2 sm:gap-3 w-1/4 sm:w-1/3">
          {location.pathname !== '/' && (
            <button
              onClick={() => navigate('/')}
              className="hover:bg-green-600 p-1.5 sm:p-2 rounded-full transition shrink-0 -ml-1 sm:ml-0"
              aria-label="Go back"
            >
              <ArrowLeft size={20} className="sm:w-6 sm:h-6" />
            </button>
          )}
          <img 
            src="/punjab-logo.png" 
            alt="Government of Punjab" 
            className="h-14 w-14 sm:h-16 sm:w-16 object-contain drop-shadow-md"
          />
        </div>

        {/* Center Section: Titles */}
        <div className="text-center flex-1 min-w-0 flex flex-col justify-center">
          <h1 className="text-base sm:text-2xl font-bold leading-tight truncate tracking-wide">
            {location.pathname.includes('/directory/blo') ? t('app_title_blo') : t('app_title')}
          </h1>
          <p className="text-[10px] sm:text-xs text-green-200 truncate uppercase tracking-wider sm:tracking-widest mt-0.5 font-medium">
            {t('app_subtitle')}
          </p>
        </div>

        <div className="flex justify-end items-center gap-2 sm:gap-4 w-1/4 sm:w-1/3">
          <select 
            value={currentLang} 
            onChange={(e) => setCurrentLang(e.target.value)}
            className="bg-green-800 text-white text-xs sm:text-sm border border-green-600 rounded px-1 py-1 focus:outline-none cursor-pointer"
          >
            <option value="en">Eng</option>
            <option value="hi">हिंदी</option>
            <option value="pa">ਪੰਜਾਬੀ</option>
          </select>
          <div className="bg-white/95 px-1.5 py-1 sm:px-3 sm:py-2 rounded shadow-sm">
            <img 
              src="/digital-india-logo.png" 
              alt="Digital India" 
              className="h-8 sm:h-11 object-contain"
            />
          </div>
        </div>

      </div>
    </header>
  );
}