// Serve para declarar as variáveis de ambiente que serão usadas no projeto, garantindo que o TypeScript reconheça essas variáveis e evite erros de tipo.
declare module '@env' {
    export const GEMINI_API_KEY: string;
}