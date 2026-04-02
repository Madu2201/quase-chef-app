// src/services/geminiService.ts
import "react-native-url-polyfill/auto";
import { GoogleGenerativeAI } from "@google/generative-ai";

const API_KEY = process.env.EXPO_PUBLIC_GEMINI_API_KEY;

if (!API_KEY) {
  throw new Error("API_KEY is not defined.");
}

// Inicializa a IA
const genAI = new GoogleGenerativeAI(API_KEY);

// Escolhe o modelo (o flash é o mais rápido e barato/grátis)
const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

export const perguntarAoGemini = async (textoUsuario: string) => {
  try {
    // Envia a mensagem pro Gemini
    const result = await model.generateContent(textoUsuario);

    // Pega a resposta em texto
    const resposta = result.response.text();
    return resposta;
  } catch (error: any) {
    // Vamos imprimir o erro completo no terminal de forma bem chamativa
    console.error("🚨 ERRO REAL DO GEMINI:", error);

    // Em vez da frase amigável, vamos forçar o app a cuspir o erro real na tela
    throw new Error(error.message || "Erro desconhecido ao chamar a API.");
  }
};
