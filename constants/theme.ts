/**
 * 🎨 Tema principal do Quase Chef
 * Paleta única de cores, fontes e estilos reutilizáveis.
 */

export const Colors = {
  background: "#FFF3E8", // fundo
  primary: "#f88b3d", // cor principal
  secondary: "#FF8B3D", // cor secundária
  subtitle: "#475569", // subtítulos
  subtext: "#94A3B8", // textos auxiliares
  errorDark: "#EF4444", // vermelho escuro
  errorLight: "#FEE2E2", // vermelho claro
  warning: "#F59E0B", // amarelo
  success: "#22C55E", // verde
  brown: "#A16A45", // marrom
  light: "#FFFFFF", // branco
  dark: "#000000", // preto
};

// Fontes (Google Fonts: Plus Jakarta Sans)
export const Fonts = {
  regular: "PlusJakartaSans-Regular",
  medium: "PlusJakartaSans-Medium",
  bold: "PlusJakartaSans-Bold",
};

// Tamanhos de fonte
export const FontSizes = {
  small: 12,
  medium: 16,
  large: 20,
  title: 24,
};

// Espaçamentos padrão
export const Spacing = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
};

// Bordas arredondadas
export const Radius = {
  sm: 4,
  md: 8,
  lg: 12,
  full: 9999, // para círculos ou cápsulas
};

// Sombras
export const Shadows = {
  sm: {
    elevation: 2,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  md: {
    elevation: 4,
    shadowColor: "#000",
    shadowOpacity: 0.15,
    shadowRadius: 4,
  },
  lg: {
    elevation: 8,
    shadowColor: "#000",
    shadowOpacity: 0.2,
    shadowRadius: 8,
  },
};