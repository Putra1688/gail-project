"use client";

import { MapContainer, TileLayer, GeoJSON } from "react-leaflet";
import { useEffect, useState } from "react";
import StatModal from "./StatModal";
import L from "leaflet";
import { fetchAllSheets, SheetData } from "@/lib/googleSheets";

const GIDS = {
  main: "350773398",
  education: "1028742401",
  quiz: "1004678348",
};


interface GeoData {
  type: string;
  features: any[];
}

export default function Map() {
  const [geoData, setGeoData] = useState<GeoData | null>(null);
  const [selectedStats, setSelectedStats] = useState<any>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [sheetsData, setSheetsData] = useState<Record<string, SheetData[]> | null>(null);
  const [isLoadingData, setIsLoadingData] = useState(true);


  useEffect(() => {
    // Fetch GeoJSON
    fetch("/map-data.json")
      .then((res) => res.json())
      .then((data: GeoData) => setGeoData(data))
      .catch(err => console.error("Error loading map data:", err));

    // Fetch Google Sheets Data
    fetchAllSheets(GIDS)
      .then(data => {
        setSheetsData(data);
        setIsLoadingData(false);
      })
      .catch(err => {
        console.error("Error loading sheets data:", err);
        setIsLoadingData(false);
      });
  }, []);

  const getRealStats = (name: string) => {
    if (!sheetsData) return null;

    // Cari di MainData (menggunakan kolom 'NAME_3')
    const mainRow = sheetsData.main.find(row => 
      row.NAME_3?.toString().toLowerCase() === name.toLowerCase()
    );

    if (!mainRow) {
      console.warn(`Data tidak ditemukan untuk: ${name}`);
      return { name, notFound: true };
    }


    // Ambil data pendidikan
    const eduRow = sheetsData.education.find(row => 
      row.NAME_3?.toString().toLowerCase() === name.toLowerCase()
    );

    // Ambil data kuis (bisa banyak baris, ambil semua yang cocok)
    const quizRows = sheetsData.quiz.filter(row => {
      const sheetName = row.NAME_3?.toString().trim().toLowerCase();
      const targetName = name.trim().toLowerCase();
      return sheetName === targetName;
    });

    console.log(`Quiz found for ${name}:`, quizRows.length);

    return {
      name: name,
      description: mainRow.Deskripsi || "",
      imageUrl: mainRow.URL_Gambar || "",
      population: mainRow.Populasi || 0,
      density: mainRow.Kepadatan || 0,
      area: mainRow.Luas_Wilayah || 0,
      elevation: mainRow.Ketinggian || 0,
      landUse: [
        { name: 'Residential', value: mainRow.Lahan_Permukiman || 0 },
        { name: 'Agriculture', value: mainRow.Lahan_Sawah || 0 },
        { name: 'Forest', value: mainRow.Lahan_Hutan || 0 },
        { name: 'Industrial', value: 0 }, 
      ],
      education: eduRow ? {
        sd: eduRow.Jml_SD,
        smp: eduRow.Jml_SMP,
        sma: eduRow.Jml_SMA,
        universitas: eduRow.Jml_Universitas,
        avgSchooling: eduRow.Rerata_Lama_Sekolah
      } : null,
      quiz: quizRows.length > 0 ? quizRows : null,
      isRealData: true
    };

  };



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

  if (!geoData || isLoadingData) return (
    <div className="flex items-center justify-center h-full min-h-[400px] bg-slate-950 rounded-2xl border border-slate-800">
      <div className="animate-pulse text-blue-500 font-mono tracking-widest uppercase text-[10px] sm:text-xs flex flex-col items-center gap-3">
        <span className="w-8 h-8 border-2 border-blue-500 border-t-transparent rounded-full animate-spin"></span>
        Memproses Data Spasial & Spreadsheet...
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
                const stats = getRealStats(name);
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