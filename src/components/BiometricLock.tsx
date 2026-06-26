import React, { useState, useEffect } from "react";
import { ShieldCheck, KeyRound, AlertCircle } from "lucide-react";
import { motion } from "motion/react";

interface BiometricLockProps {
  onUnlock: () => void;
  isBiometricsActive: boolean;
}

export default function BiometricLock({ onUnlock }: BiometricLockProps) {
  const [pin, setPin] = useState<string>("");
  const [errorMsg, setErrorMsg] = useState<string>("");

  // Auto-submit when PIN length is 4 digits
  useEffect(() => {
    if (pin.length === 4) {
      if (pin === "1505") {
        const timeout = setTimeout(() => {
          onUnlock();
        }, 150);
        return () => clearTimeout(timeout);
      } else {
        const timeout = setTimeout(() => {
          setErrorMsg("PIN inválido! Digite o código de segurança correto.");
          setPin("");
        }, 250);
        return () => clearTimeout(timeout);
      }
    }
  }, [pin, onUnlock]);

  const handlePinSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg("");
    
    if (pin === "1505") {
      onUnlock();
    } else {
      setErrorMsg("PIN inválido! Digite o código de segurança correto.");
      setPin("");
    }
  };

  const handleKeyPress = (num: string) => {
    setErrorMsg("");
    if (pin.length < 4) {
      setPin(prev => prev + num);
    }
  };

  const clearPin = () => {
    setPin("");
    setErrorMsg("");
  };

  return (
    <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-[#050505] text-[#e0e0e0] font-sans p-6 overflow-hidden">
      {/* Interactive geometric background layout */}
      <div className="absolute inset-0 z-0 overflow-hidden opacity-5">
        <div className="absolute top-10 left-10 w-96 h-96 bg-cyan-500 rounded-full filter blur-[100px]" />
        <div className="absolute bottom-10 right-10 w-96 h-96 bg-blue-600 rounded-full filter blur-[100px]" />
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#111_1px,transparent_1px),linear-gradient(to_bottom,#111_1px,transparent_1px)] bg-[size:4rem_4rem]" />
      </div>

      <div className="relative z-10 w-full max-w-sm bg-[#0d0d0e] rounded-2xl border border-[#1a1a1a] shadow-[0_8px_32px_rgba(0,0,0,0.8)] p-8 flex flex-col items-center">
        {/* EasyFinance Brand Title */}
        <div className="flex items-center gap-2 mb-8">
          <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center shadow-lg">
            <span className="text-black font-black text-xl italic tracking-wider">E</span>
          </div>
          <span className="text-xl font-bold tracking-tight text-white">
            EasyFinance <span className="text-[9px] uppercase font-bold px-2 py-0.5 rounded bg-blue-500/10 text-cyan-400 border border-blue-500/20 ml-1">Secure</span>
          </span>
        </div>

        {/* Dynamic header */}
        <div className="text-center mb-6">
          <div className="w-16 h-16 rounded-full bg-[#050505] flex items-center justify-center mx-auto mb-3 border border-[#1a1a1a]">
            <KeyRound className="w-8 h-8 text-emerald-400" />
          </div>
          <h2 className="text-lg font-semibold tracking-tight text-white">Segurança Requerida</h2>
          <p className="text-xs text-slate-400 mt-1">
            Insira o PIN de 4 dígitos para continuar
          </p>
        </div>

        {/* Display Error Message */}
        {errorMsg && (
          <motion.div 
            initial={{ opacity: 0, y: -10 }} 
            animate={{ opacity: 1, y: 0 }}
            className="w-full mb-4 p-3 rounded-lg bg-rose-500/15 border border-rose-500/30 text-xs text-rose-300 flex items-center gap-2 text-center justify-center"
          >
            <AlertCircle className="w-4 h-4 shrink-0 text-rose-500" />
            <span>{errorMsg}</span>
          </motion.div>
        )}

        {/* PIN pad form */}
        <div className="w-full flex flex-col items-center">
          <form onSubmit={handlePinSubmit} className="w-full">
            {/* Dots Display */}
            <div className="flex justify-center gap-4 mb-8">
              {[0, 1, 2, 3].map((idx) => (
                <div 
                  key={idx}
                  className={`w-3.5 h-3.5 rounded-full border-2 transition-all duration-150 ${pin.length > idx ? "bg-emerald-400 border-emerald-400 scale-110 shadow-[0_0_8px_rgba(52,211,153,0.6)]" : "border-[#222] bg-transparent"}`}
                />
              ))}
            </div>

            {/* Simulated mechanical PIN Pad */}
            <div className="grid grid-cols-3 gap-3 mb-6 max-w-[220px] mx-auto">
              {["1", "2", "3", "4", "5", "6", "7", "8", "9"].map((num) => (
                <button
                  key={num}
                  type="button"
                  onClick={() => handleKeyPress(num)}
                  className="w-12 h-12 rounded-full bg-[#050505] hover:bg-[#111] border border-[#1a1a1a] text-md font-medium text-white flex items-center justify-center active:scale-95 transition-all cursor-pointer"
                >
                  {num}
                </button>
              ))}
              <button
                type="button"
                onClick={clearPin}
                className="w-12 h-12 rounded-full bg-[#050505] text-rose-500 border border-[#1a1a1a] text-[11px] font-medium flex items-center justify-center hover:bg-rose-950/20 cursor-pointer"
              >
                Clear
              </button>
              <button
                type="button"
                onClick={() => handleKeyPress("0")}
                className="w-12 h-12 rounded-full bg-[#050505] hover:bg-[#111] border border-[#1a1a1a] text-md font-medium text-white flex items-center justify-center active:scale-95 transition-all cursor-pointer"
              >
                0
              </button>
              <button
                type="submit"
                className="w-12 h-12 rounded-full bg-cyan-500 text-black font-bold text-xs flex items-center justify-center hover:bg-cyan-400 active:scale-95 transition-all shadow-[0_0_12px_rgba(6,182,212,0.3)] cursor-pointer"
              >
                OK
              </button>
            </div>
          </form>
        </div>

        {/* Alternate login path trigger removed, only simple hint */}
        <div className="w-full border-t border-[#1a1a1a] pt-4 flex justify-center items-center text-xs">
          <span className="text-[10px] text-slate-500 font-mono">
            Dispositivo protegido por senha PIN
          </span>
        </div>
      </div>

      <div className="mt-8 text-[10px] uppercase tracking-widest text-[#555] flex items-center gap-2">
        <ShieldCheck className="w-4 h-4 text-cyan-400" />
        <span>EasyFinance Encriptado (AES-256)</span>
      </div>
    </div>
  );
}
