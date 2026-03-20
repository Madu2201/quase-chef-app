/** @type {import('tailwindcss').Config} */
module.exports = {
  // Onde o Tailwind vai procurar as cores para pintar o app
  content: [
    "./App.{js,jsx,ts,tsx}",
    "./src/**/*.{js,jsx,ts,tsx}"
  ],
  theme: {
    extend: {
      colors: {
        background: "#FFF3E8", // Cor de fundo bege do Figma
        primary: "#f88b3d",    // Laranja principal
        secondary: "#FF8B3D",  // Laranja secundário
        subtitle: "#475569",   // Cinza para subtítulos
        subtext: "#94A3B8",    // Cinza claro para textos
        errorDark: "#EF4444",  // Vermelho erro
        errorLight: "#FEE2E2", // Fundo de erro
        warning: "#F59E0B",    // Amarelo atenção
        success: "#22C55E",    // Verde sucesso
        brown: "#A16A45",      // Marrom
        light: "#FFFFFF",      // Branco
        dark: "#000000",       // Preto
      },
      fontFamily: {
        jakarta: ["Plus Jakarta Sans", "sans-serif"], // A fonte que você instalou
      },
    },
  },
  plugins: [],
};