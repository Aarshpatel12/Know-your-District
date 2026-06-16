import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';

export default function GlobalHeader() {
  const navigate = useNavigate();
  const location = useLocation();

  return (
    <header className="bg-green-700 text-white p-4 shadow-md flex justify-between items-center z-20">
      <div className="flex items-center gap-4">
        {location.pathname !== '/' && (
          <button onClick={() => navigate('/')} className="hover:bg-green-600 p-2 rounded-full transition">
            <ArrowLeft size={24} />
          </button>
        )}
        <div>
          <h1 className="text-2xl font-bold">Know Your Government</h1>
          <p className="text-sm text-green-200">District Administration Ludhiana</p>
        </div>
      </div>
    </header>
  );
}