/**
 * Transforma segundos em formato MM:SS
 * Exemplo: 300 -> "05:00"
 */
export const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60).toString().padStart(2, '0');
    const secs = (seconds % 60).toString().padStart(2, '0');
    return `${mins}:${secs}`;
};