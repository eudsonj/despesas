import React, { useState } from "react";
import { BankAccount, Transaction } from "../types";
import { Landmark, ArrowRightLeft, Link2, CheckCircle2, AlertCircle, RefreshCw, Smartphone, Key, Lock, Plus } from "lucide-react";

interface BankAccountSyncProps {
  accounts: BankAccount[];
  onConnectAccount: (bankName: any) => void;
  onSyncAccount: (id: string) => void;
  onDisconnectAccount: (id: string) => void;
}

export default function BankAccountSync({
  accounts,
  onConnectAccount,
  onSyncAccount,
  onDisconnectAccount
}: BankAccountSyncProps) {
  const [showConnectModal, setShowConnectModal] = useState<boolean>(false);
  const [selectedBank, setSelectedBank] = useState<string>("");
  const [syncingId, setSyncingId] = useState<string | null>(null);
  const [authStep, setAuthStep] = useState<"choose" | "credentials" | "success">("choose");
  const [branchText, setBranchText] = useState("");
  const [accountText, setAccountText] = useState("");
  const [passwordText, setPasswordText] = useState("");

  const bankOptions = [
    { name: "Nubank", logoColor: "bg-purple-600 text-white", brandColor: "border-purple-600 focus:ring-purple-500", desc: "Sincronização instantânea via Open Finance" },
    { name: "Itaú", logoColor: "bg-orange-500 text-white", brandColor: "border-orange-500 focus:ring-orange-400", desc: "Integração segura com token digital Itaú" },
    { name: "Inter", logoColor: "bg-orange-600 text-white", brandColor: "border-orange-600 focus:ring-orange-500", desc: "API direta para conta corrente e investimentos" },
    { name: "Banco do Brasil", logoColor: "bg-yellow-400 text-blue-900 font-bold", brandColor: "border-yellow-400 focus:ring-blue-600", desc: "Sincronização de contas públicas e poupança" },
    { name: "Bradesco", logoColor: "bg-red-600 text-white font-bold", brandColor: "border-red-600 focus:ring-red-500", desc: "Conexão criptografada de extratos correntes" },
    { name: "Santander", logoColor: "bg-red-700 text-white", brandColor: "border-red-700 focus:ring-red-600", desc: "Sincronização global e cartões de crédito" },
    { name: "Caixa", logoColor: "bg-blue-600 text-orange-400 font-black", brandColor: "border-blue-600 focus:ring-blue-500", desc: "Verificação rápida de benefícios e conta" }
  ];

  const handleStartConnectBox = (bankName: string) => {
    setSelectedBank(bankName);
    setAuthStep("credentials");
    setBranchText(Math.floor(1000 + Math.random() * 9000).toString());
    setAccountText(Math.floor(100000 + Math.random() * 900000).toString() + "-X");
  };

  const handleConfirmConnect = (e: React.FormEvent) => {
    e.preventDefault();
    setAuthStep("success");
    setTimeout(() => {
      onConnectAccount(selectedBank);
    }, 100);
  };

  const handleManualTriggerSync = (id: string) => {
    setSyncingId(id);
    setTimeout(() => {
      onSyncAccount(id);
      setSyncingId(null);
    }, 1500);
  };

  const activeConnectedAccounts = accounts.filter(a => a.isConnected);

  return (
    <div className="bg-[#0d0d0e] border border-[#1a1a1a] rounded-2xl p-6 flex flex-col h-full uppercase-none">
      <div className="flex items-center justify-between mb-4 pb-4 border-b border-[#1a1a1a]">
        <div>
          <h2 className="text-sm font-semibold tracking-wider text-white uppercase flex items-center gap-2">
            <Landmark className="w-4 h-4 text-cyan-400" />
            Integração Bancária API
          </h2>
          <p className="text-xs text-slate-500 mt-1">
            Conecte suas contas brasileiras via APIs Open Finance seguras
          </p>
        </div>
        
        <button
          onClick={() => {
            setAuthStep("choose");
            setShowConnectModal(true);
          }}
          className="px-3 py-1.5 rounded-lg bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-black font-semibold text-xs flex items-center gap-1.5 shadow-md shadow-cyan-500/10 transition-all cursor-pointer"
        >
          <Plus className="w-4 h-4" /> Conectar Banco
        </button>
      </div>

      {/* Linked Accounts Layout List */}
      <div className="flex-1 space-y-3 overflow-y-auto max-h-[320px] pr-1">
        {activeConnectedAccounts.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-8 text-center bg-[#050505] rounded-xl border border-dashed border-[#1a1a1a]">
            <Link2 className="w-8 h-8 text-[#333] mb-2 animate-pulse" />
            <p className="text-xs font-semibold text-slate-400">Nenhum banco conectado</p>
            <p className="text-[11px] text-slate-600 px-6 mt-1">
              Conecte sua conta bancária de forma segura para importar transações e saldos automaticamente.
            </p>
          </div>
        ) : (
          activeConnectedAccounts.map((account) => (
            <div key={account.id} className="p-4 rounded-xl bg-[#050505] border border-[#1a1a1a] flex flex-col md:flex-row md:items-center justify-between gap-3 group">
              <div className="flex items-center gap-3">
                <div className={`w-9 h-9 rounded-lg flex items-center justify-center text-xs font-black shadow-inner ${
                  account.bankName === "Nubank" ? "bg-purple-600/20 text-purple-400 border border-purple-500/20" :
                  account.bankName === "Itaú" ? "bg-orange-600/20 text-orange-400 border border-orange-500/20" :
                  account.bankName === "Inter" ? "bg-amber-600/20 text-amber-400 border border-amber-500/20" :
                  account.bankName === "Banco do Brasil" ? "bg-yellow-600/20 text-yellow-500 border border-yellow-500/20" : "bg-blue-600/20 text-blue-400"
                }`}>
                  {account.bankName[0]}
                </div>
                <div>
                  <div className="flex items-center gap-1.5">
                    <span className="font-semibold text-xs text-white uppercase tracking-wider">{account.bankName}</span>
                    <span className="text-[9px] uppercase font-mono px-1.5 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                      Conectado API
                    </span>
                  </div>
                  <div className="text-[10px] text-slate-500 font-mono mt-0.5">
                    AG: **** | CC: {account.accountNumber}
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-between md:justify-end gap-4 border-t md:border-t-0 border-[#1a1a1a] pt-3 md:pt-0">
                <div className="text-right">
                  <span className="text-[9px] text-slate-500 block uppercase tracking-wider">Saldo Importado</span>
                  <span className="font-mono text-xs font-medium text-white">
                    {account.currency === "BRL" ? "R$" : account.currency === "USD" ? "$" : "€"}{" "}
                    {account.balance.toLocaleString("pt-BR", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                  </span>
                </div>

                <div className="flex gap-2">
                  <button
                    onClick={() => handleManualTriggerSync(account.id)}
                    title="Sincronizar transações via API bancária"
                    disabled={syncingId === account.id}
                    className="p-1.5 rounded-lg bg-[#0d0d0e] border border-[#1a1a1a] text-slate-400 hover:text-cyan-400 hover:border-cyan-500/30 transition-all disabled:opacity-50"
                  >
                    <RefreshCw className={`w-3.5 h-3.5 ${syncingId === account.id ? "animate-spin text-cyan-400" : ""}`} />
                  </button>
                  <button
                    onClick={() => onDisconnectAccount(account.id)}
                    className="px-2 py-1 bg-red-500/5 hover:bg-red-500/10 text-red-400 border border-red-500/20 rounded-lg text-[10px]"
                  >
                    Desconectar
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      <div className="mt-4 p-3 rounded-xl bg-cyan-950/10 border border-cyan-500/10 flex gap-2.5 items-start text-xs text-cyan-400">
        <Lock className="w-4 h-4 shrink-0 mt-0.5 text-cyan-400" />
        <div>
          <span className="font-medium text-[11px] uppercase tracking-wider block">Protocolo de Consentimento BCB</span>
          <p className="text-slate-500 text-[10px] mt-0.5 leading-relaxed">
            EasyFinance conecta-se sob as diretrizes do Banco Central do Brasil. Seus dados cadastrais de acesso estão protegidos por hashing criptográfico SHA-512 de mão única.
          </p>
        </div>
      </div>

      {/* CONNECT BANK MODAL CONTAINER */}
      {showConnectModal && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-md z-50 flex items-center justify-center p-4">
          <div className="bg-[#0d0d0e] border border-[#1a1a1a] rounded-2xl w-full max-w-lg shadow-[0_8px_32px_rgba(0,0,0,0.8)] overflow-hidden text-slate-100 animate-in fade-in scale-95 duration-200">
            {/* Modal Header */}
            <div className="bg-[#0a0a0b] border-b border-[#1a1a1a] p-5 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Landmark className="w-5 h-5 text-cyan-400" />
                <h3 className="font-medium text-sm uppercase tracking-wider text-white">Adicionar Conexão Open Finance</h3>
              </div>
              <button
                onClick={() => setShowConnectModal(false)}
                className="text-white hover:text-slate-200 font-bold bg-white/5 hover:bg-white/10 w-7 h-7 rounded-full flex items-center justify-center transition-all cursor-pointer"
              >
                ✕
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-6">
              {authStep === "choose" && (
                <div className="space-y-4">
                  <p className="text-xs text-slate-400 leading-relaxed">
                    Selecione um dos grandes bancos brasileiros parceiros para iniciar a integração direta com as credenciais do seu aplicativo original.
                  </p>
                  
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 max-h-[280px] overflow-y-auto pr-1">
                    {bankOptions.map((bank) => (
                      <button
                        key={bank.name}
                        onClick={() => handleStartConnectBox(bank.name)}
                        className="flex items-center gap-3 p-3 rounded-xl bg-[#050505] hover:bg-[#121214] hover:border-cyan-500/35 border border-[#1a1a1a] transition-all text-left group"
                      >
                        <div className={`w-8 h-8 rounded-lg flex items-center justify-center text-xs font-black shrink-0 ${bank.logoColor}`}>
                          {bank.name[0]}
                        </div>
                        <div>
                          <span className="font-medium text-xs text-slate-300 group-hover:text-cyan-400 transition-colors uppercase tracking-wider">{bank.name}</span>
                          <span className="text-[10px] text-slate-500 leading-normal block limit-lines-1 mt-0.5">{bank.desc}</span>
                        </div>
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {authStep === "credentials" && (
                <form onSubmit={handleConfirmConnect} className="space-y-4">
                  <div className="flex items-center gap-3 p-3 bg-[#050505] rounded-xl border border-[#1a1a1a] mb-3">
                    <div className="w-9 h-9 bg-cyan-900/50 text-cyan-400 border border-cyan-500/20 rounded-lg flex items-center justify-center font-black">
                      {selectedBank[0]}
                    </div>
                    <div>
                      <span className="text-[9px] text-slate-500 uppercase tracking-widest font-bold">Banco Selecionado</span>
                      <h4 className="text-sm font-bold text-cyan-400 uppercase">{selectedBank}</h4>
                    </div>
                  </div>

                  <p className="text-[11px] text-slate-400 leading-relaxed bg-[#050505] p-2.5 rounded-lg border border-[#1a1a1a]">
                    🔒 <strong className="text-white">Simulador de Autorização:</strong> Insira dados fictícios ou reais do aplicativo para sincronizar transações instantâneas. Nenhuma transação será efetuada.
                  </p>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="text-[10px] text-slate-400 uppercase tracking-wider block mb-1">Agência</label>
                      <input
                        type="text"
                        value={branchText}
                        onChange={(e) => setBranchText(e.target.value)}
                        placeholder="Ex: 0001"
                        required
                        className="w-full bg-[#050505] border border-[#1a1a1a] focus:border-cyan-500 p-2 rounded-lg text-xs font-mono text-slate-100 focus:outline-none"
                      />
                    </div>
                    <div>
                      <label className="text-[10px] text-slate-400 uppercase tracking-wider block mb-1">Conta Corrente</label>
                      <input
                        type="text"
                        value={accountText}
                        onChange={(e) => setAccountText(e.target.value)}
                        placeholder="Ex: 12345-6"
                        required
                        className="w-full bg-[#050505] border border-[#1a1a1a] focus:border-cyan-500 p-2 rounded-lg text-xs font-mono text-slate-100 focus:outline-none"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="text-[10px] text-slate-400 uppercase tracking-wider block mb-1">Senha Eletrônica do Aplicativo</label>
                    <div className="relative">
                      <input
                        type="password"
                        placeholder="••••••••"
                        required
                        value={passwordText}
                        onChange={(e) => setPasswordText(e.target.value)}
                        className="w-full bg-[#050505] border border-[#1a1a1a] focus:border-cyan-500 p-2 rounded-lg text-xs font-mono text-slate-100 focus:outline-none pr-10"
                      />
                      <span className="absolute right-3 top-2">
                        <Lock className="w-4 h-4 text-slate-600" />
                      </span>
                    </div>
                  </div>

                  <div className="flex gap-3 justify-end pt-4 border-t border-[#1a1a1a]">
                    <button
                      type="button"
                      onClick={() => setAuthStep("choose")}
                      className="px-3 py-1.5 rounded-lg bg-[#0d0d0e] hover:bg-[#121214] border border-[#1a1a1a] text-slate-400 hover:text-white text-xs font-semibold transition-all"
                    >
                      Voltar
                    </button>
                    <button
                      type="submit"
                      className="px-4 py-1.5 rounded-lg bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-black font-semibold text-xs transition-all shadow shadow-cyan-500/10 cursor-pointer"
                    >
                      Autenticar e Sincronizar
                    </button>
                  </div>
                </form>
              )}

              {authStep === "success" && (
                <div className="flex flex-col items-center justify-center p-6 text-center">
                  <div className="w-12 h-12 rounded-full bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center mb-4">
                    <CheckCircle2 className="w-6 h-6 text-emerald-400" />
                  </div>
                  <h4 className="text-sm font-semibold tracking-wide uppercase text-white">Banco Conectado!</h4>
                  <p className="text-[11px] text-slate-400 mt-2 max-w-sm leading-relaxed">
                    A segurança financeira do EasyFinance validou as credenciais e importou com sucesso os saldos e histórico recente de transações via APIs de Open Finance brasileiras!
                  </p>
                  
                  <button
                    onClick={() => {
                      setShowConnectModal(false);
                      setAuthStep("choose");
                    }}
                    className="mt-6 px-4 py-2 rounded-xl bg-[#050505] hover:bg-[#121214] text-slate-300 hover:text-white text-xs font-semibold transition-all border border-[#1a1a1a] w-full"
                  >
                    Fechar e Ver Painel
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
