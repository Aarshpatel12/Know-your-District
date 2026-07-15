import React from 'react';
import { useNavigate } from 'react-router-dom';
import { MapPin, Building2, Stethoscope, Users, Baby, UserCheck } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

export default function HomePage() {
  const navigate = useNavigate();
  const { t } = useLanguage();

  const categories = [
    { id: 'patwari',    title: t('cat_patwari'),    icon: <MapPin size={32} />,      color: 'bg-green-600',  count: `213 ${t('loc_count')}` },
    { id: 'kanungos',   title: t('cat_kanungos'),            icon: <Users size={32} />,       color: 'bg-purple-600', count: `38 ${t('loc_count')}` },
    { id: 'hospitals',  title: t('cat_shc'),                 icon: <Stethoscope size={32} />, color: 'bg-blue-600',   count: `25 ${t('loc_count')}` },
    { id: 'sewakendra', title: t('cat_sewa'),        icon: <Building2 size={32} />,   color: 'bg-orange-600', count: `42 ${t('loc_count')}` },
    { id: 'blo',        title: t('cat_blo'),         icon: <UserCheck size={32} />,   color: 'bg-indigo-600', count: `2,928 ${t('loc_count')}` },
    { id: 'awc',        title: t('cat_awc'),         icon: <Baby size={32} />,        color: 'bg-pink-600',   count: `2,477 ${t('center_count')}` },
  ];

  return (
    <div className="flex-1 overflow-y-auto">
      <div className="max-w-5xl mx-auto px-4 py-8 sm:px-6 sm:py-12">

        <div className="text-center mb-10">
          <span className="inline-flex items-center gap-1.5 bg-green-50 text-green-700 text-xs font-bold px-3 py-1.5 rounded-full uppercase tracking-widest mb-5 border border-green-200 shadow-sm">
            <span>🏛️</span> {t('official_portal')}
          </span>
          <h1 className="text-3xl sm:text-5xl font-extrabold text-gray-900 mb-4 leading-tight tracking-tight">
            {t('welcome_title')}
          </h1>
          <p className="text-base sm:text-lg text-gray-600 max-w-2xl mx-auto">
            {t('welcome_desc')}
          </p>
        </div>

        {/* 2 cols on mobile → 3 on md → 5 on xl */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 sm:gap-6">
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => navigate(`/directory/${cat.id}`)}
              className="bg-white rounded-xl shadow-md hover:shadow-xl active:scale-95 transition-all duration-150 p-4 sm:p-6 flex flex-col items-center text-center border border-gray-200 touch-manipulation"
            >
              <div className={`${cat.color} text-white p-3 sm:p-4 rounded-full mb-3`}>
                {cat.icon}
              </div>
              <h2 className="text-sm sm:text-lg font-bold text-gray-800 leading-tight">{cat.title}</h2>
              <p className="text-xs sm:text-sm text-gray-500 mt-1">{cat.count}</p>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}