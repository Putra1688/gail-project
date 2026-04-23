"use client";

import { MapContainer, TileLayer, GeoJSON } from "react-leaflet";
import { useEffect, useState } from "react";
import StatModal from "./StatModal";
import L from "leaflet";

interface GeoData {
  type: string;
  features: any[];
}

export default function Map() {
  const [geoData, setGeoData] = useState<GeoData | null>(null);
  const [selectedStats, setSelectedStats] = useState<any>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    fetch("/map-data.json")
      .then((res) => res.json())
      .then((data: GeoData) => setGeoData(data))
      .catch(err => console.error("Error loading map data:", err));
  }, []);

  const generateDummyStats = (name: string) => {
    const hash = name.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
    
    const residential = 30 + (hash % 30);
    const agriculture = 20 + (hash % 20);
    const forest = 10 + (hash % 20);
    const industrial = Math.max(5, 100 - (residential + agriculture + forest));

    return {
      name: name,
      population: 50000 + (hash * 10 % 100000),
      density: 1200 + (hash % 2000),
      area: 15 + (hash % 50),
      elevation: 400 + (hash % 1200),
      landUse: [
        { name: 'Residential', value: residential },
        { name: 'Agriculture', value: agriculture },
        { name: 'Forest', value: forest },
        { name: 'Industrial', value: industrial },
      ]
    };
  };

  const getGeojsonStyle = (): L.PathOptions => ({
    fillColor: "#3b82f6",
    weight: 1,
    opacity: 0.5,
    color: "rgba(255, 255, 255, 0.3)",
    fillOpacity: 0.1,
  });

  if (!geoData) return (
    <div className="flex items-center justify-center h-full min-h-[400px] bg-slate-950 rounded-2xl border border-slate-800">
      <div className="animate-pulse text-blue-500 font-mono tracking-widest uppercase text-[10px] sm:text-xs">
        Memuat Mesin Spasial...
      </div>
    </div>
  );

  return (
    <div className="h-full w-full relative group">
      <MapContainer 
        center={[-7.9666, 112.6326]} 
        zoom={12} 
        className="h-full w-full bg-slate-950 z-0"
        scrollWheelZoom={true}
      >
        <TileLayer
          url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OSM</a>'
        />
        <GeoJSON 
          data={geoData as any} 
          style={getGeojsonStyle}
          onEachFeature={(feature, layer) => {
            layer.on({
              mouseover: (e: L.LeafletMouseEvent) => {
                const target = e.target;
                if (target && typeof target.setStyle === 'function') {
                  target.setStyle({
                    fillOpacity: 0.4,
                    fillColor: "#60a5fa",
                    color: "#fff",
                    weight: 2
                  });
                }
              },
              mouseout: (e: L.LeafletMouseEvent) => {
                const target = e.target;
                if (target && typeof target.setStyle === 'function') {
                  target.setStyle(getGeojsonStyle());
                }
              },
              click: () => {
                const name = feature.properties?.NAME_3 || feature.properties?.name || "Kecamatan Tidak Diketahui";
                const stats = generateDummyStats(name);
                setSelectedStats(stats);
                setIsModalOpen(true);
              }
            });
          }}
        />
      </MapContainer>

      <StatModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        data={selectedStats} 
      />
      
      <div className="absolute bottom-4 sm:bottom-6 left-1/2 -translate-x-1/2 z-[1000] bg-slate-900/90 backdrop-blur-md border border-slate-700/50 px-4 py-2 rounded-full shadow-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none w-max">
        <p className="text-white text-[8px] sm:text-[10px] font-bold uppercase tracking-[0.2em] flex items-center gap-3">
          <span className="w-1.5 h-1.5 rounded-full bg-blue-500 animate-pulse"></span>
          Pilih Kecamatan untuk Analitik Mendalam
        </p>
      </div>
    </div>
  );
}