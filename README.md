# GAIL — Geo-Atlas Interactive Learning

[![Next.js](https://img.shields.io/badge/Next.js-15.0-black?style=for-the-badge&logo=next.js)](https://nextjs.org/)
[![React](https://img.shields.io/badge/React-19.0-blue?style=for-the-badge&logo=react)](https://react.dev/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-4.0-38B2AC?style=for-the-badge&logo=tailwind-css)](https://tailwindcss.com/)
[![Leaflet](https://img.shields.io/badge/Leaflet-1.9-green?style=for-the-badge&logo=leaflet)](https://leafletjs.org/)
[![QGIS](https://img.shields.io/badge/QGIS-3.x-589632?style=for-the-badge&logo=qgis)](https://qgis.org/)

**GAIL** (Geo-Atlas Interactive Learning) is a premium, high-performance interactive atlas designed for educational exploration and regional intelligence. Focused on **Kota Malang**, GAIL transforms complex geospatial data into an engaging learning experience, allowing users to discover urban demographics, education metrics, and land-use patterns through an intuitive digital map.

---

## 🏛️ System Architecture

GAIL follows a modern, decoupled architecture designed for speed and scalability. It bridges the gap between static GIS data and an interactive learning environment.

```mermaid
graph TD
    subgraph "Data Preparation (The GIS Pipeline)"
        QGIS[QGIS Desktop] -->|Geometry Cleaning| GEOJSON[map-data.json]
        QGIS -->|Attribute Join| GEOJSON
    end

    subgraph "Data Source (Dynamic)"
        GS[Google Sheets] -->|CSV Export| PAPA[PapaParse]
    end

    subgraph "Frontend Application (Next.js)"
        GEOJSON -->|Static Fetch| LEAFLET[React Leaflet]
        PAPA -->|Dynamic Fetch| STATE[React State]
        LEAFLET -->|Interaction| MODAL[StatModal & Analytics]
        STATE -->|Data Binding| MODAL
        MODAL -->|Visualization| RECHARTS[Recharts]
    end
```

---

## 🛠️ Tech Stack

- **Framework**: [Next.js](https://nextjs.org/) (App Router) — Providing optimized routing and server-side capabilities.
- **Mapping**: [Leaflet](https://leafletjs.org/) & [React-Leaflet](https://react-leaflet.js.org/) — Handling complex GeoJSON rendering and interactive map layers.
- **Styling**: [Tailwind CSS 4](https://tailwindcss.com/) — Next-generation CSS framework for a premium, dark-themed HUD aesthetic.
- **Data Fetching**: [PapaParse](https://www.papaparse.com/) — For fast, client-side parsing of live Google Sheets data.
- **Visualizations**: [Recharts](https://recharts.org/) — Interactive, responsive charts for demographic and land-use analysis.
- **Icons**: [Lucide React](https://lucide.dev/) — Minimalist, consistent iconography.

---

## 🗺️ Peran QGIS dalam Proyek (The Role of QGIS)

Dalam sistem GAIL, **QGIS** bertindak sebagai *Geospatial Data Processor* utama. Tanpa QGIS, data peta tidak dapat dikonsumsi dengan efisien oleh platform web.

Berikut adalah peran krusial QGIS dalam proyek ini:

1.  **Data Harmonization**: QGIS digunakan untuk memastikan koordinat sistem (CRS) menggunakan **WGS 84 (EPSG:4326)**, yang merupakan standar untuk pemetaan web seperti Leaflet.
2.  **Geometry Optimization**: File peta asli (biasanya berformat SHP atau KML) seringkali terlalu berat untuk web. QGIS digunakan untuk melakukan *Simplify Geometry* guna mengurangi ukuran file tanpa menghilangkan detail batas administrasi yang penting.
3.  **Attribute Management**: Mengatur tabel atribut agar kolom kunci (seperti `NAME_3` untuk nama kecamatan) sinkron dengan kunci data yang ada di **Google Sheets**.
4.  **GeoJSON Export**: QGIS berfungsi sebagai jembatan untuk mengekspor data vektor menjadi format `map-data.json` yang dapat dibaca oleh React secara langsung.

---

## 🚀 Key Features

- **Interactive Geo-Atlas**: Eksplorasi interaktif batas wilayah (Kecamatan) di Kota Malang dengan antarmuka yang edukatif.
- **Dynamic Learning Data**: Integrasi statistik langsung dari Google Sheets (Populasi, Pendidikan, Lahan) untuk pembelajaran berbasis data nyata.
- **Visual Analytics Hub**: Grafik interaktif menggunakan Recharts untuk mempermudah pemahaman distribusi data wilayah.
- **Interactive Quiz Module**: Fitur evaluasi mandiri melalui soal-soal kuis dinamis yang disesuaikan dengan data spesifik setiap wilayah.
- **High-Performance Map**: Menggunakan *Dark Mode basemaps* untuk fokus visual yang tajam pada data tematik.
- **Educational Insights**: Modal analitik yang menyajikan informasi mendalam mengenai profil wilayah secara terstruktur.

---

## 📁 Project Structure

```text
├── app/                # Next.js App Router (Layouts & Pages)
├── components/         # Reusable UI Components (Map, Modal, Nav)
├── lib/                # Logic for Google Sheets fetching & data parsing
├── public/             # Static assets (map-data.json, SVG icons)
├── styles/             # Global Tailwind configurations
└── package.json        # Dependencies & Project Scripts
```

---

## 🔧 System Logic

1.  **Map Initialization**: Saat aplikasi dimuat, sistem mengambil `map-data.json` dari direktori publik.
2.  **Data Sync**: Secara paralel, sistem melakukan *multi-sheet fetching* ke Google Sheets API menggunakan Grid ID (GID) yang spesifik.
3.  **Spatial Join (Virtual)**: Saat pengguna mengklik wilayah di peta, sistem melakukan pencarian *lookup* antara properti GeoJSON dan data Google Sheets (termasuk data kuis) berdasarkan nama wilayah.
4.  **Dynamic Rendering**: Hasil pencarian dikirim ke `StatModal` untuk dirender menjadi grafik, informasi profil, dan modul kuis interaktif.

---

<p align="center">
  Developed with ❤️ for Geospatial Excellence.
</p>
