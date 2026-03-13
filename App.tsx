import { useEffect, useState } from "react";

export default function App() {
  const [resposta, setResposta] = useState("Carregando...");

  useEffect(() => {
    async function chamarGemini() {
      try {
        // Aqui você coloca sua chave direto
        const key = process.env.GEMINI_API_KEY;

        if (!key) {
          setResposta("❌ Chave não encontrada");
          return;
        }

        const response = await fetch(
          "https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=" + key,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              contents: [
                {
                  parts: [
                    { text: "Me dê uma receita simples com banana." }
                  ]
                }
              ]
            }),
          }
        );

        const data = await response.json();
        const texto = data?.candidates?.[0]?.content?.parts?.[0]?.text;
        setResposta(texto || "❌ Não veio resposta");
      } catch (error) {
        setResposta("Erro: " + error);
      }
    }

    chamarGemini();
  }, []);

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        height: "100vh",
        backgroundColor: "#FF7F00",
      }}
    >
      <h1 style={{ color: "white", fontSize: "2rem", fontWeight: "bold" }}>
        Quase Chef!
      </h1>
      <p style={{ color: "white", fontSize: "1.2rem", maxWidth: "600px", textAlign: "center" }}>
        {resposta}
      </p>
    </div>
  );
}