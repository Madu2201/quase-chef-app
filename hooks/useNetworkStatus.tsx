import * as Network from "expo-network";
import React, {
  createContext, useCallback, useContext,
  useEffect, useMemo, useRef, useState
} from "react";

import { MESSAGES } from "../constants/messages";
import { TIMINGS } from "../constants/timings";
import type { NetworkStatusContextValue, NetworkStatusProviderProps } from "../types/network";

const NetworkStatusContext = createContext<NetworkStatusContextValue | null>(null);

// Verifica se o dispositivo está offline com base no estado da rede
function resolveIsOffline(networkState: Network.NetworkState): boolean {
  return (
    networkState.isConnected === false ||
    networkState.isInternetReachable === false
  );
}

// Provedor de status de rede, responsável por monitorar o estado da conexão e fornecer uma função para notificar quando uma ação requer internet
export function NetworkStatusProvider({
  children,
}: NetworkStatusProviderProps) {
  const [isOffline, setIsOffline] = useState(false);
  const [offlineActionMessage, setOfflineActionMessage] = useState<string | null>(
    null,
  );
  const offlineMessageTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(
    null,
  );

  useEffect(() => {
    let isMounted = true;

    const syncNetworkState = async () => {
      const networkState = await Network.getNetworkStateAsync();

      if (isMounted) {
        setIsOffline(resolveIsOffline(networkState));
      }
    };

    syncNetworkState();

    const subscription = Network.addNetworkStateListener((networkState) => {
      if (isMounted) {
        setIsOffline(resolveIsOffline(networkState));
      }
    });

    return () => {
      isMounted = false;
      if (offlineMessageTimeoutRef.current) {
        clearTimeout(offlineMessageTimeoutRef.current);
      }
      subscription.remove();
    };
  }, []);

  useEffect(() => {
    if (!isOffline) {
      setOfflineActionMessage(null);
    }
  }, [isOffline]);

  const notifyInternetRequired = useCallback((message?: string) => {
    if (!isOffline) {
      return true;
    }

    setOfflineActionMessage(message || MESSAGES.DEFAULT_OFFLINE_ACTION);

    if (offlineMessageTimeoutRef.current) {
      clearTimeout(offlineMessageTimeoutRef.current);
    }

    offlineMessageTimeoutRef.current = setTimeout(() => {
      setOfflineActionMessage(null);
    }, TIMINGS.network_check_debounce);

    return false;
  }, [isOffline]);

  const value = useMemo(
    () => ({
      isOffline,
      offlineActionMessage,
      notifyInternetRequired,
    }),
    [isOffline, offlineActionMessage, notifyInternetRequired],
  );

  return (
    <NetworkStatusContext.Provider value={value}>
      {children}
    </NetworkStatusContext.Provider>
  );
}

// Hook para usar o contexto de status de rede, fornecendo acesso ao estado de conexão e à função de notificação de necessidade de internet
export function useNetworkStatus() {
  const context = useContext(NetworkStatusContext);

  if (!context) {
    throw new Error(
      "useNetworkStatus deve ser usado dentro de NetworkStatusProvider.",
    );
  }

  return context;
}
