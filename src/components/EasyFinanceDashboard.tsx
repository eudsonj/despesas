import React, { useState, useEffect } from "react";
import { 
  Transaction, 
  Boleto, 
  BankAccount, 
  BackupLog, 
  UserProfile, 
  ExchangeRate 
} from "../types";

import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  Tooltip, 
  ResponsiveContainer, 
  PieChart, 
  Pie, 
  Cell,
  Legend
} from "recharts";

import { 
  Wallet, 
  TrendingUp, 
  TrendingDown, 
  DollarSign, 
  Plus, 
  Smartphone, 
  Laptop, 
  Sun, 
  Moon, 
  LogOut, 
  Check, 
  PlusCircle, 
  Calendar, 
  Trash2, 
  AlertCircle, 
  Sparkles,
  RefreshCw,
  Clock,
  Unlock,
  Building
} from "lucide-react";

import BiometricLock from "./BiometricLock";
import BankAccountSync from "./BankAccountSync";
import BoletoManager from "./BoletoManager";
import EasyFinanceAIGenius from "./EasyFinanceAIGenius";
import ReportExporter from "./ReportExporter";
import OfflineCloudSyncBar from "./OfflineCloudSyncBar";

export default function EasyFinanceDashboard() {
  // Global App States with localStorage persistency
  const [transactions, setTransactions] = useState<Transaction[]>(() => {
    const saved = localStorage.getItem("easyfinance_transactions") || localStorage.getItem("balanzy_transactions");
    if (saved) return JSON.parse(saved);
    return [
      { id: "1", type: "income", category: "Serviços", amount: 4800, currency: "BRL", description: "Desenvolvimento Frontend", date: "2026-06-03" },
      { id: "2", type: "expense", category: "Alimentação", amount: 65.5, currency: "BRL", description: "Supermercado Pão de Açúcar", date: "2026-06-10" },
      { id: "3", type: "expense", category: "Transporte", amount: 45, currency: "USD", description: "Viagem Uber EUA", date: "2026-06-12" }, // in USD!
      { id: "4", type: "income", category: "Serviços", amount: 350, currency: "EUR", description: "Consultoria Internacional Alemanha", date: "2026-06-14" }, // in EUR!
      { id: "5", type: "expense", category: "Lazer", amount: 120, currency: "BRL", description: "Cinema e restaurante", date: "2026-06-15" }
    ];
  });

  const [boletos, setBoletos] = useState<Boleto[]>(() => {
    const saved = localStorage.getItem("easyfinance_boletos") || localStorage.getItem("balanzy_boletos");
    if (saved) return JSON.parse(saved);
    return [
      { id: "b1", title: "Condomínio Edifício", amount: 450, currency: "BRL", dueDate: "2026-06-20", paid: false, category: "Moradia", barcode: "34191.79001 01043.513184 91020.150008 7 97540000045000" },
      { id: "b2", title: "Internet Fibra Vivo", amount: 129.9, currency: "BRL", dueDate: "2026-06-25", paid: false, category: "Serviços", barcode: "03399.79001 01043.513184 91020.150008 7 97540000012990" },
      { id: "b3", title: "Seguro de Saúde", amount: 380, currency: "BRL", dueDate: "2026-06-15", paid: true, category: "Saúde", barcode: "00191.79001 01043.513184 91020.150008 7 97540000038000" }
    ];
  });

  const [bankAccounts, setBankAccounts] = useState<BankAccount[]>(() => {
    const saved = localStorage.getItem("easyfinance_banks") || localStorage.getItem("balanzy_banks");
    if (saved) return JSON.parse(saved);
    return [
      { id: "acc-1", bankName: "Nubank", balance: 1450.5, currency: "BRL", isConnected: true, accountNumber: "835251-2", color: "purple" },
      { id: "acc-2", bankName: "Itaú", balance: 5200, currency: "BRL", isConnected: false, accountNumber: "20451-9", color: "orange" },
      { id: "acc-3", bankName: "Inter", balance: 350, currency: "USD", isConnected: false, accountNumber: "91025-0", color: "orange" }
    ];
  });

  const [backupLogs, setBackupLogs] = useState<BackupLog[]>(() => {
    const saved = localStorage.getItem("easyfinance_backups") || localStorage.getItem("balanzy_backups");
    if (saved) return JSON.parse(saved);
    return [
      { id: "l1", provider: "EasyFinance Secure Cloud", date: "2026-06-16T10:30:00Z", sizeStr: "12 KB", status: "success" }
    ];
  });

  const [userProfile, setUserProfile] = useState<UserProfile>(() => {
    return {
      name: "Eudson Felipe",
      email: "eudsonfelipe598@gmail.com",
      defaultCurrency: "BRL",
      isBiometricsActive: true,
      isUnlocked: false, // Locked on startup for safety!
      cloudSyncEnabled: true,
      budgetMonthlyLimit: 3000
    };
  });

  // Layout View Preferences
  const [deviceLayout, setDeviceLayout] = useState<"desktop" | "mobile">("desktop");
  const [isDarkMode, setIsDarkMode] = useState<boolean>(true);

  // Math Currency Rates Configuration
  const exchangeRates: Record<"BRL" | "USD" | "EUR" | "GBP", ExchangeRate> = {
    BRL: { code: "BRL", symbol: "R$", name: "Real Brasileiro", rateToBRL: 1 },
    USD: { code: "USD", symbol: "$", name: "Dólar Comercial", rateToBRL: 5.42 },
    EUR: { code: "EUR", symbol: "€", name: "Euro", rateToBRL: 5.85 },
    GBP: { code: "GBP", symbol: "£", name: "Libra Esterlina", rateToBRL: 6.90 }
  };

  const [selectedDisplayCurrency, setSelectedDisplayCurrency] = useState<"BRL" | "USD" | "EUR" | "GBP">("BRL");

  // Input states for main inline transaction addition form
  const [newDesc, setNewDesc] = useState("");
  const [newType, setNewType] = useState<"income" | "expense">("expense");
  const [newCategory, setNewCategory] = useState("Alimentação");
  const [newVal, setNewVal] = useState("");
  const [newCurr, setNewCurr] = useState<"BRL" | "USD" | "EUR" | "GBP">("BRL");
  const [newBank, setNewBank] = useState("Local");

  // Save changes automatically on change
  useEffect(() => {
    localStorage.setItem("easyfinance_transactions", JSON.stringify(transactions));
  }, [transactions]);

  useEffect(() => {
    localStorage.setItem("easyfinance_boletos", JSON.stringify(boletos));
  }, [boletos]);

  useEffect(() => {
    localStorage.setItem("easyfinance_banks", JSON.stringify(bankAccounts));
  }, [bankAccounts]);

  useEffect(() => {
    localStorage.setItem("easyfinance_backups", JSON.stringify(backupLogs));
  }, [backupLogs]);

  // Conversions helper calculations
  const convertAmountToSelectedCurrency = (amount: number, from: "BRL" | "USD" | "EUR" | "GBP", to: "BRL" | "USD" | "EUR" | "GBP") => {
    if (from === to) return amount;
    // Map to base Real (BRL) first
    const inBrl = amount * exchangeRates[from].rateToBRL;
    // Convert out to target
    return inBrl / exchangeRates[to].rateToBRL;
  };

  // Aggregated totals
  const totalIncome = transactions
    .filter(t => t.type === "income")
    .reduce((sum, t) => sum + convertAmountToSelectedCurrency(t.amount, t.currency, selectedDisplayCurrency), 0);

  const totalExpense = transactions
    .filter(t => t.type === "expense")
    .reduce((sum, t) => sum + convertAmountToSelectedCurrency(t.amount, t.currency, selectedDisplayCurrency), 0);

  const netBalance = totalIncome - totalExpense;

  // Add customized Transaction
  const handleAddTransaction = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newDesc.trim() || !newVal) return;

    const t: Transaction = {
      id: Math.random().toString(),
      type: newType,
      category: newCategory,
      amount: parseFloat(newVal),
      currency: newCurr,
      description: newDesc,
      date: new Date().toISOString().split("T")[0],
      bankAccount: newBank !== "Local" ? newBank : undefined
    };

    setTransactions(prev => [t, ...prev]);

    // Update connected bank balance dynamically if applicable
    if (newBank !== "Local") {
      setBankAccounts(prev => prev.map(acc => {
        if (acc.bankName === newBank) {
          const transInBankCurrency = convertAmountToSelectedCurrency(t.amount, t.currency, acc.currency);
          const balanceDiff = t.type === "income" ? transInBankCurrency : -transInBankCurrency;
          return { ...acc, balance: acc.balance + balanceDiff };
        }
        return acc;
      }));
    }

    setNewDesc("");
    setNewVal("");
  };

  const handleDeleteTransaction = (id: string) => {
    setTransactions(prev => prev.filter(t => t.id !== id));
  };

  // Add custom Boleto
  const handleAddBoleto = (bData: Omit<Boleto, "id" | "barcode">) => {
    const digitString = Array.from({ length: 47 }, () => Math.floor(Math.random() * 10)).join("");
    const b: Boleto = {
      ...bData,
      id: Math.random().toString(),
      barcode: `${digitString.substring(0, 5)}.${digitString.substring(5, 10)} ${digitString.substring(10, 15)}.${digitString.substring(15, 20)} ${digitString.substring(20, 25)}.${digitString.substring(25, 30)} ${digitString.substring(30, 31)} ${digitString.substring(31, 47)}`
    };
    setBoletos(prev => [b, ...prev]);
  };

  // Settle Boleto Payment
  const handlePayBoleto = (id: string) => {
    const b = boletos.find(item => item.id === id);
    if (!b) return;

    setBoletos(prev => prev.map(item => item.id === id ? { ...item, paid: true } : item));

    // Also write down as an official expense transaction dynamically!
    const t: Transaction = {
      id: Math.random().toString(),
      type: "expense",
      category: b.category,
      amount: b.amount,
      currency: b.currency,
      description: `Pgto Boleto: ${b.title}`,
      date: new Date().toISOString().split("T")[0]
    };
    setTransactions(prev => [t, ...prev]);
  };

  const handleDeleteBoleto = (id: string) => {
    setBoletos(prev => prev.filter(b => b.id !== id));
  };

  // Connection management
  const handleConnectBank = (bankName: any) => {
    setBankAccounts(prev => prev.map(acc => {
      if (acc.bankName === bankName) {
        return { ...acc, isConnected: true, lastSynced: new Date().toISOString() };
      }
      return acc;
    }));

    // Seed transaction when connected for a real experience! Let's pull simulated transfers
    setTimeout(() => {
      const bAcc = bankAccounts.find(x => x.bankName === bankName);
      const isBrl = bAcc?.currency === "BRL";
      const pulledVal = bankName === "Nubank" ? 180 : bankName === "Itaú" ? 1200 : 450;
      const t: Transaction = {
        id: Math.random().toString(),
        type: "income",
        category: "Serviços",
        amount: pulledVal,
        currency: bAcc?.currency || "BRL",
        description: `Importação Open Finance ${bankName}`,
        date: new Date().toISOString().split("T")[0],
        bankAccount: bankName
      };
      setTransactions(prev => [t, ...prev]);
    }, 1500);
  };

  const handleSyncBank = (id: string) => {
    setBankAccounts(prev => prev.map(acc => {
      if (acc.id === id) {
        return { ...acc, lastSynced: new Date().toISOString() };
      }
      return acc;
    }));
  };

  const handleDisconnectBank = (id: string) => {
    setBankAccounts(prev => prev.map(acc => {
      if (acc.id === id) {
        return { ...acc, isConnected: false };
      }
      return acc;
    }));
  };

  const handleTriggerBackup = (provider: "Google Drive" | "Dropbox" | "EasyFinance Secure Cloud") => {
    const size = Math.floor(10 + Math.random() * 40);
    const log: BackupLog = {
      id: Math.random().toString(),
      provider,
      date: new Date().toISOString(),
      sizeStr: `${size} KB`,
      status: "success"
    };
    
    setBackupLogs(prev => [...prev, log]);
    setUserProfile(prev => ({ ...prev, lastBackupDate: new Date().toISOString() }));
  };

  // Recharts structured graphics data
  // 1. Line/Bar Cashflow comparison month
  const chartCashFlowData = [
    { name: "Receitas", valor: totalIncome, fill: "#06b6d4" },
    { name: "Despesas", valor: totalExpense, fill: "#ef4444" }
  ];

  // 2. Expenditures Category allocations
  const expenseCategoriesAgg = transactions
    .filter(t => t.type === "expense")
    .reduce((acc: Record<string, number>, t) => {
      const convertedVal = convertAmountToSelectedCurrency(t.amount, t.currency, selectedDisplayCurrency);
      acc[t.category] = (acc[t.category] || 0) + convertedVal;
      return acc;
    }, {});

  const chartCategoriesData = Object.keys(expenseCategoriesAgg).map((key) => ({
    name: key,
    value: parseFloat(expenseCategoriesAgg[key].toFixed(2))
  }));

  const COLORS_NEON = ["#06b6d4", "#a855f7", "#ec4899", "#f59e0b", "#3b82f6", "#10b981", "#ef4444"];

  // Unlock dashboard from Simulated Biometrics
  const handleUnlockDashboard = () => {
    setUserProfile(prev => ({ ...prev, isUnlocked: true }));
  };

  const handleLockDashboardByForce = () => {
    setUserProfile(prev => ({ ...prev, isUnlocked: false }));
  };

  // Visual layout containers depend on simulated desktop or mobile frame wrapper
  const currentSymbol = exchangeRates[selectedDisplayCurrency].symbol;

  return (
    <div className="min-h-screen font-sans antialiased transition-all duration-300 bg-[#050505] text-[#d4d4d8] dark">
      
      {/* If Simulated lock and biometrics active */}
      {!userProfile.isUnlocked ? (
        <BiometricLock onUnlock={handleUnlockDashboard} isBiometricsActive={userProfile.isBiometricsActive} />
      ) : (
        <div className="mx-auto w-full transition-all">
          
          {/* CONTROL WRAPPER HEADER TOP BAR */}
          <header className="p-4 border-b bg-[#0d0d0e]/95 backdrop-blur-md border-[#1a1a1a] flex flex-col md:flex-row items-center justify-between gap-4 sticky top-0 z-45">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-cyan-400 to-violet-600 flex items-center justify-center shadow shadow-cyan-500/10">
                <span className="text-white font-semibold text-lg italic tracking-wider">B</span>
              </div>
              <div>
                <span className="text-sm font-semibold tracking-wider text-white uppercase block leading-none">
                  BALANZY
                </span>
                <span className="text-[9px] text-slate-500 font-mono block tracking-widest leading-none mt-1">Inteligência Financeira</span>
              </div>
            </div>

            {/* Dashboard Telemetries */}
            <div className="flex flex-wrap items-center gap-3">
              {/* Display Currency Selection Dropdown */}
              <div className="flex items-center gap-1.5 bg-[#050505] p-1 rounded-lg border border-[#1a1a1a]">
                <span className="text-[9px] text-[#555] font-mono pl-1 uppercase tracking-wider">Moeda:</span>
                {(["BRL", "USD", "EUR", "GBP"] as const).map((curr) => (
                  <button
                    key={curr}
                    onClick={() => setSelectedDisplayCurrency(curr)}
                    className={`px-2 py-0.5 text-[10px] font-semibold transition-all rounded ${selectedDisplayCurrency === curr ? "bg-white/10 text-cyan-400" : "text-slate-500 hover:text-white"}`}
                  >
                    {exchangeRates[curr].symbol} {curr}
                  </button>
                ))}
              </div>

              {/* Layout Simulator trigger */}
              <div className="flex bg-[#050505] p-1 rounded-lg border border-[#1a1a1a]">
                <button
                  onClick={() => setDeviceLayout("desktop")}
                  title="Painel Wide PC"
                  className={`p-1 px-2 py-0.5 rounded text-[10px] font-semibold leading-none flex items-center gap-1 ${deviceLayout === "desktop" ? "bg-white/10 text-cyan-400" : "text-slate-500 hover:text-white"}`}
                >
                  <Laptop className="w-3.5 h-3.5" /> PC
                </button>
                <button
                  onClick={() => setDeviceLayout("mobile")}
                  title="Simular celular"
                  className={`p-1 px-2 py-0.5 rounded text-[10px] font-semibold leading-none flex items-center gap-1 ${deviceLayout === "mobile" ? "bg-white/10 text-violet-400" : "text-slate-500 hover:text-white"}`}
                >
                  <Smartphone className="w-3.5 h-3.5" /> Celular
                </button>
              </div>

              {/* Reforce Lock */}
              <button
                onClick={handleLockDashboardByForce}
                title="Bloquear aplicativo securitário"
                className="p-1 px-2.5 rounded-lg bg-[#0d0d0e] border border-rose-500/20 text-rose-450 hover:bg-rose-950/25 transition-all flex items-center gap-1.5 text-[10px] tracking-wider uppercase font-semibold cursor-pointer"
              >
                <Unlock className="w-3 h-3" /> Trancar
              </button>
            </div>
          </header>

          {/* SIMULATED FRAME CONTROLLERS OR NORMAL RENDERING */}
          <main className="p-4 sm:p-6 lg:p-8">
            <div className={`mx-auto ${deviceLayout === "mobile" ? "max-w-[400px] border-[12px] border-slate-800/95 rounded-[46px] shadow-2xl overflow-hidden bg-slate-900 relative pb-10" : "max-w-7xl"}`}>
              {/* If Mobile Simulator, show mobile bar */}
              {deviceLayout === "mobile" && (
                <div className="bg-slate-900 text-slate-400 p-3 pt-4 border-b border-slate-800/60 text-center text-[10px] font-mono select-none relative flex justify-between items-center px-6">
                  <span className="font-bold">09:41</span>
                  <div className="absolute left-1/2 -translate-x-1/2 top-4 w-28 h-5 bg-black rounded-full" />
                  <div className="flex gap-1 items-center z-10">
                    <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 block animate-pulse" />
                    <span className="text-[9px] uppercase font-bold text-emerald-400 tracking-wider">EasyFinance OS</span>
                  </div>
                </div>
              )}

              {/* CORE VIEWPORT SCROLLER */}
              <div className={`${deviceLayout === "mobile" ? "overflow-y-auto max-h-[720px] p-4 font-sans" : "space-y-6"}`}>

                {/* Hero profile alert notifications indicator */}
                <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mb-3">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-[#0d0d0e]/95 border border-[#1a1a1a] flex items-center justify-center font-bold text-cyan-400 text-xs">
                      EF
                    </div>
                    <div>
                      <h1 className="text-sm font-semibold tracking-wider text-white uppercase block leading-none">EasyFinance de {userProfile.name}</h1>
                      <p className="text-xs text-slate-500 mt-1">Visão financeira e controle inteligente de custos</p>
                    </div>
                  </div>

                  <div className="flex gap-2 text-[10px] font-bold uppercase tracking-wider bg-[#0d0d0e] p-2 rounded-xl border border-[#1a1a1a]">
                    <Clock className="w-3.5 h-3.5 text-slate-500" />
                    <span className="text-slate-500">Modo: </span>
                    <span className={transactions.length > 0 ? "text-cyan-400" : "text-yellow-400"}>
                      {deviceLayout === "mobile" ? "Mobile View" : "PC Wide View"}
                    </span>
                  </div>
                </div>

                {/* KPI BALANCE CARDS GRID */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                  {/* Cancel balance general styling */}
                  <div className="p-5 rounded-2xl bg-[#0d0d0e] border border-[#1a1a1a] shadow flex flex-col justify-between relative overflow-hidden">
                    <div>
                      <span className="text-[9px] font-mono text-slate-500 block uppercase tracking-wider font-semibold">Saldo Consolidado</span>
                      <div className="flex items-baseline gap-1 mt-1">
                        <span className="text-lg font-mono text-slate-500">{currentSymbol}</span>
                        <h3 className="text-2xl font-semibold font-mono tracking-tight text-white">
                          {netBalance.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}
                        </h3>
                      </div>
                    </div>
                    <div className="mt-4 flex items-center justify-between text-xs text-slate-500 border-t border-[#1a1a1a] pt-3">
                      <span className="flex items-center gap-1 text-[10px] font-semibold uppercase tracking-wider">
                        <Wallet className="w-3.5 h-3.5 text-cyan-400" />
                        Ativos em {selectedDisplayCurrency}
                      </span>
                    </div>
                  </div>

                  {/* Monthly total incomes */}
                  <div className="p-5 rounded-2xl bg-[#0d0d0e] border border-[#1a1a1a] shadow flex flex-col justify-between relative overflow-hidden">
                    <div>
                      <span className="text-[9px] font-mono text-slate-500 block uppercase tracking-wider font-semibold">Receitas Mensais</span>
                      <div className="flex items-baseline gap-1 mt-1">
                        <span className="text-lg font-mono text-slate-500">{currentSymbol}</span>
                        <h3 className="text-2xl font-semibold font-mono tracking-tight text-emerald-400">
                          {totalIncome.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}
                        </h3>
                      </div>
                    </div>
                    <div className="mt-4 flex items-center justify-between text-xs text-slate-500 border-t border-[#1a1a1a] pt-3">
                      <span className="flex items-center gap-1 text-[10px] font-semibold uppercase tracking-wider text-emerald-500">
                        <TrendingUp className="w-3.5 h-3.5" />
                        Ganhos consolidados
                      </span>
                    </div>
                  </div>

                  {/* Monthly expenses */}
                  <div className="p-5 rounded-2xl bg-[#0d0d0e] border border-[#1a1a1a] shadow flex flex-col justify-between relative overflow-hidden">
                    <div>
                      <span className="text-[9px] font-mono text-slate-500 block uppercase tracking-wider font-semibold">Resumo de Despesas</span>
                      <div className="flex items-baseline gap-1 mt-1">
                        <span className="text-lg font-mono text-slate-500">{currentSymbol}</span>
                        <h3 className="text-2xl font-semibold font-mono tracking-tight text-rose-400">
                          {totalExpense.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}
                        </h3>
                      </div>
                    </div>
                    <div className="mt-4 flex items-center justify-between text-xs text-slate-500 border-t border-[#1a1a1a] pt-3">
                      <span className="flex items-center gap-1 text-[10px] font-semibold uppercase tracking-wider text-rose-500">
                        <TrendingDown className="w-3.5 h-3.5" />
                        Total de débitos
                      </span>
                    </div>
                  </div>
                </div>

                {/* TELEMETRY MONTHLY BUDGET TARGET PROGRESS BAR */}
                <div className="p-5 bg-[#0d0d0e] border border-[#1a1a1a] rounded-2xl mb-6">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 mb-2">
                    <div>
                      <span className="text-[11px] font-bold uppercase tracking-wider text-slate-300 block">Análise de Orçamento Limite</span>
                      <span className="text-[10px] text-slate-500 block mt-0.5">Meta mensal de gastos controlados</span>
                    </div>
                    <div className="text-right">
                      <span className="text-xs font-semibold text-slate-300 font-mono">
                        {currentSymbol} {totalExpense.toFixed(0)} / {currentSymbol} {userProfile.budgetMonthlyLimit}
                      </span>
                    </div>
                  </div>
                  
                  {/* Real visual progress bar */}
                  <div className="w-full bg-[#151515] rounded-full h-1.5 overflow-hidden border border-[#222]">
                    <div 
                      className={`h-full rounded-full transition-all duration-500 ${
                        (totalExpense / userProfile.budgetMonthlyLimit) > 0.9 
                          ? "bg-rose-500 shadow-[0_0_8px_rgba(239,68,68,0.5)]" 
                          : (totalExpense / userProfile.budgetMonthlyLimit) > 0.7 
                            ? "bg-amber-500 shadow-[0_0_8px_rgba(245,158,11,0.5)]" 
                            : "bg-gradient-to-r from-cyan-400 to-violet-500 shadow-[0_0_8px_rgba(6,182,212,0.5)]"
                      }`}
                      style={{ width: `${Math.min(100, (totalExpense / userProfile.budgetMonthlyLimit) * 100)}%` }}
                    />
                  </div>

                  {/* Warn if over budget */}
                  {(totalExpense / userProfile.budgetMonthlyLimit) > 1 && (
                    <div className="mt-2.5 p-2 bg-rose-500/10 border border-rose-500/20 text-[9px] text-rose-450 rounded-lg flex items-center gap-1 w-fit uppercase font-semibold animate-pulse">
                      <AlertCircle className="w-3.5 h-3.5" /> Alerta de Estouro: Você ultrapassou o orçamento limite configurado!
                    </div>
                  )}
                </div>

                {/* GRAPHICS WORKSPACE CHARTS ROW */}
                <div className={`grid grid-cols-1 ${deviceLayout === "mobile" ? "" : "lg:grid-cols-2"} gap-6 mb-6`}>
                  
                  {/* Category Allocation Piechart */}
                  <div className="bg-[#0d0d0e] border border-[#1a1a1a] p-5 rounded-2xl flex flex-col min-h-[320px]">
                    <span className="text-[11px] font-bold uppercase text-slate-400 tracking-wider">Despesas por Categoria</span>
                    <span className="text-[10px] text-slate-500 block mt-1">Alocação proporcional de custos mensais</span>

                    <div className="flex-1 flex items-center justify-center pt-2">
                      {chartCategoriesData.length === 0 ? (
                        <span className="text-xs text-slate-550 font-mono">Nenhum gasto lançado para categorização.</span>
                      ) : (
                        <ResponsiveContainer width="100%" height={210}>
                          <PieChart>
                            <Pie
                              data={chartCategoriesData}
                              cx="50%"
                              cy="50%"
                              innerRadius={50}
                              outerRadius={75}
                              paddingAngle={4}
                              dataKey="value"
                            >
                              {chartCategoriesData.map((entry, index) => (
                                <Cell key={`cell-${index}`} fill={COLORS_NEON[index % COLORS_NEON.length]} />
                              ))}
                            </Pie>
                            <Tooltip 
                              formatter={(value) => [`${currentSymbol} ${value}`, "Total"]}
                              contentStyle={{ backgroundColor: "#0d0d0e", borderColor: "#1a1a1a", color: "#f8fafc", borderRadius: "8px", fontSize: "11px" }} 
                            />
                            <Legend wrapperStyle={{ fontSize: "10px", color: "#555" }} />
                          </PieChart>
                        </ResponsiveContainer>
                      )}
                    </div>
                  </div>

                  {/* Monthly cashflows trends */}
                  <div className="bg-[#0d0d0e] border border-[#1a1a1a] p-5 rounded-2xl flex flex-col min-h-[320px]">
                    <span className="text-[11px] font-bold uppercase text-slate-400 tracking-wider">Atividade Consolidada</span>
                    <span className="text-[10px] text-slate-500 block mt-1">Comparativo simplificado entre Receitas e Despesas</span>

                    <div className="flex-1 flex items-center justify-center pt-2">
                      <ResponsiveContainer width="100%" height={210}>
                        <BarChart data={chartCashFlowData}>
                          <XAxis dataKey="name" stroke="#555" style={{ fontSize: "10px", fontFamily: "monospace" }} />
                          <YAxis stroke="#555" style={{ fontSize: "10px", fontFamily: "monospace" }} />
                          <Tooltip 
                            formatter={(value) => [`${currentSymbol} ${Number(value).toFixed(2)}`, "Valor"]}
                            contentStyle={{ backgroundColor: "#0d0d0e", borderColor: "#1a1a1a", color: "#f8fafc", borderRadius: "8px", fontSize: "11px" }}
                          />
                          <Bar dataKey="valor" radius={[6, 6, 0, 0]}>
                            {chartCashFlowData.map((entry, index) => (
                              <Cell key={`cell-${index}`} fill={entry.fill} />
                            ))}
                          </Bar>
                        </BarChart>
                      </ResponsiveContainer>
                    </div>
                  </div>
                </div>

                {/* MODULAR WRAPPER PANELS BLOCK RANGE */}
                <div className={`grid grid-cols-1 ${deviceLayout === "mobile" ? "" : "lg:grid-cols-2"} gap-6 mb-6`}>
                  {/* Bank APIs Simulator Panel */}
                  <BankAccountSync 
                    accounts={bankAccounts} 
                    onConnectAccount={handleConnectBank} 
                    onSyncAccount={handleSyncBank} 
                    onDisconnectAccount={handleDisconnectBank} 
                  />

                  {/* Boletos manager panel */}
                  <BoletoManager 
                    boletos={boletos} 
                    onAddBoleto={handleAddBoleto} 
                    onPayBoleto={handlePayBoleto} 
                    onDeleteBoleto={handleDeleteBoleto} 
                    currencySymbol={currentSymbol} 
                  />
                </div>

                {/* QUICK ADD INLINE TRANSACTION FORM */}
                <div className="p-6 bg-[#0d0d0e] border border-[#1a1a1a] rounded-2xl mb-6">
                  <span className="text-xs font-semibold uppercase tracking-wider text-slate-300 block mb-1">Adicionar Lançamento Manual</span>
                  <span className="text-[10px] text-slate-500 block mb-4">Insira despesas ou receitas diretamente em carteira local</span>

                  <form onSubmit={handleAddTransaction} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
                    <input
                      type="text"
                      placeholder="Ex: Almoço, Salário, Energia"
                      required
                      value={newDesc}
                      onChange={(e) => setNewDesc(e.target.value)}
                      className="bg-[#050505] border border-[#1a1a1a] p-2.5 rounded-xl text-xs text-slate-100 placeholder-slate-600 focus:outline-none focus:border-cyan-500"
                    />

                    <div className="grid grid-cols-2 gap-2">
                      <select
                        value={newType}
                        onChange={(e) => setNewType(e.target.value as any)}
                        className="bg-[#050505] border border-[#1a1a1a] p-2 rounded-xl text-xs font-semibold text-slate-100"
                      >
                        <option value="expense">Despesa</option>
                        <option value="income">Receita</option>
                      </select>

                      <select
                        value={newCategory}
                        onChange={(e) => setNewCategory(e.target.value)}
                        className="bg-[#050505] border border-[#1a1a1a] p-2 rounded-xl text-xs text-slate-100"
                      >
                        <option value="Alimentação">Alimentação</option>
                        <option value="Serviços">Serviços</option>
                        <option value="Lazer">Lazer</option>
                        <option value="Moradia">Moradia</option>
                        <option value="Transporte">Transporte</option>
                        <option value="Saúde">Saúde</option>
                        <option value="Outros">Outros</option>
                      </select>
                    </div>

                    <div className="grid grid-cols-3 gap-2">
                      <div className="col-span-2 relative">
                        <span className="absolute left-2.5 top-2.5 text-[9px] text-slate-600 font-mono font-bold uppercase tracking-wide">Val</span>
                        <input
                          type="number"
                          step="0.01"
                          placeholder="0.00"
                          required
                          value={newVal}
                          onChange={(e) => setNewVal(e.target.value)}
                          className="w-full bg-[#050505] border border-[#1a1a1a] p-2 pl-9 rounded-xl text-xs text-slate-100"
                        />
                      </div>

                      <select
                        value={newCurr}
                        onChange={(e) => setNewCurr(e.target.value as any)}
                        className="bg-[#050505] border border-[#1a1a1a] p-2 rounded-xl text-xs font-bold text-cyan-400"
                      >
                        <option value="BRL">BRL</option>
                        <option value="USD">USD</option>
                        <option value="EUR">EUR</option>
                        <option value="GBP">GBP</option>
                      </select>
                    </div>

                    <select
                      value={newBank}
                      onChange={(e) => setNewBank(e.target.value)}
                      className="bg-[#050505] border border-[#1a1a1a] p-2 rounded-xl text-xs text-slate-300"
                    >
                      <option value="Local">Dinheiro Local (Físico)</option>
                      {bankAccounts.filter(b => b.isConnected).map(b => (
                        <option key={b.id} value={b.bankName}>{b.bankName} (Open Finance)</option>
                      ))}
                    </select>

                    <button
                      type="submit"
                      className="py-2.5 rounded-xl bg-white hover:bg-slate-200 font-semibold text-slate-950 text-[10px] uppercase tracking-wider transition-all cursor-pointer flex items-center justify-center gap-1.5"
                    >
                      <PlusCircle className="w-4 h-4" /> Lançar Custos
                    </button>
                  </form>
                </div>

                {/* MODALES CLOUD SYNC & REPORTE EXPORTER */}
                <div className={`grid grid-cols-1 ${deviceLayout === "mobile" ? "" : "lg:grid-cols-2"} gap-6 mb-6`}>
                  {/* Offline and Cloud backup setups */}
                  <OfflineCloudSyncBar 
                    backupLogs={backupLogs} 
                    onTriggerBackup={handleTriggerBackup} 
                    cloudSyncEnabled={userProfile.cloudSyncEnabled} 
                    onToggleCloudSync={() => setUserProfile(prev => ({ ...prev, cloudSyncEnabled: !prev.cloudSyncEnabled }))} 
                    lastBackupDate={userProfile.lastBackupDate} 
                  />

                  {/* PDF/CSV Report Exporter */}
                  <ReportExporter 
                    transactions={transactions} 
                    boletos={boletos} 
                    currentCurrency={currentSymbol} 
                  />
                </div>

                {/* GEMINI AI CHAT INTEGRATION COUCH SECTION */}
                <div className="mb-6">
                  <EasyFinanceAIGenius 
                    transactions={transactions} 
                    boletos={boletos} 
                    currentCurrency={selectedDisplayCurrency} 
                  />
                </div>

                {/* TRANSACTIONS HISTORICAL VAULT SHEET */}
                <div className="p-6 bg-[#0d0d0e] border border-[#1a1a1a] rounded-2xl">
                  <span className="text-xs font-semibold uppercase tracking-wider text-slate-300 block mb-1">Ficha Geral de Lançamentos</span>
                  <span className="text-[10px] text-slate-500 block mb-4">Histórico instantâneo de transações locais</span>

                  <div className="overflow-x-auto">
                    <table className="w-full text-left text-xs text-slate-400">
                      <thead>
                        <tr className="border-b border-[#1a1a1a] text-slate-500 font-semibold uppercase tracking-wider text-[9px]">
                          <th className="py-2.5">Data</th>
                          <th>Descrição</th>
                          <th>Categoria</th>
                          <th>Origem / Banco</th>
                          <th className="text-right">Categoria Fluxo</th>
                          <th className="text-right">Moeda Original</th>
                          <th className="text-right">Consolidado ({selectedDisplayCurrency})</th>
                          <th className="text-center">Ações</th>
                        </tr>
                      </thead>
                      <tbody>
                        {transactions.length === 0 ? (
                          <tr>
                            <td colSpan={8} className="py-8 text-center text-slate-600 font-mono">
                              Nenhum lançamento registrado na carteira.
                            </td>
                          </tr>
                        ) : (
                          transactions.map((t) => {
                            const valSelected = convertAmountToSelectedCurrency(t.amount, t.currency, selectedDisplayCurrency);
                            return (
                              <tr key={t.id} className="border-b border-[#111112] hover:bg-[#050505]/40 transition-all text-[11px]">
                                <td className="py-3 font-mono text-slate-500">{t.date}</td>
                                <td className="font-semibold text-slate-200">{t.description}</td>
                                <td>
                                  <span className="px-1.5 py-0.5 rounded bg-[#151515] text-slate-400 font-semibold border border-[#222]">
                                    {t.category}
                                  </span>
                                </td>
                                <td>
                                  <span className="text-[10px] font-mono text-slate-500">
                                    {t.bankAccount ? `API ${t.bankAccount}` : "Dinheiro Físico"}
                                  </span>
                                </td>
                                <td className="text-right">
                                  <span className={`font-semibold uppercase tracking-wider text-[9px] ${t.type === "income" ? "text-emerald-400" : "text-rose-400"}`}>
                                    {t.type === "income" ? "Ganho" : "Saída"}
                                  </span>
                                </td>
                                <td className="text-right font-mono text-slate-500">
                                  {exchangeRates[t.currency].symbol} {t.amount.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}
                                </td>
                                <td className={`text-right font-bold font-mono ${t.type === "income" ? "text-emerald-400" : "text-rose-400"}`}>
                                  {currentSymbol} {valSelected.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}
                                </td>
                                <td className="text-center">
                                  <button
                                    onClick={() => handleDeleteTransaction(t.id)}
                                    className="p-1 text-slate-500 hover:text-rose-400 transition-all rounded"
                                  >
                                    <Trash2 className="w-3.5 h-3.5" />
                                  </button>
                                </td>
                              </tr>
                            );
                          })
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>

              </div>
            </div>
          </main>

          {/* FOOTER GENERAL GREETINGS */}
          <footer className="p-6 mt-12 border-t border-[#1a1a1a] text-center text-[10px] font-mono text-[#555] flex flex-col md:flex-row items-center justify-between gap-4 max-w-7xl mx-auto bg-[#050505]">
            <span>EasyFinance © 2026. Todos os direitos reservados.</span>
            <div className="flex gap-4">
              <span>Open Finance BCB ativa</span>
              <span>•</span>
              <span>Proteção Biométrica SHA-512</span>
              <span>•</span>
              <span>Resiliência Offgrid</span>
            </div>
          </footer>
        </div>
      )}
    </div>
  );
}
