import * as Network from "expo-network";
import React, {
    createContext,
    ReactNode,
    useContext,
    useEffect,
    useMemo,
    useRef,
    useState,
} from "react";

type NetworkStatusContextValue = {
  isOffline: boolean;
  offlineActionMessage: string | null;
  notifyInternetRequired: (message?: string) => boolean;
};

const NetworkStatusContext = createContext<NetworkStatusContextValue | null>(null);
const DEFAULT_OFFLINE_ACTION_MESSAGE =
  "Reconecte-se a internet para usar esta função.";

function resolveIsOffline(networkState: Network.NetworkState): boolean {
  return (
    networkState.isConnected === false ||
    networkState.isInternetReachable === false
  );
}

type NetworkStatusProviderProps = {
  children: ReactNode;
};

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

  const notifyInternetRequired = (message?: string) => {
    if (!isOffline) {
      return true;
    }

    setOfflineActionMessage(message || DEFAULT_OFFLINE_ACTION_MESSAGE);

    if (offlineMessageTimeoutRef.current) {
      clearTimeout(offlineMessageTimeoutRef.current);
    }

    offlineMessageTimeoutRef.current = setTimeout(() => {
      setOfflineActionMessage(null);
    }, 3500);

    return false;
  };

  const value = useMemo(
    () => ({
      isOffline,
      offlineActionMessage,
      notifyInternetRequired,
    }),
    [isOffline, offlineActionMessage],
  );

  return (
    <NetworkStatusContext.Provider value={value}>
      {children}
    </NetworkStatusContext.Provider>
  );
}

export function useNetworkStatus() {
  const context = useContext(NetworkStatusContext);

  if (!context) {
    throw new Error(
      "useNetworkStatus deve ser usado dentro de NetworkStatusProvider.",
    );
  }

  return context;
}
