import React, { useState } from "react";
import { BackupLog } from "../types";
import { Cloud, CloudLightning, HardDrive, RefreshCw, Layers, CheckCircle, Wifi, WifiOff, FileDown, Plus } from "lucide-react";

interface OfflineCloudSyncBarProps {
  backupLogs: BackupLog[];
  onTriggerBackup: (provider: any) => void;
  cloudSyncEnabled: boolean;
  onToggleCloudSync: () => void;
  lastBackupDate?: string;
}

export default function OfflineCloudSyncBar({
  backupLogs,
  onTriggerBackup,
  cloudSyncEnabled,
  onToggleCloudSync,
  lastBackupDate
}: OfflineCloudSyncBarProps) {
  const [offlineMock, setOfflineMock] = useState<boolean>(false);
  const [syncingNow, setSyncingNow] = useState<boolean>(false);
  const [activeTab, setActiveTab] = useState<"status" | "logs">("status");

  const [driveConnected, setDriveConnected] = useState(false);
  const [dropboxConnected, setDropboxConnected] = useState(false);

  const startManualSyncAction = () => {
    if (offlineMock) return;
    setSyncingNow(true);
    setTimeout(() => {
      setSyncingNow(false);
    }, 1200);
  };

  const handleConnectAuthSim = (provider: "Drive" | "Dropbox") => {
    if (provider === "Drive") {
      setDriveConnected(!driveConnected);
      if (!driveConnected) onTriggerBackup("Google Drive");
    } else {
      setDropboxConnected(!dropboxConnected);
      if (!dropboxConnected) onTriggerBackup("Dropbox");
    }
  };

  return (
    <div className="bg-[#0d0d0e] border border-[#1a1a1a] rounded-2xl p-6 flex flex-col h-full uppercase-none">
      <div className="flex items-center justify-between mb-4 pb-4 border-b border-[#1a1a1a]">
        <div>
          <h2 className="text-sm font-semibold tracking-wider text-white uppercase flex items-center gap-2">
            <Cloud className="w-4 h-4 text-cyan-400" />
            Nuvem & Suporte Offline
          </h2>
          <p className="text-xs text-slate-500 mt-1">
            Sincronização em tempo real e cópias de segurança criptografadas
          </p>
        </div>

        <div className="flex gap-1 bg-[#050505] p-1 rounded-lg border border-[#1a1a1a] text-xs">
          <button
            onClick={() => setActiveTab("status")}
            className={`px-3 py-1.5 rounded-md font-semibold ${activeTab === "status" ? "bg-white/10 text-cyan-400" : "text-slate-400"}`}
          >
            Sincronizador
          </button>
          <button
            onClick={() => setActiveTab("logs")}
            className={`px-3 py-1.5 rounded-md font-semibold ${activeTab === "logs" ? "bg-white/10 text-violet-400" : "text-slate-400"}`}
          >
            Logs de Backup
          </button>
        </div>
      </div>

      {activeTab === "status" ? (
        <div className="space-y-4 flex-1">
          {/* Real network status simulator */}
          <div className="p-3.5 rounded-xl bg-[#050505] border border-[#1a1a1a] flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <div className={`w-9 h-9 rounded-full flex items-center justify-center shrink-0 ${offlineMock ? "bg-red-500/10 text-red-400" : "bg-cyan-500/10 text-cyan-400 animate-pulse"}`}>
                {offlineMock ? <WifiOff className="w-5 h-5" /> : <Wifi className="w-5 h-5" />}
              </div>
              <div>
                <span className="text-xs font-bold text-slate-200 uppercase block">Modo de Operação</span>
                <span className="text-[11px] text-slate-400 font-sans leading-relaxed">
                  {offlineMock 
                    ? "Offline • Seus dados estão salvos de forma resiliente em LocalStorage" 
                    : "Conectado • Replicação viva via EasyFinance Cloud Ativa"}
                </span>
              </div>
            </div>

            <button
               onClick={() => setOfflineMock(!offlineMock)}
               className={`px-3 py-1.5 rounded-lg border text-xs font-bold transition-all cursor-pointer select-none ${
                 offlineMock 
                   ? "bg-emerald-500/10 border-emerald-500/30 text-emerald-400 hover:bg-emerald-500/20" 
                   : "bg-red-500/10 border-red-500/30 text-red-400 hover:bg-red-500/20"
               }`}
             >
               Simular {offlineMock ? "Volta Online" : "Queda Offline"}
             </button>
          </div>

          {/* Sync switches & controls */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pb-2.5">
            <div className={`p-4 rounded-xl bg-[#050505] border ${cloudSyncEnabled ? "border-cyan-500/20" : "border-[#1a1a1a]"} flex items-center justify-between`}>
              <div>
                <span className="text-xs font-bold text-slate-200 uppercase block">Cloud Realtime Sync</span>
                <span className="text-[10px] text-slate-350 mt-1 block">Entre pc e mobile ativado</span>
              </div>
              <label className="relative inline-flex items-center cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={cloudSyncEnabled}
                  onChange={onToggleCloudSync}
                  className="sr-only peer"
                />
                <div className="w-9 h-5 bg-[#121214] border border-[#222] rounded-full peer peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-slate-300 peer-checked:after:bg-cyan-400 after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-cyan-950/40" />
              </label>
            </div>

            <button
              disabled={offlineMock || syncingNow}
              onClick={startManualSyncAction}
              className="p-4 rounded-xl bg-[#050505] hover:bg-[#121214] border border-[#1a1a1a] hover:border-violet-500 text-left transition-all flex items-center justify-between group disabled:opacity-40 cursor-pointer"
            >
              <div>
                <span className="text-xs font-bold text-slate-200 uppercase block">Forçar Replicação</span>
                <span className="text-[10px] text-[#555]">Sincronizar caches agora</span>
              </div>
              <RefreshCw className={`w-5 h-5 text-violet-400 group-hover:rotate-180 transition-all ${syncingNow ? "animate-spin text-cyan-400" : ""}`} />
            </button>
          </div>

          {/* Drive & Dropbox Integration Links */}
          <div className="space-y-2">
            <span className="text-[10px] uppercase font-mono font-bold text-[#555] tracking-wider block">Serviços Externos de Backup:</span>
            
            <div className="flex flex-col sm:flex-row gap-2">
              {/* Google Drive */}
              <div className="flex-1 p-3 rounded-lg bg-[#050505] border border-[#1a1a1a] flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-semibold text-slate-300">Google Drive</span>
                </div>
                <button
                  onClick={() => handleConnectAuthSim("Drive")}
                  className={`px-2.5 py-1 rounded text-[11px] font-bold transition-all ${
                    driveConnected 
                      ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20" 
                      : "bg-[#151515] hover:bg-[#202022] text-slate-400 hover:text-white border border-[#222]"
                  }`}
                >
                  {driveConnected ? "● Integrado" : "Vincular"}
                </button>
              </div>

              {/* Dropbox */}
              <div className="flex-1 p-3 rounded-lg bg-[#050505] border border-[#1a1a1a] flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-semibold text-slate-300">Dropbox</span>
                </div>
                <button
                  onClick={() => handleConnectAuthSim("Dropbox")}
                  className={`px-2.5 py-1 rounded text-[11px] font-bold transition-all ${
                    dropboxConnected 
                      ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20" 
                      : "bg-[#151515] hover:bg-[#202022] text-slate-400 hover:text-white border border-[#222]"
                  }`}
                >
                  {dropboxConnected ? "● Integrado" : "Vincular"}
                </button>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="space-y-3 flex-1 overflow-y-auto max-h-[300px] pr-1">
          {backupLogs.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-10 text-center bg-[#050505] rounded-xl border border-dashed border-[#1a1a1a]">
              <HardDrive className="w-8 h-8 text-slate-650 mb-2" />
              <p className="text-xs text-slate-400">Nenhum log de backup registrado.</p>
            </div>
          ) : (
            [...backupLogs].reverse().map((log) => (
              <div key={log.id} className="p-3 rounded-xl bg-[#050505] border border-[#1a1a1a] flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <div className={`w-2 h-2 rounded-full ${
                    log.status === "success" ? "bg-emerald-400" : log.status === "warning" ? "bg-amber-400" : "bg-red-400"
                  }`} />
                  <div>
                    <span className="text-xs font-bold text-slate-200 block uppercase">{log.provider}</span>
                    <span className="text-[10px] text-slate-400">Gravado {new Date(log.date).toLocaleString("pt-BR")}</span>
                  </div>
                </div>

                <div className="text-right">
                  <span className="text-[10px] text-slate-400 font-mono tracking-wide">{log.sizeStr}</span>
                </div>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
}
