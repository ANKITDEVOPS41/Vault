import { Shield, Mic, BarChart3, Globe } from 'lucide-react';

export default function App() {
  return (
    <div className="min-h-screen bg-slate-950 text-white font-sans selection:bg-emerald-500/30">
      {/* Navigation */}
      <nav className="flex items-center justify-between px-8 py-6 border-b border-slate-800">
        <div className="flex items-center gap-2">
          <Shield className="w-8 h-8 text-emerald-500" />
          <span className="text-2xl font-bold tracking-tighter">VAULT</span>
        </div>
        <button className="bg-emerald-600 hover:bg-emerald-500 px-6 py-2 rounded-full font-medium transition-all">
          Launch Console
        </button>
      </nav>

      {/* Hero Section */}
      <main className="max-w-6xl mx-auto px-8 pt-20 pb-32 text-center">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-900 border border-slate-800 mb-8 text-sm text-emerald-400">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
          </span>
          Protocol Version 1.0 Live
        </div>
        
        <h1 className="text-6xl md:text-8xl font-black mb-6 tracking-tight">
          Integrity is a <br />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-cyan-400">Protocol.</span>
        </h1>
        
        <p className="text-slate-400 text-xl max-w-2xl mx-auto mb-12">
          Eliminating $3 Trillion in global resource leakage through Gemini-powered 
          voice biometrics and predictive supply intelligence.
        </p>

        {/* Role Selection */}
        <div className="grid md:grid-cols-3 gap-6 text-left">
          {[
            { title: "Beneficiary", icon: Mic, desc: "Verify identity via voice-print in local dialect. No hardware required." },
            { title: "Distributor", icon: BarChart3, desc: "Predictive stock management to eliminate artificial shortages." },
            { title: "Authority", icon: Globe, desc: "Real-time geospatial fraud detection and transparency maps." }
          ].map((role, idx) => {
            const IconComponent = role.icon;
            return (
              <div key={idx} className="p-8 rounded-3xl bg-slate-900 border border-slate-800 hover:border-emerald-500/50 transition-all cursor-pointer group">
                <IconComponent className="w-10 h-10 text-emerald-500 mb-4 group-hover:scale-110 transition-transform" />
                <h3 className="text-xl font-bold mb-2">{role.title} Portal</h3>
                <p className="text-slate-400 text-sm">{role.desc}</p>
              </div>
            );
          })}
        </div>
      </main>
    </div>
  );
}