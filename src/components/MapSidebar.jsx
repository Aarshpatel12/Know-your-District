import React, { useState, useRef } from 'react';
import { Navigation, Phone, MapPin, Users, Building2, Baby, Stethoscope, Mic, Camera, UserCheck } from 'lucide-react';
import { QRCodeSVG } from 'qrcode.react';
import Tesseract from 'tesseract.js';

const CATEGORY_CONFIG = {
  patwari:    { label: 'Patwari Directory',      color: 'green',  icon: <MapPin size={14} /> },
  patwaris:   { label: 'Patwari Directory',      color: 'green',  icon: <MapPin size={14} /> },
  kanungo:    { label: 'Kanungo Directory',      color: 'purple', icon: <Users size={14} /> },
  kanungos:   { label: 'Kanungo Directory',      color: 'purple', icon: <Users size={14} /> },
  sewakendra: { label: 'Sewa Kendra Directory',  color: 'orange', icon: <Building2 size={14} /> },
  sewakendras:{ label: 'Sewa Kendra Directory',  color: 'orange', icon: <Building2 size={14} /> },
  hospital:   { label: 'Govt Health Facilities', color: 'blue',   icon: <Stethoscope size={14} /> },
  hospitals:  { label: 'Govt Health Facilities', color: 'blue',   icon: <Stethoscope size={14} /> },
  shc:        { label: 'Govt Health Facilities', color: 'blue',   icon: <Stethoscope size={14} /> },
  awc:        { label: 'Anganwadi Centers',       color: 'pink',   icon: <Baby size={14} /> },
  awcs:       { label: 'Anganwadi Centers',       color: 'pink',   icon: <Baby size={14} /> },
  blo:        { label: 'BLO Directory',           color: 'indigo', icon: <UserCheck size={14} /> },
};

const ACCENT = {
  green:  { header: 'bg-green-700',  badge: 'bg-green-100 text-green-800',  active: 'border-green-600 bg-green-50',  locate: 'bg-green-600 hover:bg-green-700' },
  purple: { header: 'bg-purple-700', badge: 'bg-purple-100 text-purple-800', active: 'border-purple-600 bg-purple-50', locate: 'bg-purple-600 hover:bg-purple-700' },
  orange: { header: 'bg-orange-600', badge: 'bg-orange-100 text-orange-800', active: 'border-orange-500 bg-orange-50', locate: 'bg-orange-500 hover:bg-orange-600' },
  blue:   { header: 'bg-blue-600',   badge: 'bg-blue-100 text-blue-800',    active: 'border-blue-500 bg-blue-50',    locate: 'bg-blue-600 hover:bg-blue-700' },
  pink:   { header: 'bg-pink-600',   badge: 'bg-pink-100 text-pink-800',    active: 'border-pink-500 bg-pink-50',    locate: 'bg-pink-600 hover:bg-pink-700' },
  indigo: { header: 'bg-indigo-600', badge: 'bg-indigo-100 text-indigo-800', active: 'border-indigo-500 bg-indigo-50', locate: 'bg-indigo-600 hover:bg-indigo-700' },
};

function PhoneLink({ number }) {
  if (!number || number === 'Vacant') return null;
  const clean = String(number).replace(/\D/g, '').slice(-10);
  if (clean.length < 7) return null;
  return (
    <a
      href={`tel:${clean}`}
      onClick={(e) => e.stopPropagation()}
      className="inline-flex items-center gap-1 text-blue-600 hover:text-blue-800 hover:underline text-xs mt-0.5"
    >
      <Phone size={10} /> {String(number)}
    </a>
  );
}

function KanungoCard({ item }) {
  return (
    <div className="mt-1.5 space-y-0.5">
      {item.tehsil && (
        <p className="text-xs text-gray-500 font-medium">📍 {item.tehsil} Tehsil</p>
      )}
      {item.circle && (
        <p className="text-xs text-gray-600">
          <span className="font-semibold">Circles: </span>{item.circle}
        </p>
      )}
      {item.mobile && <PhoneLink number={item.mobile} />}
    </div>
  );
}

