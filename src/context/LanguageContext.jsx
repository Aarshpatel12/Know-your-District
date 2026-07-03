import React, { createContext, useState, useContext } from 'react';
import { translations } from '../translations';

const LanguageContext = createContext();

export const LanguageProvider = ({ children }) => {
  const [currentLang, setCurrentLang] = useState('en');

  const t = (key) => {
    return translations[currentLang]?.[key] || translations['en'][key] || key;
  };

  return (
    <LanguageContext.Provider value={{ currentLang, setCurrentLang, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => useContext(LanguageContext);
