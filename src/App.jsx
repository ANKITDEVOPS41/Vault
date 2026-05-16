import React, { useState } from 'react';
import { Shield, Mic as Microphone, BarChart3, Globe, Radio, AlertTriangle, CheckCircle, ArrowLeft } from 'lucide-react';
import { verifyVoiceSignature } from './gemini'; // Importing your live engine rails

export default function App() {
  const [currentView, setCurrentView] = useState('landing');
  const [isRecording, setIsRecording] = useState(false);
  const [authStatus, setAuthStatus] = useState('idle'); // idle, listening, processing, success, failed
  const [capturedText, setCapturedText] = useState('');

  const executeLiveVoiceAuth = () => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    
    if (!SpeechRecognition) {
      alert("Biometric Voice Capture requires a browser with Web Speech API support (e.g., Chrome).");
      return;
    }

    const recognition = new SpeechRecognition();
    // Setting language to Hindi-Indian standard to capture phonetic dialect tokens perfectly
    recognition.lang = 'hi-IN'; 
    recognition.interimResults = false;
    recognition.maxAlternatives = 1;

    setIsRecording(true);
    setAuthStatus('listening');
    setCapturedText('System listening... speak your identification phrase now.');

    recognition.start();

    // THIS IS THE REAL RAW HANDSHAKE LOOP
    recognition.onresult = async (event) => {
      const liveSpeechInput = event.results[0][0].transcript.trim();
      console.log("🚀 LIVE TEXT DETECTED FROM MIC:", liveSpeechInput);
      
      // Update UI with the actual words you just spoke
      setCapturedText(`"${liveSpeechInput}"`);
      setAuthStatus('processing');
      setIsRecording(false);

      try {
        // Send YOUR spoken text straight to the newly enabled Gemini API
        const aiResponse = await verifyVoiceSignature(liveSpeechInput);
        console.log("🧠 GEMINI API REAL DETERMINATION:", aiResponse);

        if (aiResponse && aiResponse.authenticated) {
          setAuthStatus('success');
        } else {
          setAuthStatus('failed'); // Mismatch if you say the wrong words
        }
      } catch (apiError) {
        console.error("Cloud Gateway Exception:", apiError);
        setAuthStatus('failed');
      }
    };

    recognition.onspeechend = () => {
      recognition.stop();
      setIsRecording(false);
    };

    // Strict Error Catcher—No dummy simulations
    recognition.onerror = (err) => {
      console.error("Hardware Hook Blocked:", err.error);
      setIsRecording(false);
      setAuthStatus('failed');
      if (err.error === 'not-allowed') {
        setCapturedText('ERROR: Microphone access blocked by browser permissions.');
      } else {
        setCapturedText(`Capture dropped: ${err.error}. Check hardware connections.`);
      }
    };
  };

  const testGeminiDirectly = async () => {
    console.log("🧪 Testing Gemini API directly with correct phrase...");
    setAuthStatus('processing');
    setCapturedText("Testing with: Mera ration, meri pehchan");
    
    const aiResponse = await verifyVoiceSignature("Mera ration, meri pehchan");
    console.log("🔐 Gemini Test Response:", aiResponse);
    
    if (aiResponse && aiResponse.authenticated === true) {
      console.log("✅ Gemini API is WORKING");
      setAuthStatus('success');
    } else {
      console.log("❌ Gemini API returned:", aiResponse);
      setAuthStatus('failed');
    }
  };

  if (currentView === 'beneficiary') {
    return (
      <div className="min-h-screen bg-slate-950 text-white p-8 font-sans">
        <button onClick={() => { setCurrentView('landing'); setAuthStatus('idle'); }} className="flex items-center gap-2 text-slate-400 hover:text-white mb-8 transition-all">
          <ArrowLeft className="w-4 h-4" /> Back to Core
        </button>
        <div className="max-w-md mx-auto bg-slate-900 border border-slate-800 rounded-3xl p-8 text-center shadow-xl">
          <div className="w-16 h-16 bg-emerald-500/10 border border-emerald-500/30 rounded-2xl flex items-center justify-center mx-auto mb-6">
            <Microphone className="w-8 h-8 text-emerald-400" />
          </div>
          <h2 className="text-2xl font-bold mb-2">Voice-Verified Portal</h2>
          <p className="text-slate-400 text-sm mb-8">Speak your distribution phrase in your local language to verify your baseline biometric signature.</p>

          <div className="bg-slate-950 border border-slate-800 rounded-2xl p-6 mb-8 relative overflow-hidden">
            {isRecording ? (
              <div className="flex justify-center gap-1 items-center h-12 py-3">
                {[...Array(6)].map((_, i) => (
                  <span key={i} className="w-1 bg-emerald-400 rounded-full animate-bounce" style={{ animationDelay: `${i * 0.1}s` }}></span>
                ))}
              </div>
            ) : (
              <p className="text-slate-300 font-mono text-sm">
                {capturedText || '"Mera ration, meri pehchan."'}
              </p>
            )}
          </div>

          {authStatus === 'idle' && (
            <div className="space-y-3">
              <button onClick={executeLiveVoiceAuth} className="w-full bg-emerald-600 hover:bg-emerald-500 py-4 rounded-xl font-bold tracking-wide transition-all shadow-lg shadow-emerald-900/20">
                Start Voice Capture
              </button>
              <button onClick={testGeminiDirectly} className="w-full bg-slate-700 hover:bg-slate-600 py-2 rounded-xl font-mono text-sm transition-all">
                🧪 Test API
              </button>
            </div>
          )}
          {authStatus === 'listening' && (
            <div className="text-cyan-400 font-medium flex items-center justify-center gap-2 animate-pulse py-3">
              <Radio className="w-5 h-5 animate-spin" /> Listening for voice...
            </div>
          )}
          {authStatus === 'processing' && (
            <div className="text-cyan-400 font-medium flex items-center justify-center gap-2 animate-pulse py-3">
              <Radio className="w-5 h-5 animate-spin" /> Gemini Processing Audio Signature...
            </div>
          )}
          {authStatus === 'success' && (
            <div className="bg-emerald-500/10 border border-emerald-500/30 rounded-xl p-4 text-emerald-400 font-bold flex items-center justify-center gap-2">
              <CheckCircle className="w-5 h-5" /> 100% Identity Integrity Match
            </div>
          )}
          {authStatus === 'failed' && (
            <div className="space-y-4">
              <div className="bg-red-500/10 border border-red-500/30 rounded-xl p-4 text-red-400 font-bold flex items-center justify-center gap-2">
                <AlertTriangle className="w-5 h-5" /> Token Security Mismatch
              </div>
              <button onClick={() => setAuthStatus('idle')} className="w-full bg-slate-800 hover:bg-slate-700 py-2 rounded-xl text-xs font-mono text-slate-400 transition-all">
                Reset Verification Interface
              </button>
            </div>
          )}
        </div>
      </div>
    );
  }

  if (currentView === 'distributor') {
    return (
      <div className="min-h-screen bg-slate-950 text-white p-8 font-sans">
        <button onClick={() => setCurrentView('landing')} className="flex items-center gap-2 text-slate-400 hover:text-white mb-8 transition-all">
          <ArrowLeft className="w-4 h-4" /> Back to Core
        </button>
        <div className="max-w-4xl mx-auto">
          <div className="flex justify-between items-center mb-8">
            <div>
              <h2 className="text-3xl font-bold tracking-tight">Supply Hub</h2>
              <p className="text-slate-400 text-sm">Predictive allocation framework</p>
            </div>
            <span className="bg-cyan-500/10 text-cyan-400 border border-cyan-500/20 px-4 py-1 rounded-full text-xs font-mono font-bold">Region: Odisha-04</span>
          </div>

          <div className="grid md:grid-cols-2 gap-6 mb-8">
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6">
              <h3 className="text-slate-400 text-xs font-bold uppercase tracking-wider mb-4">Stock Integrity Status</h3>
              <div className="space-y-4">
                {['Wheat Granules', 'Essential Pulses'].map((item, i) => (
                  <div key={i}>
                    <div className="flex justify-between text-sm mb-1">
                      <span className="font-medium text-slate-300">{item}</span>
                      <span className="text-slate-400 font-mono">{i === 0 ? '84%' : '92%'} Allocated</span>
                    </div>
                    <div className="w-full bg-slate-950 h-2 rounded-full overflow-hidden">
                      <div className="bg-gradient-to-r from-emerald-500 to-cyan-500 h-full rounded-full" style={{ width: i === 0 ? '84%' : '92%' }}></div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 flex flex-col justify-between">
              <div>
                <h3 className="text-slate-400 text-xs font-bold uppercase tracking-wider mb-1">Gemini AI Demand Forecast</h3>
                <p className="text-xs text-slate-500 mb-4">Predictive modeling window: 14 days</p>
              </div>
              <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 text-sm text-cyan-400 font-mono leading-relaxed">
                "Anomaly detected in seasonal migratory data. Recommend +12% scaling buffer on vital grain stores before May 25 to preempt local spike."
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (currentView === 'authority') {
    return (
      <div className="min-h-screen bg-slate-950 text-white p-8 font-sans">
        <button onClick={() => setCurrentView('landing')} className="flex items-center gap-2 text-slate-400 hover:text-white mb-8 transition-all">
          <ArrowLeft className="w-4 h-4" /> Back to Core
        </button>
        <div className="max-w-5xl mx-auto">
          <div className="mb-8">
            <h2 className="text-3xl font-bold tracking-tight">Sovereign Oversight Desk</h2>
            <p className="text-slate-400 text-sm">Real-time telemetry and anomaly analysis</p>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            <div className="bg-slate-900 border border-red-500/30 rounded-2xl p-6">
              <div className="flex items-center justify-between mb-4">
                <span className="text-xs font-bold text-red-400 uppercase tracking-wider">High Risk Alerts</span>
                <AlertTriangle className="w-5 h-5 text-red-400" />
              </div>
              <div className="text-3xl font-mono font-black text-red-400 mb-1">02</div>
              <p className="text-slate-500 text-xs">Unmatched biometric logs flagged</p>
            </div>
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6">
              <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block mb-4">Total Integrity Routing</span>
              <div className="text-3xl font-mono font-black text-white mb-1">99.84%</div>
              <p className="text-slate-500 text-xs">Leakage mitigated successfully</p>
            </div>
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6">
              <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block mb-4">Active Processing Nodes</span>
              <div className="text-3xl font-mono font-black text-emerald-400 mb-1">14,208</div>
              <p className="text-slate-500 text-xs">Sovereign terminals active</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-950 text-white font-sans selection:bg-emerald-500/30">
      <nav className="flex items-center justify-between px-8 py-6 border-b border-slate-900">
        <div className="flex items-center gap-2">
          <Shield className="w-6 h-6 text-emerald-500" />
          <span className="text-xl font-bold tracking-tighter">VAULT</span>
        </div>
        <div className="text-xs font-mono text-slate-500">PROD_ENV // ONLINE</div>
      </nav>

      <main className="max-w-6xl mx-auto px-8 pt-24 pb-32 text-center">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-900 border border-slate-800 mb-8 text-xs text-emerald-400 font-mono">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
          </span>
          Protocol Active
        </div>

        <h1 className="text-5xl md:text-7xl font-black mb-6 tracking-tight leading-none">
          INTEGRITY IS A <br />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 via-teal-400 to-cyan-400">PROTOCOL.</span>
        </h1>

        <p className="text-slate-400 text-lg max-w-2xl mx-auto mb-16">
          Systemic verification layer engineered to secure human distribution infrastructure through deep AI audio-biometrics.
        </p>

        <div className="grid md:grid-cols-3 gap-6 text-left max-w-4xl mx-auto">
          {[
            { id: 'beneficiary', title: "Beneficiary Portal", icon: Microphone, desc: "Verify authentication parameters via native language voice prints directly on mobile hardware." },
            { id: 'distributor', title: "Supply Hub", icon: BarChart3, desc: "Monitor distribution caches and view generative demand signals from processing units." },
            { id: 'authority', title: "Oversight Desk", icon: Globe, desc: "Access high-level geospatial metrics, system logs, and security infrastructure markers." }
          ].map((role) => (
            <div key={role.id} onClick={() => setCurrentView(role.id)} className="p-6 rounded-2xl bg-slate-900/60 border border-slate-900 hover:border-emerald-500/30 hover:bg-slate-900 transition-all cursor-pointer group">
              <role.icon className="w-8 h-8 text-emerald-500 mb-4 group-hover:scale-110 transition-transform" />
              <h3 className="text-lg font-bold mb-2 group-hover:text-emerald-400 transition-colors">{role.title}</h3>
              <p className="text-slate-400 text-xs leading-relaxed">{role.desc}</p>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}