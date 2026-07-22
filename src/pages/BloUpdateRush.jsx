import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { UserCheck, CheckCircle2, AlertCircle, Building2, Users } from 'lucide-react';
import bloData from '../assets/data/blo.json';

export default function BloUpdateRush() {
  const [epicNumber, setEpicNumber] = useState('');
  const [rushLevel, setRushLevel] = useState('Low');
  const [queueCount, setQueueCount] = useState('');
  const [status, setStatus] = useState({ type: '', message: '' });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();

  const matchedBlo = bloData.find(blo => blo.epicNumber === epicNumber.trim().toUpperCase());

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!epicNumber.trim()) {
      setStatus({ type: 'error', message: 'Please enter your EPIC Number.' });
      return;
    }

    setIsSubmitting(true);
    setStatus({ type: '', message: '' });

    try {
      const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:8000';
      const response = await fetch(`${API_BASE}/api/rush`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          epicNumber: epicNumber.trim(),
          rushLevel,
          queueCount: queueCount ? parseInt(queueCount, 10) : null,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to update rush status. Check connection to backend.');
      }

      setStatus({ type: 'success', message: 'Queue status updated successfully!' });
      
      // Auto clear message after 3 seconds
      setTimeout(() => {
        setStatus({ type: '', message: '' });
      }, 3000);

    } catch (error) {
      console.error(error);
      setStatus({ type: 'error', message: error.message || 'An error occurred.' });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex-1 w-full flex flex-col p-4 sm:p-8 bg-gradient-to-br from-indigo-50 via-white to-purple-50 items-center justify-start overflow-y-auto">
      <div className="max-w-md w-full my-auto bg-white/80 backdrop-blur-xl rounded-2xl shadow-2xl shadow-indigo-100/60 border border-white/50 overflow-hidden shrink-0">
        
        {/* Header */}
        <div className="bg-gradient-to-r from-indigo-600 to-purple-600 px-6 py-8 text-white text-center relative overflow-hidden">
          <div className="absolute inset-0 bg-white/10 opacity-20" style={{ backgroundImage: 'radial-gradient(circle at 2px 2px, white 1px, transparent 0)', backgroundSize: '16px 16px' }}></div>
          <div className="relative z-10 bg-white/20 p-3 rounded-full inline-block mb-3 backdrop-blur-md shadow-lg border border-white/20">
            <Building2 size={32} className="text-white drop-shadow-md" />
          </div>
          <h2 className="text-2xl font-black tracking-wide relative z-10 drop-shadow-sm">BLO Portal</h2>
          <p className="text-indigo-100/90 text-sm mt-1 relative z-10 font-medium">Update Polling Station Queue Status</p>
        </div>

        {/* Form Body */}
        <div className="p-6">
          
          {status.message && (
            <div className={`mb-6 p-4 rounded-xl flex items-center gap-3 text-sm font-medium ${
              status.type === 'error' ? 'bg-red-50 text-red-700 border border-red-100' : 'bg-green-50 text-green-700 border border-green-100'
            }`}>
              {status.type === 'error' ? <AlertCircle size={20} /> : <CheckCircle2 size={20} />}
              <p>{status.message}</p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            
            {/* EPIC Number */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Your EPIC Number
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
                  <UserCheck size={18} />
                </div>
                <input
                  type="text"
                  value={epicNumber}
                  onChange={(e) => setEpicNumber(e.target.value.toUpperCase())}
                  placeholder="e.g. ABC1234567"
                  className="w-full pl-10 pr-4 py-3 border-2 border-gray-200 rounded-xl focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/30 transition-all duration-300 font-medium text-gray-800 uppercase shadow-sm bg-white/70 backdrop-blur-sm"
                  required
                />
              </div>
              {epicNumber.trim().length >= 8 ? (
                <div className="mt-3">
                  {matchedBlo ? (
                    <div className="flex items-center gap-2 text-sm text-green-800 bg-gradient-to-r from-green-50 to-emerald-50 p-3 rounded-xl border border-green-200 shadow-sm font-medium transition-all duration-300">
                      <CheckCircle2 size={18} className="shrink-0 text-green-600" />
                      <span>Verified: <strong>{matchedBlo.name}</strong> ({matchedBlo.assembly}, Part {matchedBlo.partNo})</span>
                    </div>
                  ) : (
                    <div className="flex items-center gap-2 text-sm text-amber-700 bg-amber-50 p-2.5 rounded-lg border border-amber-200 shadow-sm">
                      <AlertCircle size={18} className="shrink-0" />
                      <span>No matching BLO found. Check your EPIC number.</span>
                    </div>
                  )}
                </div>
              ) : (
                <p className="text-xs text-gray-500 mt-2 ml-1">This will identify your polling station to citizens.</p>
              )}
            </div>

            {/* Rush Level */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-3">
                Current Queue / Rush Level
              </label>
              <div className="grid grid-cols-3 gap-3">
                <button
                  type="button"
                  onClick={() => setRushLevel('Low')}
                  className={`py-3.5 px-2 rounded-xl border-2 font-bold text-sm transition-all duration-300 flex flex-col items-center gap-1.5 transform active:scale-95 hover:scale-[1.02] ${
                    rushLevel === 'Low'
                      ? 'border-green-500 bg-gradient-to-b from-green-50 to-green-100 text-green-800 shadow-md ring-2 ring-green-500/20'
                      : 'border-gray-200 text-gray-500 hover:border-green-300 hover:bg-green-50/50 bg-white/80'
                  }`}
                >
                  <span className={`text-2xl transition-transform duration-300 ${rushLevel === 'Low' ? 'scale-110 drop-shadow-sm' : 'grayscale opacity-60'}`}>🟢</span>
                  Low
                </button>
                <button
                  type="button"
                  onClick={() => setRushLevel('Moderate')}
                  className={`py-3.5 px-2 rounded-xl border-2 font-bold text-sm transition-all duration-300 flex flex-col items-center gap-1.5 transform active:scale-95 hover:scale-[1.02] ${
                    rushLevel === 'Moderate'
                      ? 'border-yellow-500 bg-gradient-to-b from-yellow-50 to-yellow-100 text-yellow-800 shadow-md ring-2 ring-yellow-500/20'
                      : 'border-gray-200 text-gray-500 hover:border-yellow-300 hover:bg-yellow-50/50 bg-white/80'
                  }`}
                >
                  <span className={`text-2xl transition-transform duration-300 ${rushLevel === 'Moderate' ? 'scale-110 drop-shadow-sm' : 'grayscale opacity-60'}`}>🟡</span>
                  Moderate
                </button>
                <button
                  type="button"
                  onClick={() => setRushLevel('High')}
                  className={`py-3.5 px-2 rounded-xl border-2 font-bold text-sm transition-all duration-300 flex flex-col items-center gap-1.5 transform active:scale-95 hover:scale-[1.02] ${
                    rushLevel === 'High'
                      ? 'border-red-500 bg-gradient-to-b from-red-50 to-red-100 text-red-800 shadow-md ring-2 ring-red-500/20'
                      : 'border-gray-200 text-gray-500 hover:border-red-300 hover:bg-red-50/50 bg-white/80'
                  }`}
                >
                  <span className={`text-2xl transition-transform duration-300 ${rushLevel === 'High' ? 'scale-110 drop-shadow-sm' : 'grayscale opacity-60'}`}>🔴</span>
                  High
                </button>
              </div>
            </div>

            {/* Queue Count */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Number of Voters in Queue (Optional)
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
                  <Users size={18} />
                </div>
                <input
                  type="number"
                  min="0"
                  value={queueCount}
                  onChange={(e) => setQueueCount(e.target.value)}
                  placeholder="e.g. 15"
                  className="w-full pl-10 pr-4 py-3 border-2 border-gray-200 rounded-xl focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/30 transition-all duration-300 font-medium text-gray-800 shadow-sm bg-white/70 backdrop-blur-sm"
                />
              </div>
            </div>

            {/* Actions */}
            <div className="pt-2 flex flex-col gap-3">
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white font-bold py-3.5 px-6 rounded-xl transition-all duration-300 shadow-lg shadow-indigo-500/40 hover:shadow-indigo-500/60 transform active:scale-[0.98] flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
              >
                {isSubmitting ? (
                  <><svg className="animate-spin h-5 w-5 text-white" viewBox="0 0 24 24" fill="none"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg> Updating...</>
                ) : (
                  <>Broadcast Status</>
                )}
              </button>
              
              <button
                type="button"
                onClick={() => navigate('/directory/blo')}
                className="w-full bg-white hover:bg-gray-50 text-gray-600 border-2 border-gray-200 font-bold py-3.5 px-6 rounded-xl transition-all flex items-center justify-center gap-2"
              >
                Back to Directory
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
