import express from "express";
import path from "path";
import dotenv from "dotenv";
import fs from "fs";
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

// Serve the application using Vite dev middleware in development, and static files in production
async function setupServer() {
  if (process.env.NODE_ENV !== "production") {
    console.log("Starting EasyFinance in Development mode (Vite Middleware)...");
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "custom",
    });
    app.use(vite.middlewares);

    app.get("*", async (req, res, next) => {
      const url = req.originalUrl;
      // Skip API routes
      if (url.startsWith("/api/")) {
        return next();
      }
      try {
        let template = fs.readFileSync(path.resolve(process.cwd(), "index.html"), "utf-8");
        template = await vite.transformIndexHtml(url, template);
        res.status(200).set({ "Content-Type": "text/html" }).end(template);
      } catch (e) {
        vite.ssrFixStacktrace(e as Error);
        next(e);
      }
    });
  } else {
    console.log("Starting EasyFinance in Production mode...");
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`EasyFinance Server running on http://localhost:${PORT}`);
  });
}

setupServer();
