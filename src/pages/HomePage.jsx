import React from 'react';
import { useNavigate } from 'react-router-dom';
import { MapPin, Building2, Stethoscope, Users, Baby } from 'lucide-react';

export default function HomePage() {
  const navigate = useNavigate();

  const categories = [
    { id: 'patwari', title: 'Find My Patwari', icon: <MapPin size={40} />, color: 'bg-green-600', count: '213 Locations' },
    { id: 'kanungos', title: 'Kanungos', icon: <Users size={40} />, color: 'bg-purple-600', count: '38 Locations' }, // <-- NEW CATEGORY
    { id: 'hospitals', title: 'SHC', icon: <Stethoscope size={40} />, color: 'bg-blue-600', count: 'Coming Soon' }, 
    { id: 'sewakendra', title: 'Sewa Kendras', icon: <Building2 size={40} />, color: 'bg-orange-600', count: '42 Locations' },
    { id: 'awc', title: 'Anganwadi Centers', icon: <Baby size={40} />, color: 'bg-pink-600', count: '2,477 Centers' }
  ];

  return (
    <div className="flex-1 overflow-y-auto p-8">
      <div className="max-w-5xl mx-auto mt-10"> {/* <-- Increased width to 5xl to fit 4 items */}
        <h1 className="text-4xl font-bold text-gray-900 mb-2">Welcome to Know Your Government</h1>
        <p className="text-lg text-gray-600 mb-8">Select a service below to find the nearest government office in Ludhiana District.</p>
        
        {/* <-- Updated grid to show 2 columns on tablets and 4 columns on desktop --> */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-5 gap-6">
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => navigate(`/directory/${cat.id}`)}
              className="bg-white rounded-xl shadow-md hover:shadow-xl transition-shadow p-6 flex flex-col items-center text-center border border-gray-200"
            >
              <div className={`${cat.color} text-white p-4 rounded-full mb-4`}>
                {cat.icon}
              </div>
              <h2 className="text-xl font-bold text-gray-800">{cat.title}</h2>
              <p className="text-sm text-gray-500 mt-2">{cat.count}</p>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}