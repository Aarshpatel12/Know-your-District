import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import MapSidebar from '../components/MapSidebar';
import MapView from '../components/MapView';
import { calculateDistance } from '../utils/geoMath';

// 1. Import BOTH JSON files here
import patwariData from '../assets/data/patwaris.json';
import sewakendraData from '../assets/data/sewakendras.json';
import kanungoData from '../assets/data/kanungos.json';
import awcData from '../assets/data/awcs.json';

export default function DirectoryPage() {
  const { category } = useParams();
  const [data, setData] = useState([]);
  const [activeItem, setActiveItem] = useState(null);
  const [userLocation, setUserLocation] = useState(null); 

  // 2. Load the correct dataset when the page first opens or changes
  useEffect(() => {
    // Checking both singular and plural just in case your URL paths vary
    if (category === 'patwari' || category === 'patwaris') {
      setData(patwariData);
    } else if (category === 'kanungo' || category === 'kanungos') {
      setData(kanungoData);
    } else if (category === 'sewakendra' || category === 'sewakendras') {
      setData(sewakendraData);
    } else if (category === 'awc' || category === 'awcs') {
      setData(awcData);
    } else {
      setData([]); 
    }
    
    // Reset active item and map location when switching categories
    setActiveItem(null);
    setUserLocation(null);
  }, [category]);

  // 3. Update the Locate function to sort the currently active category
  const handleLocateMe = () => {
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition((position) => {
        const userLat = position.coords.latitude;
        const userLng = position.coords.longitude;
        setUserLocation([userLat, userLng]);

        3
        // Figure out which base dataset we should be sorting
        let baseData = [];
        if (category === 'patwari' || category === 'patwaris') {
          baseData = patwariData;
        } else if (category === 'sewakendra' || category === 'sewakendras') {
          baseData = sewakendraData;
        } else if (category === 'kanungo' || category === 'kanungos') {
          baseData = kanungoData;
        } else if (category === 'awc' || category === 'awcs') {
          baseData = awcData;
        }                                  
        // Calculate distance and sort from closest to farthest
        const sortedData = [...baseData].map(item => ({
          ...item,
          distance: calculateDistance(userLat, userLng, item.lat, item.lng)
        })).sort((a, b) => a.distance - b.distance);

        // Update the state with the sorted data
        setData(sortedData);
      });
    } else {
      alert("Geolocation is not supported by your browser");
    }
  };

  return (
    <div className="flex flex-1 overflow-hidden flex-col md:flex-row">
      <MapSidebar 
        data={data} 
        activeItem={activeItem} 
        setActiveItem={setActiveItem} 
        category={category}
        onLocateMe={handleLocateMe}
        userLocation={userLocation}
      />
      <MapView 
        data={data} 
        activeItem={activeItem} 
        setActiveItem={setActiveItem}
        userLocation={userLocation}
      />
    </div>
  );
}