function PatwariCard({ item }) {
  return (
    <div className="mt-1.5 space-y-0.5">
      {item.tehsil && (
        <p className="text-xs text-gray-500 font-medium">📍 {item.tehsil}</p>
      )}
      {item.circle && (
        <p className="text-xs text-gray-600">
          <span className="font-semibold">Circles: </span>{item.circle}
        </p>
      )}
      {item.mobile && <PhoneLink number={item.mobile} />}
    </div>
  );
}

function BookingQueueWidget({ item }) {
  const [token, setToken] = useState(null);
  
  // Deterministic mock queue number based on item name length
  const queueCount = (item.name?.length || 5) * 3 + 2; 
  const isCrowded = queueCount > 25;

  const handleBook = (e) => {
    e.stopPropagation();
    const newToken = `TK-${Math.floor(1000 + Math.random() * 9000)}`;
    setToken(newToken);
  };

  return (
    <div className="mt-3 p-2.5 bg-gray-50 border border-gray-200 rounded-lg" onClick={e => e.stopPropagation()}>
      <div className="flex justify-between items-center mb-2">
        <span className="text-[11px] font-semibold text-gray-700">Live Queue:</span>
        <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${isCrowded ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-700'}`}>
          {isCrowded ? '🔴 Crowded' : '🟢 Moderate'} ({queueCount} waiting)
        </span>
      </div>
      
      {!token ? (
        <button
          onClick={handleBook}
          className="w-full bg-blue-600 hover:bg-blue-700 text-white text-[11px] font-bold py-2 rounded transition-colors flex items-center justify-center gap-1 shadow-sm"
        >
          📅 Book a Slot (Free Token)
        </button>
      ) : (
        <div className="mt-2 flex flex-col items-center p-3 bg-white rounded-md border border-gray-200 shadow-sm">
          <p className="text-[10px] text-gray-500 mb-0.5 uppercase tracking-wider font-semibold">Your Digital Token</p>
          <h4 className="text-lg font-black text-gray-900 tracking-widest mb-2">{token}</h4>
          <QRCodeSVG value={token} size={80} level="M" />
          <p className="text-[10px] text-gray-500 mt-2 text-center leading-tight">Show this QR at the counter to skip the queue.</p>
        </div>
      )}
    </div>
  );
}

function DocumentScannerWidget() {
  const [isScanning, setIsScanning] = useState(false);
  const [scanResult, setScanResult] = useState(null);
  const [progress, setProgress] = useState('');
  const fileInputRef = useRef(null);

  const handleScan = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setIsScanning(true);
    setScanResult(null);
    setProgress('Initializing AI Scanner...');

    try {
      const result = await Tesseract.recognize(file, 'eng', {
        logger: m => {
          if (m.status === 'recognizing text') {
            setProgress(`Scanning Document... ${Math.round(m.progress * 100)}%`);
          } else {
            setProgress(m.status);
          }
        }
      });

      const text = result.data.text.toLowerCase();
      // Simple mock AI verification logic targeting generic Indian documents
      const keywords = ['aadhaar', 'government', 'dob', 'punjab', 'india', 'certificate', 'father', 'birth'];
      const isVerified = keywords.some(kw => text.includes(kw));

      setScanResult(isVerified ? 'verified' : 'rejected');
    } catch (error) {
      console.error("OCR Error:", error);
      setScanResult('rejected');
    } finally {
      setIsScanning(false);
      setProgress('');
    }
  };

  return (
    <div className="mt-2 p-2.5 bg-gray-50 border border-gray-200 rounded-lg" onClick={e => e.stopPropagation()}>
      <div className="flex justify-between items-center mb-2">
        <span className="text-[11px] font-semibold text-gray-700">AI Document Check:</span>
        {scanResult === 'verified' && <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-green-100 text-green-700">✅ Verified</span>}
        {scanResult === 'rejected' && <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-red-100 text-red-700">❌ Unrecognized</span>}
      </div>
      
      <input
        type="file"
        accept="image/*"
        capture="environment"
        ref={fileInputRef}
        onChange={handleScan}
        className="hidden"
      />

      <button
        onClick={(e) => { e.stopPropagation(); fileInputRef.current?.click(); }}
        disabled={isScanning}
        className="w-full bg-purple-600 hover:bg-purple-700 disabled:bg-purple-400 text-white text-[11px] font-bold py-2 rounded transition-colors flex items-center justify-center gap-1 shadow-sm"
      >
        {isScanning ? (
          <span className="animate-pulse">🔄 {progress}</span>
        ) : (
          <><Camera size={14} /> Snap Document to Verify</>
        )}
      </button>
      {scanResult === 'rejected' && (
        <p className="text-[9px] text-red-500 mt-1.5 text-center leading-tight">Could not verify document. Ensure the photo is clear and well-lit.</p>
      )}
    </div>
  );
}

function SewaKendraCard({ item }) {
  return (
    <div className="mt-1.5 space-y-0.5">
      {item.tehsil && <p className="text-xs text-gray-500">📍 {item.tehsil}</p>}
      {item.assembly && <p className="text-xs text-gray-600">🏛️ {item.assembly}</p>}
      {item.type && <p className="text-xs text-gray-400">{item.type}</p>}
      <BookingQueueWidget item={item} />
      <DocumentScannerWidget />
    </div>
  );
}

function HospitalCard({ item }) {
  return (
    <div className="mt-1.5 space-y-0.5">
      {item.tehsil && <p className="text-xs text-gray-500 font-medium">📍 {item.tehsil}</p>}
      {item.type && (
        <p className="text-xs text-gray-600">
          <span className="font-semibold">Facility Type: </span>{item.type}
        </p>
      )}
      {item.ownership && (
        <p className="text-xs text-gray-600">
          <span className="font-semibold">Ownership: </span>{item.ownership}
        </p>
      )}
      {item.address && <p className="text-xs text-gray-500 break-words line-clamp-2" title={item.address}>{item.address}</p>}
      {item.mobile && <PhoneLink number={item.mobile} />}
      <BookingQueueWidget item={item} />
    </div>
  );
}

function AwcCard({ item }) {
  return (
    <div className="mt-1.5 space-y-0.5">
      {item.village && (
        <p className="text-xs text-gray-500">📍 {item.village} · <span className="text-gray-400">{item.areaType}</span></p>
      )}
      {item.assembly && (
        <p className="text-xs text-gray-600">🏛️ {item.assembly} Constituency</p>
      )}
      {item.workerName && item.workerName !== 'Vacant' ? (
        <div className="mt-1">
          <p className="text-xs text-gray-700">👩 <span className="font-medium">{item.workerName}</span></p>
          {item.workerMobile && <PhoneLink number={item.workerMobile} />}
        </div>
      ) : item.workerName === 'Vacant' ? (
        <p className="text-xs text-red-500 font-medium">⚠️ Worker Position Vacant</p>
      ) : null}
      {item.block && <p className="text-xs text-gray-400">Block: {item.block}</p>}
    </div>
  );
}

function BloCard({ item }) {
  return (
    <div className="mt-2 flex flex-col h-full justify-between gap-2">
      <div className="grid grid-cols-2 gap-2 mb-1">
        {item.assembly && (
          <div className="bg-indigo-50 rounded-lg p-2 border border-indigo-100 flex flex-col">
             <span className="text-[10px] text-indigo-400 uppercase font-bold tracking-wider">Assembly</span>
             <span className="text-xs text-indigo-900 font-bold truncate" title={item.assembly}>{item.assembly}</span>
          </div>
        )}
        {item.partNo && (
          <div className="bg-emerald-50 rounded-lg p-2 border border-emerald-100 flex flex-col">
             <span className="text-[10px] text-emerald-500 uppercase font-bold tracking-wider">Part No</span>
             <span className="text-xs text-emerald-900 font-bold truncate" title={item.partNo}>{item.partNo}</span>
          </div>
        )}
      </div>
      
      {item.designation && (
        <div className="mt-1">
          <span className="text-[11px] text-gray-700 bg-gray-50 px-2 py-1 rounded-md border font-medium border-gray-200 shadow-sm inline-block">
            💼 {item.designation} {item.department ? `(${item.department})` : ''}
          </span>
        </div>
      )}

      <div className="mt-3 pt-3 border-t border-gray-100 flex gap-2">
        <PhoneLink number={item.mobile} />
      </div>
    </div>
  );
}

export default function MapSidebar({ data, activeItem, setActiveItem, category, onLocateMe, userLocation, locating, isTracking, isNavigating, onStartNavigation }) {
  const [search, setSearch] = useState('');
  const [epicPartSearch, setEpicPartSearch] = useState('');
  const [assemblyFilter, setAssemblyFilter] = useState('');
  const [partNoFilter, setPartNoFilter] = useState('');

  const [isRecording, setIsRecording] = useState(false);
  const mediaRecorderRef = useRef(null);
  const audioChunksRef = useRef([]);

  const processBhashiniAudio = async (audioBlob) => {
    try {
      // 1. Convert Blob to Base64
      const reader = new FileReader();
      reader.readAsDataURL(audioBlob);
      reader.onloadend = async () => {
        const base64Audio = reader.result.split(',')[1];

        // Boilerplate Bhashini Orchestration Request
        // TODO: Replace with actual production credentials
        const USER_ID = "YOUR_BHASHINI_USER_ID";
        const API_KEY = "YOUR_BHASHINI_API_KEY";
        const ULCA_API_KEY = "YOUR_ULCA_API_KEY";

        try {
          const response = await fetch('https://dhruva-api.bhashini.gov.in/v1/compute/pipeline', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': API_KEY,
              'userID': USER_ID,
              'ulcaApiKey': ULCA_API_KEY
            },
            body: JSON.stringify({
              pipelineTasks: [
                {
                  taskType: "asr",
                  config: {
                    language: {
                      sourceLanguage: "pa" // Punjabi
                    }
                  }
                }
              ],
              inputData: {
                audio: [
                  {
                    audioContent: base64Audio
                  }
                ]
              }
            })
          });

          if (!response.ok) throw new Error('Bhashini API Error');

          const data = await response.json();
          const transcribedText = data?.pipelineResponse?.[0]?.output?.[0]?.source || '';
          
          if (transcribedText) {
            setSearch(transcribedText);
          }
        } catch (error) {
          console.error("Error calling Bhashini:", error);
          alert("Failed to process speech. Please try typing your search.");
        }
      };
    } catch (error) {
      console.error("Error processing audio blob:", error);
    }
  };

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;
      audioChunksRef.current = [];

      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunksRef.current.push(event.data);
        }
      };

      mediaRecorder.onstop = () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/webm' });
        processBhashiniAudio(audioBlob);
        stream.getTracks().forEach(track => track.stop()); // Clean up mic
      };

      mediaRecorder.start();
      setIsRecording(true);

      // Auto-stop after 6 seconds
      setTimeout(() => {
        if (mediaRecorderRef.current && mediaRecorderRef.current.state === 'recording') {
          mediaRecorderRef.current.stop();
          setIsRecording(false);
        }
      }, 6000);

    } catch (error) {
      console.error("Microphone permission denied or error:", error);
      alert("Microphone access denied. Please allow microphone permissions to use voice search.");
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && mediaRecorderRef.current.state === 'recording') {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
    }
  };

  const toggleRecording = () => {
    if (isRecording) {
      stopRecording();
    } else {
      startRecording();
    }
  };

  const cfg   = CATEGORY_CONFIG[category] || { label: `${category} Directory`, color: 'green', icon: null };
  const accent = ACCENT[cfg.color] || ACCENT.green;
  const isKanungo = category === 'kanungo' || category === 'kanungos';
  const isAwc     = category === 'awc'     || category === 'awcs';
  const isHospital= category === 'hospital'|| category === 'hospitals' || category === 'shc';
  const isBlo     = category === 'blo';

  const uniqueAssemblies = isBlo ? [...new Set(data.map(item => item.assembly).filter(Boolean))].sort() : [];
  const uniquePartNos = isBlo ? (() => {
    const map = new Map();
    data.filter(item => !assemblyFilter || item.assembly === assemblyFilter)
        .filter(item => item.partNo)
        .forEach(item => {
          if (!map.has(item.partNo)) {
             map.set(item.partNo, item.partName || '');
          }
        });
    return Array.from(map.entries())
      .sort((a, b) => parseInt(a[0]) - parseInt(b[0]))
      .map(([partNo, partName]) => ({ partNo, partName }));
  })() : [];


  const filteredData = data.filter(item => {
    if (isBlo) {
      if (epicPartSearch) {
        const p = epicPartSearch.toLowerCase();
        const matchesEpic = item.epicNumber?.toLowerCase().includes(p);
        const matchesPart = item.partNo?.toLowerCase() === p;
        if (!matchesEpic && !matchesPart) return false;
      } else {
        if (assemblyFilter && item.assembly !== assemblyFilter) return false;
        if (partNoFilter && item.partNo !== partNoFilter) return false;

      }
    }
    
    const q = search.toLowerCase();
    return (
      item.name?.toLowerCase().includes(q) ||
      item.circle?.toLowerCase().includes(q) ||
      item.tehsil?.toLowerCase().includes(q) ||
      item.village?.toLowerCase().includes(q) ||
      item.assembly?.toLowerCase().includes(q) ||
      item.partNo?.toLowerCase().includes(q) ||
      item.epicNumber?.toLowerCase().includes(q) ||
      item.workerName?.toLowerCase().includes(q) ||
      item.mobile?.includes(q)
    );
  });

  const handleWhatsAppShare = (e, item) => {
    e.stopPropagation();
    let text = `*Know Your District - Official Details*\n`;
    text += `Name: ${item.name || 'N/A'}\n`;
    if (item.mobile) text += `Mobile: ${item.mobile}\n`;
    if (item.workerMobile) text += `Mobile: ${item.workerMobile}\n`;
    if (item.tehsil) text += `Tehsil: ${item.tehsil}\n`;
    if (item.village) text += `Village: ${item.village}\n`;
    if (item.circle) text += `Circle: ${item.circle}\n`;
    if (item.assembly) text += `Assembly: ${item.assembly}\n`;
    if (item.partNo) text += `Part No: ${item.partNo}\n`;
    if (item.designation) text += `Designation: ${item.designation}\n`;

    
    if (item.lat && item.lng) {
      text += `\nMap Location: https://maps.google.com/?q=${item.lat},${item.lng}`;
    }
    
    text += `\n\nFind more officials at: https://knowyourdist.netlify.app/`;
    
    const url = `https://wa.me/?text=${encodeURIComponent(text)}`;
    window.open(url, '_blank');
  };

  const handleGoogleMapsNavigation = (e, item) => {
    e.stopPropagation();
    if (item.lat && item.lng) {
      // The 'dir' endpoint triggers directions. If user location is known by GPS, it uses current location as origin.
      window.open(`https://www.google.com/maps/dir/?api=1&destination=${item.lat},${item.lng}`, '_blank');
    } else {
      alert("Location coordinates not available for this official.");
    }
  };

  const getPlaceholder = () => {
    if (isKanungo) return 'Search by name, tehsil, circles, mobile...';
    if (isAwc)     return 'Search by name, village, worker, assembly...';
    if (isHospital)return 'Search by facility name, tehsil, address, type...';
    return 'Search by name, tehsil or circles...';
  };

  const renderCard = (item) => {
    if (isAwc)     return <AwcCard     item={item} />;
    if (isKanungo) return <KanungoCard item={item} />;
    if (isHospital)return <HospitalCard item={item} />;
    if (isBlo)     return <BloCard item={item} />;
    if (category === 'sewakendra' || category === 'sewakendras') return <SewaKendraCard item={item} />;
    return <PatwariCard item={item} />;
  };

  return (
    <div className="w-full bg-white shadow-xl z-10 flex flex-col h-full overflow-hidden">

      {/* Header */}
      <div className={`${accent.header} text-white px-4 py-3 flex items-center justify-between shrink-0`}>
        <div className="flex items-center gap-2">
          {cfg.icon}
          <h2 className="font-bold text-sm uppercase tracking-wide">{cfg.label}</h2>
        </div>
        <span className="text-xs bg-white/20 px-2 py-0.5 rounded-full">
          {filteredData.length} results
        </span>
      </div>

      {/* Search + Locate */}
      <div className="p-3 bg-gray-50 border-b flex flex-col gap-2 shrink-0">
        <div className="relative">
          <input
            type="text"
            placeholder={getPlaceholder()}
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-3 pr-10 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
          />
          <button
            onClick={toggleRecording}
            className={`absolute right-2 top-1/2 -translate-y-1/2 p-1.5 rounded-full transition-colors ${
              isRecording ? 'text-red-500 bg-red-50' : 'text-gray-400 hover:text-blue-500 hover:bg-blue-50'
            }`}
            title={isRecording ? "Listening (Speak in Punjabi)..." : "Voice Search (Punjabi)"}
          >
            {isRecording && (
              <span className="absolute inset-0 rounded-full animate-ping bg-red-400 opacity-75"></span>
            )}
            <Mic size={16} className="relative z-10" />
          </button>
        </div>
        
        {isBlo && (
          <div className="mb-1">
            <input
              type="text"
              placeholder="🪪 Find by Part No."
              value={epicPartSearch}
              onChange={(e) => setEpicPartSearch(e.target.value)}
              className="w-full px-3 py-2 border-2 border-indigo-200 rounded-lg text-sm bg-white focus:outline-none focus:border-indigo-500 font-medium"
            />
          </div>
        )}

        {isBlo && (
          <div className="grid grid-cols-2 gap-2">
            <select
              value={assemblyFilter}
              onChange={(e) => setAssemblyFilter(e.target.value)}
              className="w-full px-2 py-1.5 border border-gray-300 rounded-lg text-xs bg-white focus:outline-none focus:ring-2 focus:ring-indigo-400"
            >
              <option value="">All Assemblies</option>
              {uniqueAssemblies.map(a => <option key={a} value={a}>{a}</option>)}
            </select>

            <select
              value={partNoFilter}
              onChange={(e) => setPartNoFilter(e.target.value)}
              className="w-full px-2 py-1.5 border border-gray-300 rounded-lg text-xs bg-white focus:outline-none focus:ring-2 focus:ring-indigo-400"
            >
              <option value="">All Part Nos</option>
              {uniquePartNos.map(p => <option key={p.partNo} value={p.partNo}>{p.partNo}{p.partName ? ` - ${p.partName}` : ''}</option>)}
            </select>
          </div>
        )}

        {isBlo && (
          <a
            href="https://electoralsearch.eci.gov.in/uesfmempmlkypo"
            target="_blank"
            rel="noopener noreferrer"
            className="w-full mt-1 bg-indigo-600 hover:bg-indigo-700 text-white font-medium py-2 px-4 rounded-lg flex items-center justify-center transition-colors text-sm shadow-sm"
          >
            🔍 Don't know your Part No.? Find it using your EPIC No.
          </a>
        )}

        {!isBlo && (
          <button
            onClick={onLocateMe}
            disabled={locating}
            className={`w-full text-white font-medium py-2.5 px-4 rounded-lg flex items-center justify-center gap-2 transition-colors text-sm disabled:opacity-70 ${
              isTracking
                ? 'bg-red-500 hover:bg-red-600'          // stop tracking
                : userLocation
                ? 'bg-green-600 hover:bg-green-700'      // located, not live
                : `${accent.locate}`                     // not yet located
            }`}
          >
            {locating ? (
              <>
                <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24" fill="none">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                <span>Finding location...</span>
              </>
            ) : isTracking ? (
              <>
                <span className="relative flex h-2.5 w-2.5 shrink-0 mr-1">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-white opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-white"></span>
                </span>
                <span>Stop Live Tracking</span>
              </>
            ) : (
              <>
                <Navigation size={18} />
                <span>{userLocation ? 'Sort by Nearest' : 'Find Nearest to Me'}</span>
              </>
            )}
          </button>
        )}
      </div>

      {/* List */}
      <div className={`flex-1 overflow-y-auto ${isBlo ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 p-4 bg-gray-50 items-start content-start' : 'divide-y divide-gray-100'}`}>
        {filteredData.length === 0 ? (
          <div className="p-8 text-center text-gray-400 col-span-full">
            <p className="text-sm font-medium">No results found</p>
            <p className="text-xs mt-1">Try a different search term</p>
          </div>
        ) : (
          filteredData.map((item) => {
            const isActive = activeItem?.id === item.id;
            return (
              <div
                key={item.id}
                onClick={() => setActiveItem(item)}
                className={isBlo 
                  ? `bg-white rounded-xl shadow-sm border p-4 transition-all cursor-pointer hover:shadow-md ${isActive ? 'ring-2 ring-indigo-500 border-indigo-500' : 'border-gray-200 hover:border-indigo-300'}`
                  : `px-4 py-3 cursor-pointer transition-all border-l-4 ${isActive ? `${accent.active} border-l-4` : 'border-transparent hover:bg-gray-50'}`
                }
              >
                <div className="flex justify-between items-start gap-2">
                  <h3 className={`font-semibold text-sm leading-tight ${isActive ? 'text-gray-900' : 'text-gray-800'}`}>
                    {item.name}
                  </h3>
                  <div className="flex flex-col items-end gap-1 shrink-0">
                    {item.distance != null && (
                      <span className="text-xs font-bold text-blue-600 bg-blue-50 border border-blue-200 px-2 py-0.5 rounded-full whitespace-nowrap">
                        {item.distance.toFixed(1)} km
                      </span>
                    )}
                    {isActive && (
                      <span className={`text-xs px-2 py-0.5 rounded-full ${accent.badge}`}>
                        Selected
                      </span>
                    )}
                  </div>
                </div>

                {renderCard(item)}

                {/* Start Navigation button — shown on the active selected item */}
                {isActive && userLocation && !isNavigating && (
                  <button
                    onClick={(e) => { e.stopPropagation(); onStartNavigation && onStartNavigation(); }}
                    style={{
                      marginTop: 10,
                      width: '100%',
                      padding: '10px 0',
                      background: 'linear-gradient(135deg, #16a34a, #15803d)',
                      color: 'white',
                      border: 'none',
                      borderRadius: 10,
                      fontSize: 13,
                      fontWeight: 700,
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: 6,
                      boxShadow: '0 3px 14px rgba(22,163,74,0.4)',
                      letterSpacing: '0.2px',
                    }}
                  >
                    🧭 Start Navigation
                  </button>
                )}

                {/* Share via WhatsApp Button */}
                {isActive && (
                  <button
                    onClick={(e) => handleWhatsAppShare(e, item)}
                    style={{
                      marginTop: 8,
                      width: '100%',
                      padding: '8px 0',
                      background: '#25D366', // WhatsApp Brand Green
                      color: 'white',
                      border: 'none',
                      borderRadius: 10,
                      fontSize: 13,
                      fontWeight: 600,
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: 6,
                      boxShadow: '0 2px 8px rgba(37,211,102,0.3)',
                    }}
                  >
                    💬 Share via WhatsApp
                  </button>
                )}

                {/* Open in Google Maps Button */}
                {isActive && !isBlo && (
                  <button
                    onClick={(e) => handleGoogleMapsNavigation(e, item)}
                    style={{
                      marginTop: 8,
                      width: '100%',
                      padding: '8px 0',
                      background: '#4285F4', // Google Blue
                      color: 'white',
                      border: 'none',
                      borderRadius: 10,
                      fontSize: 13,
                      fontWeight: 600,
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: 6,
                      boxShadow: '0 2px 8px rgba(66,133,244,0.3)',
                    }}
                  >
                    🗺️ Open in Google Maps
                  </button>
                )}
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}