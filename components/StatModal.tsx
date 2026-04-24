"use client";

import { useState, useEffect } from "react";
import { X, Info, HelpCircle, AlertCircle, CheckCircle2, ChevronRight } from "lucide-react";
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell 
} from 'recharts';

interface StatModalProps {
  isOpen: boolean;
  onClose: () => void;
  data: {
    name: string;
    notFound?: boolean;
    description?: string;
    imageUrl?: string;
    population?: number;
    density?: number;
    area?: number;
    elevation?: number;
    landUse?: { name: string; value: number }[];
    education?: {
      sd: number;
      smp: number;
      sma: number;
      universitas: number;
      avgSchooling: number;
    } | null;
    quiz?: any[] | null;
  } | null;
}

const COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444'];

export default function StatModal({ isOpen, onClose, data }: StatModalProps) {
  const [activeTab, setActiveTab] = useState<'insights' | 'quiz'>('insights');
  const [userAnswers, setUserAnswers] = useState<Record<number, string>>({});
  const [showResult, setShowResult] = useState(false);
  const [finalScore, setFinalScore] = useState(0);

  useEffect(() => {
    if (isOpen) {
      setActiveTab('insights');
      setUserAnswers({});
      setShowResult(false);
      setFinalScore(0);
    }
  }, [isOpen]);

  if (!isOpen || !data) return null;

  if (data.notFound) {
    return (
      <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-slate-950/90 backdrop-blur-md">
        <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-md p-8 text-center shadow-2xl animate-in zoom-in-95 duration-300">
          <div className="w-16 h-16 bg-red-500/10 text-red-500 rounded-full flex items-center justify-center mx-auto mb-4">
            <AlertCircle size={32} />
          </div>
          <h2 className="text-xl font-bold text-white mb-2">{data.name}</h2>
          <p className="text-slate-400 mb-6">Maaf, data untuk wilayah ini belum tersedia di basis data kami.</p>
          <button 
            onClick={onClose}
            className="w-full py-3 bg-slate-800 hover:bg-slate-700 text-white rounded-xl font-bold transition-all"
          >
            Kembali ke Peta
          </button>
        </div>
      </div>
    );
  }

  const educationChartData = data.education ? [
    { name: 'SD', value: data.education.sd },
    { name: 'SMP', value: data.education.smp },
    { name: 'SMA', value: data.education.sma },
    { name: 'PT', value: data.education.universitas },
  ] : [];

  const handleSelectAnswer = (questionIndex: number, option: string) => {
    setUserAnswers(prev => ({ ...prev, [questionIndex]: option }));
  };

  const handleSubmitQuiz = () => {
    if (!data.quiz) return;
    
    let score = 0;
    data.quiz.forEach((q, idx) => {
      if (userAnswers[idx] === q.Jawaban_Benar) {
        score++;
      }
    });
    
    setFinalScore(score);
    setShowResult(true);
  };

  const handleResetQuiz = () => {
    setUserAnswers({});
    setShowResult(false);
    setFinalScore(0);
  };

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center p-3 sm:p-6 bg-slate-950/90 backdrop-blur-md animate-in fade-in duration-300">
      <div className="bg-slate-900 border border-slate-800 rounded-3xl w-full max-w-lg lg:max-w-2xl overflow-hidden shadow-2xl animate-in zoom-in-95 duration-300 flex flex-col max-h-[85vh] sm:max-h-[90vh] relative">
        
        {/* Result Overlay Popup */}
        {showResult && (
          <div className="absolute inset-0 z-[100] flex items-center justify-center p-6 bg-slate-950/60 backdrop-blur-md animate-in fade-in duration-300">
            <div className="bg-slate-900 border border-blue-500/50 p-6 sm:p-8 rounded-3xl shadow-[0_0_50px_rgba(59,130,246,0.2)] max-w-[280px] sm:max-w-[320px] w-full text-center transform animate-in zoom-in duration-300">
               <div className="w-16 h-16 sm:w-20 sm:h-20 bg-blue-600/20 text-blue-500 rounded-full flex items-center justify-center mx-auto mb-4 sm:mb-6 border border-blue-500/30">
                  <HelpCircle size={32} />
               </div>
               <h4 className="text-white font-bold text-xl sm:text-2xl mb-2">Hasil Kuis</h4>
               <p className="text-slate-400 text-xs sm:text-sm mb-6">Skor akhir untuk wilayah <span className="text-blue-400 font-semibold">{data.name}</span>:</p>
               
               <div className="bg-slate-950/50 rounded-2xl p-4 border border-slate-800 mb-6 sm:mb-8">
                  <p className="text-[10px] text-slate-500 uppercase font-bold tracking-widest mb-1">Skor Akhir</p>
                  <p className="text-3xl sm:text-4xl font-black text-white">{finalScore} <span className="text-lg text-slate-600">/ {data.quiz?.length}</span></p>
               </div>
               
               <div className="flex flex-col gap-2 sm:gap-3">
                 <button 
                  onClick={handleResetQuiz}
                  className="w-full py-3 bg-blue-600 hover:bg-blue-500 text-white rounded-xl font-bold text-[10px] sm:text-xs uppercase tracking-widest transition-all"
                 >
                   Kerjakan Ulang
                 </button>
                 <button 
                  onClick={() => {
                    setShowResult(false);
                    setActiveTab('insights');
                  }}
                  className="w-full py-3 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl font-bold text-[10px] sm:text-xs uppercase tracking-widest transition-all"
                 >
                   Tutup
                 </button>
               </div>
            </div>
          </div>
        )}

        {/* Header with Tabs */}
        <div className="p-4 sm:p-6 border-b border-slate-800 bg-gradient-to-r from-slate-900 to-slate-800">
          <div className="flex justify-between items-start mb-4 sm:mb-6">
            <div>
              <h2 className="text-lg sm:text-2xl font-bold text-white tracking-tight">{data.name}</h2>
              <p className="text-slate-500 text-[8px] sm:text-xs uppercase tracking-widest mt-0.5 sm:mt-1">Sistem Informasi Spasial</p>
            </div>
            <button 
              onClick={onClose}
              className="p-1.5 sm:p-2 hover:bg-slate-700 rounded-full transition-colors text-slate-400 hover:text-white"
            >
              <X size={18} />
            </button>
          </div>

          <div className="flex gap-1.5 p-1 bg-slate-950/50 rounded-xl w-fit border border-slate-800">
            <button 
              onClick={() => setActiveTab('insights')}
              className={`px-4 sm:px-6 py-1.5 sm:py-2 rounded-lg text-[10px] sm:text-xs font-bold transition-all flex items-center gap-2 ${activeTab === 'insights' ? 'bg-blue-600 text-white shadow-lg' : 'text-slate-500 hover:text-slate-300'}`}
            >
              <Info size={12} />
              WAWASAN
            </button>
            <button 
              onClick={() => setActiveTab('quiz')}
              className={`px-4 sm:px-6 py-1.5 sm:py-2 rounded-lg text-[10px] sm:text-xs font-bold transition-all flex items-center gap-2 ${activeTab === 'quiz' ? 'bg-blue-600 text-white shadow-lg' : 'text-slate-500 hover:text-slate-300'}`}
            >
              <HelpCircle size={12} />
              KUIS
            </button>
          </div>
        </div>

        {/* Scrollable Content */}
        <div className="flex-1 overflow-y-auto custom-scrollbar p-4 sm:p-6">
          {activeTab === 'insights' ? (
            <div className="space-y-4 sm:space-y-6">
              {/* Image & Description Section */}
              <div className="flex flex-col md:flex-row gap-4 sm:gap-6">
                {data.imageUrl && (
                  <div className="w-full md:w-1/3 aspect-[21/9] md:aspect-square rounded-2xl overflow-hidden border border-slate-700 shadow-xl">
                    <img 
                      src={data.imageUrl} 
                      alt={data.name} 
                      className="w-full h-full object-cover"
                      onError={(e) => (e.currentTarget.parentElement!.style.display = 'none')}
                    />
                  </div>
                )}
                <div className={data.imageUrl ? "w-full md:w-2/3" : "w-full"}>
                  <div className="bg-slate-800/20 p-4 sm:p-5 rounded-2xl border border-slate-800/50 h-full">
                    <h3 className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-2 sm:mb-3">Profil Wilayah</h3>
                    <p className="text-slate-300 text-xs sm:text-sm leading-relaxed italic">
                      {data.description || `Data spasial dan statistik untuk wilayah ${data.name}.`}
                    </p>
                  </div>
                </div>
              </div>

              {/* Quick Stats Grid */}
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-2 sm:gap-3">
                <StatCard label="Populasi" value={(data.population || 0).toLocaleString()} unit="Jiwa" />
                <StatCard label="Kepadatan" value={(data.density || 0).toLocaleString()} unit="/km²" />
                <StatCard label="Luas" value={(data.area || 0).toLocaleString()} unit="km²" />
                <StatCard label="Tinggi" value={(data.elevation || 0).toLocaleString()} unit="mdpl" />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Land Use Section */}
                <div className="bg-slate-800/20 p-5 rounded-2xl border border-slate-800">
                  <h3 className="text-[10px] font-bold text-slate-400 mb-5 flex items-center gap-2 uppercase tracking-widest">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                    Tata Guna Lahan
                  </h3>
                  <div className="h-[200px] w-full">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={data.landUse}
                          cx="50%"
                          cy="50%"
                          innerRadius={50}
                          outerRadius={75}
                          paddingAngle={8}
                          dataKey="value"
                        >
                          {(data.landUse || []).map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                          ))}
                        </Pie>
                        <Tooltip 
                           contentStyle={{ backgroundColor: '#0f172a', border: '1px solid #1e293b', borderRadius: '12px', fontSize: '10px' }}
                        />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                  <div className="flex flex-wrap gap-x-6 gap-y-3 mt-4 justify-center">
                    {(data.landUse || []).map((item, i) => (
                      <div key={i} className="flex items-center gap-2">
                        <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: COLORS[i % COLORS.length] }}></div>
                        <span className="text-[10px] text-slate-400 uppercase font-semibold">{translateLandUse(item.name)}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Education Section */}
                <div className="bg-slate-800/20 p-5 rounded-2xl border border-slate-800">
                  <h3 className="text-[10px] font-bold text-slate-400 mb-5 flex items-center gap-2 uppercase tracking-widest">
                    <span className="w-1.5 h-1.5 rounded-full bg-blue-500"></span>
                    Statistik Pendidikan
                  </h3>
                  {data.education ? (
                    <div className="space-y-6">
                      <div className="h-[160px] w-full">
                        <ResponsiveContainer width="100%" height="100%">
                          <BarChart data={educationChartData}>
                            <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" vertical={false} />
                            <XAxis dataKey="name" stroke="#64748b" fontSize={10} tickLine={false} axisLine={false} />
                            <YAxis hide />
                            <Tooltip 
                              cursor={{fill: 'rgba(255,255,255,0.05)'}}
                              contentStyle={{ backgroundColor: '#0f172a', border: '1px solid #1e293b', borderRadius: '12px', fontSize: '10px' }}
                            />
                            <Bar dataKey="value" fill="#3b82f6" radius={[6, 6, 0, 0]} />
                          </BarChart>
                        </ResponsiveContainer>
                      </div>
                      <div className="bg-blue-600/10 p-3 rounded-xl border border-blue-500/20 text-center">
                        <p className="text-[9px] text-blue-400 uppercase font-bold tracking-widest mb-1">Indikator Literasi</p>
                        <p className="text-2xl font-bold text-white">{data.education.avgSchooling} <span className="text-xs text-slate-500 font-medium">Tahun Rerata Sekolah</span></p>
                      </div>
                    </div>
                  ) : (
                    <div className="h-[240px] flex flex-col items-center justify-center text-slate-600">
                       <HelpCircle size={40} className="mb-3 opacity-20" />
                       <p className="text-xs italic">Data pendidikan tidak tersedia</p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          ) : (
            <div className="space-y-12 py-4">
              {data.quiz && data.quiz.length > 0 ? (
                <>
                  <div className="space-y-10">
                    {data.quiz.map((q, idx) => (
                      <div key={idx} className="space-y-4 animate-in fade-in slide-in-from-bottom-4 duration-500" style={{ animationDelay: `${idx * 100}ms` }}>
                        <div className="flex items-center gap-3">
                          <span className="w-6 h-6 bg-blue-600 text-white rounded-full flex items-center justify-center text-[10px] font-bold">
                            {idx + 1}
                          </span>
                          <h3 className="text-white font-bold text-base leading-snug">
                            {q.Pertanyaan}
                          </h3>
                        </div>

                        <div className="grid grid-cols-1 gap-2 ml-9">
                          {['A', 'B', 'C', 'D'].map((opt) => {
                            const optionKey = `Opsi_${opt}`;
                            const isSelected = userAnswers[idx] === opt;
                            
                            return (
                              <button 
                                key={opt}
                                onClick={() => handleSelectAnswer(idx, opt)}
                                className={`p-3 rounded-xl border text-left transition-all flex items-center gap-3 group ${isSelected ? 'bg-blue-600/20 border-blue-500 text-white shadow-[0_0_15px_rgba(59,130,246,0.1)]' : 'bg-slate-800/40 border-slate-700/50 hover:bg-slate-800 hover:border-slate-600 text-slate-400'}`}
                              >
                                <span className={`w-6 h-6 rounded flex items-center justify-center font-bold text-[10px] ${isSelected ? 'bg-blue-500 text-white' : 'bg-slate-900 text-slate-500 group-hover:text-slate-300'}`}>
                                  {opt}
                                </span>
                                <span className="text-sm">{q[optionKey]}</span>
                              </button>
                            );
                          })}
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="pt-6">
                    <button 
                      onClick={handleSubmitQuiz}
                      disabled={Object.keys(userAnswers).length < data.quiz.length}
                      className={`w-full py-4 rounded-2xl font-bold text-sm uppercase tracking-widest transition-all flex items-center justify-center gap-3 shadow-2xl ${Object.keys(userAnswers).length < data.quiz.length ? 'bg-slate-800 text-slate-500 cursor-not-allowed border border-slate-700' : 'bg-blue-600 hover:bg-blue-500 text-white shadow-blue-900/30'}`}
                    >
                      {Object.keys(userAnswers).length < data.quiz.length ? `Selesaikan Semua Soal (${Object.keys(userAnswers).length}/${data.quiz.length})` : 'KIRIM JAWABAN KUIS'}
                      <CheckCircle2 size={18} />
                    </button>
                  </div>
                </>
              ) : (
                <div className="h-[400px] flex flex-col items-center justify-center text-slate-600 text-center px-8">
                  <div className="w-20 h-20 bg-slate-800/50 rounded-full flex items-center justify-center mb-6">
                    <HelpCircle size={40} className="opacity-20" />
                  </div>
                  <h4 className="text-white font-bold mb-2">Kuis Belum Tersedia</h4>
                  <p className="text-xs leading-relaxed">Belum ada pertanyaan kuis yang terdaftar untuk wilayah {data.name}. Jelajahi tab Wawasan untuk mempelajari lebih lanjut.</p>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 sm:p-6 border-t border-slate-800 bg-slate-900/80 backdrop-blur-md flex justify-between items-center">
          <div className="hidden sm:block">
             <p className="text-[10px] text-slate-500 font-medium italic">Sumber Data: Google Spreadsheet (Real-time)</p>
          </div>
          <button 
            onClick={onClose}
            className="w-full sm:w-auto px-10 py-3 bg-slate-800 hover:bg-slate-700 text-white rounded-xl text-xs font-bold uppercase tracking-widest transition-all border border-slate-700"
          >
            TUTUP
          </button>
        </div>
      </div>
    </div>
  );
}


function StatCard({ label, value, unit }: { label: string, value: string, unit: string }) {
  return (
    <div className="bg-slate-800/40 p-3 sm:p-4 rounded-xl border border-slate-700/50 hover:bg-slate-800/60 transition-colors">
      <p className="text-[9px] sm:text-[10px] text-slate-500 uppercase font-bold tracking-widest mb-1">{label}</p>
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
    'Agriculture': 'Sawah',
    'Forest': 'Hutan',
    'Industrial': 'Industri'
  };
  return translations[name] || name;
}

