import React, { useState } from "react";
import { Boleto } from "../types";
import { Receipt, Calendar, Copy, Check, DollarSign, AlertTriangle, Plus, Trash2, BellRing } from "lucide-react";

interface BoletoManagerProps {
  boletos: Boleto[];
  onAddBoleto: (boleto: Omit<Boleto, "id" | "barcode">) => void;
  onPayBoleto: (id: string) => void;
  onDeleteBoleto: (id: string) => void;
  currencySymbol: string;
}

export default function BoletoManager({
  boletos,
  onAddBoleto,
  onPayBoleto,
  onDeleteBoleto,
  currencySymbol
}: BoletoManagerProps) {
  const [showAddForm, setShowAddForm] = useState(false);
  const [title, setTitle] = useState("");
  const [amount, setAmount] = useState("");
  const [dueDate, setDueDate] = useState("");
  const [category, setCategory] = useState("Moradia");
  const [copiedId, setCopiedId] = useState<string | null>(null);

  // Live local status alerts triggers
  const [notificationTestMsg, setNotificationTestMsg] = useState("");
  const [triggerNotificationBanner, setTriggerNotificationBanner] = useState(false);

  // Detect which boletos have pending dues
  const today = new Date();
  
  const getDaysRemaining = (dueDateStr: string) => {
    const due = new Date(dueDateStr);
    const diffTime = due.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  const handleCreateBoleto = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !amount || !dueDate) return;

    onAddBoleto({
      title,
      amount: parseFloat(amount),
      dueDate,
      paid: false,
      category,
      currency: "BRL"
    });

    setTitle("");
    setAmount("");
    setDueDate("");
    setCategory("Moradia");
    setShowAddForm(false);

    // Trigger on-screen simulated push notification
    setNotificationTestMsg(`Boleto adicionado: "${title}" cadastrado com lembrete inteligente p/ o vencimento!`);
    setTriggerNotificationBanner(true);
    setTimeout(() => {
      setTriggerNotificationBanner(false);
    }, 4500);
  };

  const copyBarcodeToClipboard = (id: string, barcode: string) => {
    navigator.clipboard.writeText(barcode);
    setCopiedId(id);
    setTimeout(() => {
      setCopiedId(null);
    }, 1500);
  };

  const payAndTriggerReceipt = (boletoObj: Boleto) => {
    onPayBoleto(boletoObj.id);
    
    // Trigger on-screen simulated receipt push
    setNotificationTestMsg(`Pagamento Processado: O boleto "${boletoObj.title}" foi autenticado via API do banco!`);
    setTriggerNotificationBanner(true);
    setTimeout(() => {
      setTriggerNotificationBanner(false);
    }, 4500);
  };

  return (
    <div className="bg-[#0d0d0e] border border-[#1a1a1a] rounded-2xl p-6 flex flex-col h-full relative uppercase-none">
      {/* Absolute floating micro push notification alert simulator */}
      {triggerNotificationBanner && (
        <div className="absolute top-4 left-4 right-4 z-20 bg-gradient-to-r from-blue-600 to-cyan-600 text-white rounded-lg p-3 shadow-lg border border-cyan-400/20 flex items-start gap-3 animate-in fade-in slide-in-from-top-4 duration-200">
          <BellRing className="w-5 h-5 shrink-0 text-cyan-300 mt-0.5 animate-bounce" />
          <div className="flex-1">
            <span className="text-[10px] uppercase tracking-widest font-black text-cyan-200 block">Notificação Inteligente</span>
            <p className="text-xs font-semibold leading-snug mt-0.5">{notificationTestMsg}</p>
          </div>
          <button onClick={() => setTriggerNotificationBanner(false)} className="text-white/70 hover:text-white text-xs font-bold leading-none">✕</button>
        </div>
      )}

      <div className="flex items-center justify-between mb-4 pb-4 border-b border-[#1a1a1a]">
        <div>
          <h2 className="text-sm font-semibold tracking-wider text-white uppercase flex items-center gap-2">
            <Calendar className="w-4 h-4 text-cyan-400" />
            Agenda de Boletos & Contas
          </h2>
          <p className="text-xs text-slate-500 mt-1">
            Lembretes inteligentes próximos aos dias de vencimento
          </p>
        </div>

        <button
          onClick={() => setShowAddForm(!showAddForm)}
          className="px-3 py-1.5 rounded-lg bg-[#151515] hover:bg-[#202022] text-slate-300 hover:text-white text-xs font-semibold transition-all border border-[#222] cursor-pointer"
        >
          {showAddForm ? "Cancelar" : "Novo Boleto"}
        </button>
      </div>

      {/* Adding Bill Form */}
      {showAddForm && (
        <form onSubmit={handleCreateBoleto} className="bg-[#050505] p-4 rounded-xl border border-[#1a1a1a] mb-4 space-y-3 animate-in slide-in-from-top-2 duration-150">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="text-[10px] text-slate-400 uppercase font-mono block mb-1">Nome do Boleto (Descrição)</label>
              <input
                type="text"
                placeholder="Ex: Fatura Energia, Aluguel, Academia"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
                className="w-full bg-[#0a0a0b] border border-[#1a1a1a] p-2 rounded-lg text-xs leading-none text-slate-100 focus:outline-none focus:border-cyan-500"
              />
            </div>
            <div>
              <label className="text-[10px] text-slate-400 uppercase font-mono block mb-1">Valor do Título</label>
              <div className="relative">
                <span className="absolute left-2.5 top-2 text-xs text-slate-500 font-bold">{currencySymbol}</span>
                <input
                  type="number"
                  step="0.01"
                  placeholder="0.00"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  required
                  className="w-full bg-[#0a0a0b] border border-[#1a1a1a] p-2 pl-8 rounded-lg text-xs text-slate-100 focus:outline-none focus:border-cyan-500"
                />
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="text-[10px] text-slate-400 uppercase font-mono block mb-1">Data de Vencimento</label>
              <input
                type="date"
                value={dueDate}
                onChange={(e) => setDueDate(e.target.value)}
                required
                className="w-full bg-[#0a0a0b] border border-[#1a1a1a] p-2 rounded-lg text-xs text-slate-100 focus:outline-none focus:border-cyan-500"
              />
            </div>
            <div>
              <label className="text-[10px] text-slate-400 uppercase font-mono block mb-1">Categoria</label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full bg-[#0a0a0b] border border-[#1a1a1a] p-2 rounded-lg text-xs text-slate-100 focus:outline-none focus:border-cyan-500 h-[34px]"
              >
                <option value="Serviços">Serviços / Utilidades</option>
                <option value="Moradia">Moradia / Aluguel</option>
                <option value="Saúde">Saúde</option>
                <option value="Transporte">Transporte / Carro</option>
                <option value="Assinaturas">Assinaturas / Lazer</option>
                <option value="Outros">Outros</option>
              </select>
            </div>
          </div>

          <button
            type="submit"
            className="w-full py-2 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-black font-semibold rounded-lg text-xs transition-all shadow-md shadow-cyan-500/10"
          >
            Adicionar Boleto na Agenda
          </button>
        </form>
      )}

      {/* Boletos List Workspace */}
      <div className="flex-1 space-y-3 overflow-y-auto max-h-[300px] pr-1">
        {boletos.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-10 text-center bg-[#050505] rounded-xl border border-dashed border-[#1a1a1a]">
            <Receipt className="w-8 h-8 text-[#333] mb-2" />
            <p className="text-xs font-semibold text-slate-400">Nenhum boleto cadastrado</p>
            <p className="text-[11px] text-[#555] mt-0.5">Clique em "Novo Boleto" para incluir prazos.</p>
          </div>
        ) : (
          [...boletos]
            .sort((a, b) => new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime())
            .map((b) => {
              const daysLeft = getDaysRemaining(b.dueDate);
              const isUrgent = daysLeft >= 0 && daysLeft <= 3 && !b.paid;
              const isOverdue = daysLeft < 0 && !b.paid;

              return (
                <div 
                  key={b.id} 
                  className={`p-4 rounded-xl border transition-all ${
                    b.paid 
                      ? "bg-[#050505]/40 border-[#1a1a1a] opacity-65" 
                      : isOverdue
                        ? "bg-rose-950/10 border-rose-900/30"
                        : isUrgent
                          ? "bg-amber-950/10 border-amber-900/30 animate-pulse"
                          : "bg-[#050505] border-[#1a1a1a]"
                  }`}
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5">
                    {/* Upper descriptor */}
                    <div className="flex items-start gap-3">
                      <div className={`w-8 h-8 rounded-lg flex items-center justify-center mt-1 shrink-0 ${
                        b.paid 
                          ? "bg-[#151515] text-slate-500" 
                          : isOverdue 
                            ? "bg-rose-500/10 text-rose-400" 
                            : isUrgent 
                              ? "bg-amber-500/10 text-amber-500" 
                              : "bg-cyan-500/10 text-cyan-400"
                      }`}>
                        <Receipt className="w-4 h-4" />
                      </div>

                      <div>
                        <div className="flex items-center gap-1.5 flex-wrap">
                          <span className="font-semibold text-xs tracking-wider text-white uppercase">{b.title}</span>
                          <span className="text-[9px] uppercase font-mono px-1.5 py-0.5 rounded bg-[#0a0a0b] text-slate-450 border border-[#1a1a1a]">
                            {b.category}
                          </span>
                        </div>

                        {/* Warnings indicators */}
                        <div className="flex items-center gap-2 mt-1">
                          <span className="text-[10px] text-slate-500 font-mono flex items-center gap-1">
                            <Calendar className="w-3.5 h-3.5 text-cyan-500" />
                            Vence em {new Date(b.dueDate).toLocaleDateString("pt-BR")}
                          </span>
                          
                          {!b.paid && (
                            isOverdue ? (
                              <span className="text-[9px] font-bold text-rose-450 flex items-center gap-1 bg-rose-950/20 px-1.5 py-0.5 rounded border border-rose-900/20">
                                <AlertTriangle className="w-3 h-3 animate-bounce" /> ATRASAD ({Math.abs(daysLeft)} dias)
                              </span>
                            ) : isUrgent ? (
                              <span className="text-[9px] font-bold text-amber-500 flex items-center gap-1 bg-amber-950/20 px-1.5 py-0.5 rounded border border-[#222]">
                                <AlertTriangle className="w-3 h-3" /> VENCE EM {daysLeft === 0 ? "HOJE" : `${daysLeft} DIAS`}
                              </span>
                            ) : (
                              <span className="text-[10px] text-cyan-500 font-mono">
                                ({daysLeft} dias restantes)
                              </span>
                            )
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Numeric pricing & Pay triggers */}
                    <div className="flex items-center justify-between sm:justify-end gap-3 pt-3 sm:pt-0 border-t sm:border-t-0 border-[#1a1a1a]">
                      <div className="text-left sm:text-right">
                        <span className="font-mono text-xs font-semibold text-white">
                          {currencySymbol} {b.amount.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}
                        </span>
                      </div>

                      <div className="flex gap-1.5">
                        {b.paid ? (
                          <span className="px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wider text-emerald-400 bg-emerald-500/10 rounded-lg border border-emerald-500/20 flex items-center gap-1">
                            <Check className="w-3 h-3" /> Pago
                          </span>
                        ) : (
                          <button
                            onClick={() => payAndTriggerReceipt(b)}
                            className="px-3 py-1 bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-400 hover:to-teal-500 text-black text-[11px] font-semibold rounded-lg transition-all shadow shadow-emerald-500/10 cursor-pointer"
                          >
                            Pagar
                          </button>
                        )}
                        <button
                          onClick={() => onDeleteBoleto(b.id)}
                          className="p-1 px-2 border border-[#1a1a1a] hover:border-rose-500/30 text-slate-500 hover:text-rose-400 rounded-lg transition-all"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Copy barcode digit lines drawer bar */}
                  {!b.paid && (
                    <div className="mt-3 pt-2.5 border-t border-[#1a1a1a] flex items-center justify-between text-[10px] font-mono bg-[#0c0c0e] p-2 rounded-lg">
                      <span className="text-slate-500 uppercase overflow-hidden text-ellipsis whitespace-nowrap pr-2">
                        Código de Barras: {b.barcode.substring(0, 18)}...
                      </span>
                      <button
                        onClick={() => copyBarcodeToClipboard(b.id, b.barcode)}
                        className="text-cyan-400 hover:text-cyan-300 flex items-center gap-1 font-bold shrink-0 transition-opacity"
                      >
                        {copiedId === b.id ? (
                          <>
                            <Check className="w-3 h-3 text-emerald-400 animate-pulse" /> Copiado!
                          </>
                        ) : (
                          <>
                            <Copy className="w-3 h-3" /> Copiar Código
                          </>
                        )}
                      </button>
                    </div>
                  )}
                </div>
              );
            })
        )}
      </div>
    </div>
  );
}
