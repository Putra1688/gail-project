"use client";

import { X } from "lucide-react";
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell 
} from 'recharts';

interface StatModalProps {
  isOpen: boolean;
  onClose: () => void;
  data: {
    name: string;
    population: number;
    density: number;
    area: number;
    elevation: number;
    landUse: { name: string; value: number }[];
  } | null;
}

const COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444'];

export default function StatModal({ isOpen, onClose, data }: StatModalProps) {
  if (!isOpen || !data) return null;

  const demographicData = [
    { name: '0-15', value: Math.floor(data.population * 0.2) },
    { name: '16-35', value: Math.floor(data.population * 0.35) },
    { name: '36-60', value: Math.floor(data.population * 0.3) },
    { name: '60+', value: Math.floor(data.population * 0.15) },
  ];

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center p-2 sm:p-4 bg-slate-950/90 backdrop-blur-md animate-in fade-in duration-300">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-lg lg:max-w-2xl overflow-hidden shadow-2xl animate-in zoom-in-95 duration-300">
        {/* Header */}
        <div className="p-4 sm:p-6 border-b border-slate-800 flex justify-between items-center bg-gradient-to-r from-slate-900 to-slate-800">
          <div>
            <h2 className="text-lg sm:text-2xl font-bold text-white tracking-tight">{data.name}</h2>
            <p className="text-slate-400 text-[10px] sm:text-xs uppercase tracking-widest">Wawasan Geografis & Demografi</p>
          </div>
          <button 
            onClick={onClose}
            className="p-2 hover:bg-slate-700 rounded-full transition-colors text-slate-400 hover:text-white"
          >
            <X size={18} />
          </button>
        </div>

        {/* Content */}
        <div className="p-4 sm:p-6 max-h-[80vh] overflow-y-auto">
          {/* Quick Stats Grid */}
          <div className="grid grid-cols-2 gap-2 sm:gap-4 mb-6">
            <StatCard label="Populasi" value={data.population.toLocaleString()} unit="Jiwa" />
            <StatCard label="Kepadatan" value={data.density.toString()} unit="/km²" />
            <StatCard label="Luas Wilayah" value={data.area.toString()} unit="km²" />
            <StatCard label="Ketinggian" value={data.elevation.toString()} unit="mdpl" />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8">
            {/* Population Chart */}
            <div>
              <h3 className="text-xs font-bold text-slate-400 mb-3 flex items-center gap-2 uppercase tracking-tighter">
                <span className="w-1.5 h-1.5 rounded-full bg-blue-500"></span>
                Distribusi Usia
              </h3>
              <div className="h-[150px] sm:h-[180px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={demographicData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#334155" vertical={false} />
                    <XAxis dataKey="name" stroke="#94a3b8" fontSize={10} tickLine={false} axisLine={false} />
                    <YAxis hide />
                    <Tooltip 
                      contentStyle={{ backgroundColor: '#1e293b', border: 'none', borderRadius: '8px', fontSize: '10px' }}
                    />
                    <Bar dataKey="value" fill="#3b82f6" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Land Use Chart */}
            <div>
              <h3 className="text-xs font-bold text-slate-400 mb-3 flex items-center gap-2 uppercase tracking-tighter">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                Penggunaan Lahan
              </h3>
              <div className="h-[150px] sm:h-[180px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={data.landUse}
                      cx="50%"
                      cy="50%"
                      innerRadius={45}
                      outerRadius={65}
                      paddingAngle={5}
                      dataKey="value"
                    >
                      {data.landUse.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip 
                       contentStyle={{ backgroundColor: '#1e293b', border: 'none', borderRadius: '8px', fontSize: '10px' }}
                    />
                  </PieChart>
                </ResponsiveContainer>
              </div>
              <div className="flex flex-wrap gap-2 mt-2 justify-center">
                {data.landUse.map((item, i) => (
                  <div key={i} className="flex items-center gap-1">
                    <div className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: COLORS[i % COLORS.length] }}></div>
                    <span className="text-[8px] text-slate-500 uppercase font-medium">{translateLandUse(item.name)}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 sm:p-6 border-t border-slate-800 bg-slate-900/50 flex justify-end">
          <button 
            onClick={onClose}
            className="w-full sm:w-auto px-6 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-lg text-sm font-bold transition-all"
          >
            TUTUP ANALISIS
          </button>
        </div>
      </div>
    </div>
  );
}

function StatCard({ label, value, unit }: { label: string, value: string, unit: string }) {
  return (
    <div className="bg-slate-800/40 p-3 sm:p-4 rounded-xl border border-slate-700/50">
      <p className="text-[9px] sm:text-[10px] text-slate-500 uppercase font-bold tracking-wider mb-1">{label}</p>
      <div className="flex items-baseline gap-1">
        <span className="text-sm sm:text-lg font-bold text-white">{value}</span>
        <span className="text-[8px] sm:text-[10px] text-slate-500 font-medium">{unit}</span>
      </div>
    </div>
  );
}

function translateLandUse(name: string) {
  const translations: { [key: string]: string } = {
    'Residential': 'Pemukiman',
    'Agriculture': 'Pertanian',
    'Forest': 'Hutan',
    'Industrial': 'Industri'
  };
  return translations[name] || name;
}
