import { ReactNode } from "react";

// Tipos para o contexto de status de rede
export type NetworkStatusContextValue = {
    isOffline: boolean;
    offlineActionMessage: string | null;
    notifyInternetRequired: (message?: string) => boolean;
};

// Tipo para as propriedades do provedor de status de rede
export type NetworkStatusProviderProps = {
    children: ReactNode;
};
