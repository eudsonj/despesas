import React, { useState, useRef, useEffect } from "react";
import { Sparkles, Send, Brain, Bot, Lightbulb, TrendingUp, HelpCircle, ArrowRight, Loader2 } from "lucide-react";
import { Transaction, Boleto } from "../types";

interface EasyFinanceAIGeniusProps {
  transactions: Transaction[];
  boletos: Boleto[];
  currentCurrency: string;
}

interface Message {
  id: string;
  sender: "user" | "ai";
  text: string;
  timestamp: Date;
}

export default function EasyFinanceAIGenius({ transactions, boletos, currentCurrency }: EasyFinanceAIGeniusProps) {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "welcome",
      sender: "ai",
      text: "Olá! Sou o **EasyFinance AI Genius**, sua inteligência artificial para insights financeiros. Posso analisar seus gastos, sugerir metas de economia, ler transações em texto livre e responder a qualquer dúvida financeira. Como posso ajudar você hoje?",
      timestamp: new Date()
    }
  ]);
  const [inputText, setInputText] = useState("");
  const [loading, setLoading] = useState(false);
  const chatContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (messages.length > 1 && chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
    }
  }, [messages, loading]);

  const handleSendMessage = async (textToSend: string) => {
    if (!textToSend.trim() || loading) return;

    const userMsg: Message = {
      id: Math.random().toString(),
      sender: "user",
      text: textToSend,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMsg]);
    setInputText("");
    setLoading(true);

    try {
      const response = await fetch("/api/ai/analyze", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          prompt: textToSend,
          transactions,
          boletos,
          currency: currentCurrency
        })
      });

      if (!response.ok) {
        throw new Error("Erro na comunicação com o servidor Gemini.");
      }

      const data = await response.json();
      
      const aiMsg: Message = {
        id: Math.random().toString(),
        sender: "ai",
        text: data.text || "Desculpe, não consegui obter uma resposta de análise no momento.",
        timestamp: new Date()
      };

      setMessages(prev => [...prev, aiMsg]);
    } catch (err: any) {
      console.error(err);
      const errorMsg: Message = {
        id: Math.random().toString(),
        sender: "ai",
        text: "Desculpe! Ocorreu um problema de conexão com o servidor do AI Genius. Certifique-se de configurar a variável `GEMINI_API_KEY` na aba de segredos do AI Studio se estiver testando localmente.",
        timestamp: new Date()
      };
      setMessages(prev => [...prev, errorMsg]);
    } finally {
      setLoading(false);
    }
  };

  const handleQuickSuggestion = (suggestion: string) => {
    handleSendMessage(suggestion);
  };

  const suggestions = [
    { text: "Me dê 3 dicas práticas para cortar despesas este mês.", icon: <Lightbulb className="w-3.5 h-3.5 text-yellow-400" /> },
    { text: "Analise minhas transações mais caras e aponte alertas.", icon: <TrendingUp className="w-3.5 h-3.5 text-cyan-400" /> },
    { text: "Copiei o extrato: 'Gastei 110 reais no almoço de domingo categoria alimentação.' Como classificar?", icon: <Brain className="w-3.5 h-3.5 text-violet-400" /> }
  ];

  // Helper to render basic markdown bold/italics in chat text
  const parseMarkdownHighlights = (text: string) => {
    // Replace **bold** with <strong>bold</strong>
    const boldRegex = /\*\*(.*?)\*\*/g;
    const parts = text.split(boldRegex);
    return parts.map((part, index) => {
      if (index % 2 === 1) {
        return <strong key={index} className="text-cyan-300 font-extrabold">{part}</strong>;
      }
      
      // Basic list bullet replacement
      if (part.startsWith("- ")) {
        return <span key={index} className="block pl-2 mt-1">{part}</span>;
      }
      return part;
    });
  };

  return (
    <div className="bg-[#0d0d0e] border border-[#1a1a1a] rounded-2xl p-6 flex flex-col h-[520px]">
      <div className="flex items-center justify-between mb-3 pb-3 border-b border-[#1a1a1a]">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-cyan-400 to-violet-500 flex items-center justify-center shadow shadow-cyan-500/20">
            <Sparkles className="w-4 h-4 text-white" />
          </div>
          <div>
            <h2 className="text-sm font-semibold tracking-wider text-white uppercase flex items-center gap-1">
              EasyFinance AI Genius
              <span className="text-[9px] bg-cyan-550/10 text-cyan-400 border border-cyan-500/20 px-1.5 py-0.5 rounded uppercase font-bold">Ativo</span>
            </h2>
            <p className="text-[10px] text-slate-500 mt-0.5">Gemini Inteligência Financeira e Insights</p>
          </div>
        </div>
      </div>

      {/* Messages Layout Frame */}
      <div 
        ref={chatContainerRef}
        className="flex-1 overflow-y-auto space-y-3.5 mb-3 pr-1.5 p-2 bg-[#050505]/40 rounded-xl border border-[#1a1a1a]"
      >
        {messages.map((m) => (
          <div 
            key={m.id} 
            className={`flex items-start gap-2 max-w-[85%] ${m.sender === "user" ? "ml-auto flex-row-reverse" : "mr-auto"}`}
          >
            <div className={`w-7 h-7 rounded-lg flex items-center justify-center shrink-0 ${m.sender === "user" ? "bg-white text-slate-950" : "bg-[#151515] border border-[#222] text-cyan-453"}`}>
              {m.sender === "user" ? (
                <span className="text-xs font-bold font-sans">EU</span>
              ) : (
                <Bot className="w-3.5 h-3.5" />
              )}
            </div>

            <div className={`p-3 rounded-xl text-xs leading-relaxed ${
              m.sender === "user" 
                ? "bg-white text-slate-950 font-medium rounded-tr-none" 
                : "bg-[#121214] text-slate-200 border border-[#222] rounded-tl-none"
            }`}>
              <div className="whitespace-pre-line">
                {m.sender === "user" ? m.text : parseMarkdownHighlights(m.text)}
              </div>
              <span className="text-[9px] text-slate-500 block mt-1.5 font-mono text-right opacity-80">
                {m.timestamp.toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" })}
              </span>
            </div>
          </div>
        ))}
        {loading && (
          <div className="flex items-start gap-2 max-w-[80%]">
            <div className="w-7 h-7 rounded-lg bg-[#151515] border border-[#222] text-cyan-400 flex items-center justify-center shrink-0">
              <Loader2 className="w-3.5 h-3.5 animate-spin text-cyan-400" />
            </div>
            <div className="p-3.5 rounded-xl text-xs bg-[#121214] text-slate-400 border border-[#222] rounded-tl-none flex items-center gap-2">
              <span className="animate-pulse">AI Genius está processando insights...</span>
            </div>
          </div>
        )}
      </div>

      {/* Suggests Boxes if chat is empty of interactive steps */}
      {messages.length <= 2 && !loading && (
        <div className="mb-3 space-y-1.5">
          <span className="text-[9px] uppercase font-bold text-[#555] tracking-wider block mb-1">Dicas de Perguntas:</span>
          {suggestions.map((s, i) => (
            <button
               key={i}
               onClick={() => handleQuickSuggestion(s.text)}
               className="w-full p-2.5 rounded-lg bg-[#050505] hover:bg-[#121214] border border-[#1a1a1a] hover:border-cyan-500/30 text-slate-400 hover:text-white transition-all text-left flex items-center gap-2.5 text-xs font-medium cursor-pointer"
             >
              {s.icon}
              <span className="truncate flex-1 text-[11px]">{s.text}</span>
              <ArrowRight className="w-3 h-3 text-slate-500 shrink-0" />
            </button>
          ))}
        </div>
      )}

      {/* Inputs text control */}
      <form 
        onSubmit={(e) => {
          e.preventDefault();
          handleSendMessage(inputText);
        }}
        className="flex gap-2"
      >
        <input
          type="text"
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          placeholder="Pergunte ao AI Genius ou cole uma transação em texto livre..."
          className="flex-1 bg-[#050505] border border-[#1a1a1a] rounded-xl px-3 py-2 text-xs text-slate-100 placeholder-slate-600 focus:outline-none focus:border-cyan-500 h-[40px]"
        />
        <button
          type="submit"
          disabled={!inputText.trim() || loading}
          className="w-[40px] h-[40px] rounded-xl bg-white hover:bg-slate-200 text-slate-950 flex items-center justify-center transition-all shadow disabled:opacity-40 shrink-0 cursor-pointer"
        >
          <Send className="w-4 h-4" />
        </button>
      </form>
    </div>
  );
}
