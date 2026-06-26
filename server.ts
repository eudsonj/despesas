import express from "express";
import path from "path";
import dotenv from "dotenv";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI } from "@google/genai";

dotenv.config();

const app = express();
const PORT = 3000;

app.use(express.json());

// Initialize Google GenAI Client
const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
  httpOptions: {
    headers: {
      'User-Agent': 'aistudio-build',
    }
  }
});

// AI Financial Advisor Endpoint
app.post("/api/ai/analyze", async (req, res) => {
  try {
    const { prompt, transactions, boletos, currency } = req.body;

    // Build context
    const transactionContext = transactions && transactions.length > 0
      ? JSON.stringify(transactions.slice(-15).map((t: any) => ({
          type: t.type,
          category: t.category,
          amount: t.amount,
          currency: t.currency || "BRL",
          description: t.description,
          date: t.date
        })))
      : "Nenhuma transação registrada ainda.";

    const boletosContext = boletos && boletos.length > 0
      ? JSON.stringify(boletos.map((b: any) => ({
          title: b.title,
          amount: b.amount,
          dueDate: b.dueDate,
          paid: b.paid
        })))
      : "Nenhum boleto registrado.";

    const systemInstruction = `Você é o EasyFinance AI Genius, o assistente de inteligência financeira integrado ao aplicativo EasyFinance (um app financeiro inovador e tecnológico de despesas pessoais).
Sua missão é dar insights financeiros brilhantes, inovadores, curtos, acionáveis e motivadores em português brasileiro.
Analise os dados financeiros fornecidos pelo usuário se houver e responda à pergunta dele.
Moeda preferida do usuário atualmente: ${currency || "BRL"}.

DADOS ATUAIS DO USUÁRIO:
- Últimas Transações: ${transactionContext}
- Boleto e Contas a Vencer: ${boletosContext}

Mantenha as respostas focadas em dicas práticas de finanças, previsão de saldo, avisos de boletos perto de vencer (se houver no contexto) ou esclarecimentos de dúvidas e categorização de gastos. Mantenha os parágrafos curtos, formate com markdown agradável (negrito, marcadores). Não seja prolixo. Seja inovador e amigável!`;

    const response = await ai.models.generateContent({
      model: "gemini-3.5-flash",
      contents: prompt,
      config: {
        systemInstruction,
        temperature: 0.7,
      }
    });

    res.json({ text: response.text });
  } catch (error: any) {
    console.error("Erro no EasyFinance AI Genius:", error);
    res.status(500).json({ 
      error: "Ocorreu um erro ao processar seu pedido financeiro.", 
      details: error.message 
    });
  }
});

// Serve the standalone index.html directly for both development and production
async function setupServer() {
  const indexHtmlPath = path.join(process.cwd(), "index.html");

  // Serve static files from root directory
  app.use(express.static(process.cwd()));

  app.get("/", (req, res) => {
    res.sendFile(indexHtmlPath);
  });

  // SPA fallback to index.html
  app.get("*", (req, res) => {
    res.sendFile(indexHtmlPath);
  });

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`EasyFinance Server running on http://localhost:${PORT}`);
  });
}

setupServer();
