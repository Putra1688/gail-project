"use client";

import dynamic from "next/dynamic";

const Map = dynamic(() => import("@/components/Map"), { 
  ssr: false,
  loading: () => (
    <div className="flex items-center justify-center h-full w-full bg-slate-950">
      <div className="text-center">
        <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mb-4"></div>
        <p className="text-slate-400 font-medium">Initializing Map Engine...</p>
      </div>
    </div>
  )
});

export default function MapSection() {
  return (
    <div className="w-full h-full min-h-[500px]">
      <Map />
    </div>
  );
}
