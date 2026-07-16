with open('src/components/MapSidebar.jsx', 'r', encoding='utf-8') as f:
    content = f.read()

# Add states
states_str = """
  const [isAutoDetecting, setIsAutoDetecting] = useState(false);
  const [autoDetectMsg, setAutoDetectMsg] = useState('');
"""
content = content.replace(
    "const [partNoFilter, setPartNoFilter] = useState('');",
    "const [partNoFilter, setPartNoFilter] = useState('');\n" + states_str
)

func_str = """
  const handleAutoDetectBLO = () => {
    if (!('geolocation' in navigator)) {
      setAutoDetectMsg('⚠️ Geolocation not supported');
      return;
    }
    
    setIsAutoDetecting(true);
    setAutoDetectMsg('⏳ Detecting your location...');
    
    navigator.geolocation.getCurrentPosition(async (pos) => {
      try {
        const { latitude, longitude } = pos.coords;
        setAutoDetectMsg('🔍 Finding nearest area...');
        const res = await fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}&zoom=18&addressdetails=1`);
        const locData = await res.json();
        
        const address = locData.address || {};
        const areas = [address.village, address.suburb, address.town, address.city, address.county, address.state_district].filter(Boolean);
        
        let matchedPart = null;
        let matchedAssembly = null;
        
        for (const area of areas) {
            const areaLower = area.toLowerCase();
            const foundItem = data.find(p => 
                (p.partName && (p.partName.toLowerCase().includes(areaLower) || areaLower.includes(p.partName.toLowerCase()))) ||
                (p.assembly && (p.assembly.toLowerCase().includes(areaLower) || areaLower.includes(p.assembly.toLowerCase())))
            );
            if (foundItem) {
                if (foundItem.partName && (foundItem.partName.toLowerCase().includes(areaLower) || areaLower.includes(foundItem.partName.toLowerCase()))) {
                    matchedPart = foundItem.partNo;
                    matchedAssembly = foundItem.assembly;
                    break;
                } else if (!matchedAssembly) {
                    matchedAssembly = foundItem.assembly;
                }
            }
        }
        
        if (matchedPart) {
            setAssemblyFilter(matchedAssembly);
            setPartNoFilter(matchedPart);
            setAutoDetectMsg(`✅ Found! Selected: ${matchedAssembly} - Part ${matchedPart}`);
        } else if (matchedAssembly) {
            setAssemblyFilter(matchedAssembly);
            setAutoDetectMsg(`✅ Found Assembly: ${matchedAssembly}. Please select Part No manually.`);
        } else {
            setAutoDetectMsg(`⚠️ Could not auto-match area. Please search manually.`);
        }
      } catch (err) {
        console.error(err);
        setAutoDetectMsg('⚠️ Failed to get location data.');
      } finally {
        setIsAutoDetecting(false);
      }
    }, (err) => {
      setIsAutoDetecting(false);
      setAutoDetectMsg('⚠️ Location access denied or timeout.');
    }, { enableHighAccuracy: true });
  };
"""

content = content.replace(
    "const filteredData = data.filter(item => {",
    func_str + "\n  const filteredData = data.filter(item => {"
)

# Insert UI for Auto-Detect button
btn_ui = """
        {isBlo && (
          <div className="mb-2 border-b border-gray-200 pb-3">
            <button
              onClick={handleAutoDetectBLO}
              disabled={isAutoDetecting}
              className="w-full bg-emerald-600 hover:bg-emerald-700 disabled:bg-emerald-400 text-white font-medium py-2 px-4 rounded-lg flex items-center justify-center transition-colors text-sm shadow-sm gap-2"
            >
              {isAutoDetecting ? (
                <><svg className="animate-spin h-4 w-4" viewBox="0 0 24 24" fill="none"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg> <span>{autoDetectMsg || 'Auto-Detecting...'}</span></>
              ) : (
                <>📍 Auto-Detect My Electoral Area</>
              )}
            </button>
            {!isAutoDetecting && autoDetectMsg && (
                <p className={`text-xs mt-1.5 text-center font-medium ${autoDetectMsg.includes('⚠️') ? 'text-red-600' : 'text-emerald-700'}`}>{autoDetectMsg}</p>
            )}
          </div>
        )}
"""

content = content.replace(
    "{isBlo && (\n          <div className=\"mb-1\">\n            <input",
    btn_ui + "\n        {isBlo && (\n          <div className=\"mb-1\">\n            <input"
)

with open('src/components/MapSidebar.jsx', 'w', encoding='utf-8') as f:
    f.write(content)

print("MapSidebar updated with Auto-Detect feature!")
