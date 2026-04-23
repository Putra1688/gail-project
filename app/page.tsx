import MapSection from "@/components/MapSection";
import { LayoutDashboard, Map as MapIcon, Database, Settings, Shield, Info } from "lucide-react";

export default function Home() {
  return (
    <main className="flex h-screen w-screen overflow-hidden bg-slate-950 text-slate-200">
      {/* Sidebar - Premium Minimalist */}
      <aside className="w-16 lg:w-64 border-r border-slate-800 flex flex-col items-center lg:items-stretch py-8 transition-all shrink-0">
        <div className="px-6 mb-12">
          <h1 className="text-2xl font-black text-white tracking-tighter flex items-center gap-2">
            <span className="bg-blue-600 w-8 h-8 rounded-lg flex items-center justify-center text-sm shadow-lg shadow-blue-500/20">G</span>
            <span className="hidden lg:block">GAIL.</span>
          </h1>
          <p className="text-[10px] text-slate-500 font-mono mt-1 hidden lg:block tracking-widest uppercase opacity-50">Intelijen Geospasial</p>
        </div>

        <nav className="flex-1 px-4 space-y-2 w-full">
          <NavItem icon={<LayoutDashboard size={20} />} label="Dashboard" active />
          <NavItem icon={<MapIcon size={20} />} label="Penjelajah Peta" />
          <NavItem icon={<Database size={20} />} label="Layer Data" />
          <NavItem icon={<Shield size={20} />} label="Keamanan" />
        </nav>

        <div className="px-4 mt-auto pt-8 border-t border-slate-800/50 w-full">
          <NavItem icon={<Settings size={20} />} label="Pengaturan" />
          <NavItem icon={<Info size={20} />} label="Dokumentasi" />
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col relative min-w-0">
        {/* Top Header */}
        <header className="h-16 border-b border-slate-800 flex items-center justify-between px-4 sm:px-8 bg-slate-950/50 backdrop-blur-xl z-10">
          <div className="flex items-center gap-4">
            <div className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse shadow-[0_0_8px_rgba(16,185,129,0.6)]"></div>
            <span className="text-[10px] sm:text-xs font-mono text-slate-400 tracking-wider">STATUS SISTEM: OPTIMAL</span>
          </div>
          
          <div className="flex items-center gap-6">
            <div className="text-right hidden sm:block">
              <p className="text-[10px] text-slate-500 font-medium uppercase tracking-tighter">Sesi Pengguna</p>
              <p className="text-sm font-bold text-white">Administrator</p>
            </div>
            <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-gradient-to-tr from-blue-600 to-indigo-600 border-2 border-slate-800"></div>
          </div>
        </header>

        {/* Map Explorer Container */}
        <div className="flex-1 relative overflow-hidden bg-slate-900">
          <MapSection />
          
          {/* Floating HUD Elements */}
          <div className="absolute top-4 left-4 z-[500] space-y-4 pointer-events-none sm:top-6 sm:left-6">
            <div className="bg-slate-900/80 backdrop-blur-md border border-slate-700/50 p-3 sm:p-4 rounded-xl shadow-2xl">
              <h3 className="text-[8px] sm:text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-2 sm:mb-3">Informasi Langsung</h3>
              <div className="space-y-2">
                <div className="flex items-center gap-3">
                  <div className="w-1 h-6 sm:h-8 bg-blue-500 rounded-full"></div>
                  <div>
                    <p className="text-[9px] text-slate-500">Pemrosesan Wilayah</p>
                    <p className="text-[10px] sm:text-xs font-bold text-white">Analitik Kota Malang</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}

function NavItem({ icon, label, active = false }: { icon: React.ReactNode, label: string, active?: boolean }) {
  return (
    <button className={`w-full flex items-center justify-center lg:justify-start gap-4 px-3 lg:px-4 py-3 rounded-xl transition-all group ${
      active 
        ? "bg-blue-600/10 text-blue-400 border border-blue-600/20" 
        : "text-slate-500 hover:text-slate-200 hover:bg-slate-800/50"
    }`}>
      <span className={`${active ? "text-blue-400" : "group-hover:scale-110 transition-transform"}`}>
        {icon}
      </span>
      <span className="text-xs font-bold uppercase tracking-tighter hidden lg:block">{label}</span>
    </button>
  );
}