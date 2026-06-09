import React, {
  createContext, useCallback, useContext, useEffect, useMemo, useRef, useState,
} from "react";
import { DeviceEventEmitter } from "react-native";

// Meus imports
import { MESSAGES } from "../constants/messages";
import { RECEITAS_CATALOGO_ATUALIZAR } from "../services/receitaEvents";
import { supabase } from "../services/supabase";
import { TemporaryMode } from "../types/perfil";
import type { ReceitasContextValue, Recipe } from "../types/receitas";
import { normalizarTexto } from "../utils/normalization";
import {
  modoPerfilAplicaPreferencias,
  receitaBloqueadaPorAlergia,
  receitaPassaUniaoPreferencias,
} from "../utils/perfilReceitasFilter";
import { useAuth } from "./useAuth";
import { useFiltroEstoque } from "./useFiltroEstoque";
import { useNetworkStatus } from "./useNetworkStatus";

// Normaliza uma lista de strings, seja ela um array ou uma string JSON
const normalizarLista = (valor: unknown): string[] => {
  if (Array.isArray(valor)) {
    return valor.filter(Boolean).map((item) => String(item).trim());
  }

  if (typeof valor === "string") {
    try {
      const parsed = JSON.parse(valor);
      if (Array.isArray(parsed)) {
        return parsed.filter(Boolean).map((item) => String(item).trim());
      }
    } catch {
      const texto = valor.trim();
      return texto ? [texto] : [];
    }
  }

  return [];
};

// Filtra receitas por categoria (tag)
export function filtrarPorCategoria(
  receitas: Recipe[],
  categoria: string,
): Recipe[] {
  if (!Array.isArray(receitas)) return [];
  if (!categoria || categoria === "Todas") return receitas;
  return receitas.filter((r) => r.tags && Array.isArray(r.tags) && r.tags.includes(categoria));
}

// Filtra receitas por busca (título e ingredientes)
export function filtrarPorBusca(receitas: Recipe[], busca: string): Recipe[] {
  if (!Array.isArray(receitas)) return [];
  if (!busca || !busca.trim()) return receitas;
  const termoBusca = normalizarTexto(busca);
  return receitas.filter(
    (r) =>
      (r.title && normalizarTexto(r.title).includes(termoBusca)) ||
      (r.rawIngredients && normalizarTexto(r.rawIngredients).includes(termoBusca)),
  );
}

// Filtra receitas por perfil do usuário (preferências alimentares e alergias)
export function filtrarPorPerfil(
  receitas: Recipe[],
  foodPreferences?: string[] | null,
  allergies?: string[] | null,
  temporaryMode?: TemporaryMode | null,
): Recipe[] {
  if (!Array.isArray(receitas) || receitas.length === 0) return receitas;

  const aplicarPreferencias = modoPerfilAplicaPreferencias(temporaryMode);

  const preferenciasUsuario = (foodPreferences || [])
    .filter(Boolean)
    .map((item) => String(item).trim());

  const alergiasUsuario = (allergies || [])
    .filter(Boolean)
    .map((item) => String(item).trim());

  return receitas.filter((receita) => {
    const preferenciasReceita = normalizarLista(receita.preferences);
    const alergiasReceita = normalizarLista(receita.recipeAllergies);

    if (receitaBloqueadaPorAlergia(alergiasUsuario, alergiasReceita)) {
      return false;
    }

    if (!aplicarPreferencias) {
      return true;
    }

    return receitaPassaUniaoPreferencias(
      preferenciasUsuario,
      preferenciasReceita,
    );
  });
}

const ReceitasContext = createContext<ReceitasContextValue | null>(null);

// Provedor de receitas, responsável por buscar e armazenar as receitas do banco, além de fornecer funções de filtragem
export function ReceitasProvider({ children }: { children: React.ReactNode }) {
  const [receitasBanco, setReceitasBanco] = useState<Recipe[]>([]);
  const [carregando, setCarregando] = useState(true);
  const { isOffline, notifyInternetRequired } = useNetworkStatus();

  const buscarReceitas = useCallback(async (notifyOnOffline = false) => {
    if (isOffline) {
      if (notifyOnOffline) {
        notifyInternetRequired(MESSAGES.OFFLINE_UPDATE_CATALOG);
      }
      setCarregando(false);
      return;
    }

    try {
      setCarregando(true);
      const { data, error } = await supabase.from("receitas").select("*");

      if (error) {
        console.error("❌ Erro ao buscar as receitas:", error.message);
        setReceitasBanco([]);
        return;
      }

      if (data && Array.isArray(data)) {
        const receitasTraduzidas = data.map((item, index) => {
          return {
            id: String(item.id || index),
            title: item.nome_receita,
            time: item.tempo_preparo,
            difficulty: item.dificuldade,
            descStart: item.descricao_simples_preparo,
            ingredients: "",
            descEnd: "",
            image: item.imagem_url,
            calories: item.calorias || "0 kcal",
            rawIngredients: JSON.stringify(item.ingredientes || []),
            rawSteps: JSON.stringify(item.passos_detalhados || []),
            tags: item.tags || (item.eh_ia ? ["IA"] : []),
            preferences: normalizarLista(item.preferencias),
            recipeAllergies: normalizarLista(item.alergias_presentes),
            tipo: item.eh_ia ? "ia" : undefined,
            dica_rapida: item.dica_rapida,
            pre_visualizacao: item.pre_visualizacao_passos,
          };
        });
        setReceitasBanco(receitasTraduzidas);
      } else {
        setReceitasBanco([]);
      }
    } catch (err) {
      console.error("❌ Erro crítico ao buscar receitas:", err);
      setReceitasBanco([]);
    } finally {
      setCarregando(false);
    }
  }, [isOffline, notifyInternetRequired]);

  // Busca as receitas ao montar o componente e quando o evento de atualização for emitido
  useEffect(() => {
    void buscarReceitas();
  }, [buscarReceitas]);

  // Busca as receitas quando o evento de atualização for emitido
  useEffect(() => {
    const sub = DeviceEventEmitter.addListener(
      RECEITAS_CATALOGO_ATUALIZAR,
      () => {
        void buscarReceitas();
      },
    );
    return () => sub.remove();
  }, [buscarReceitas]);

  const refreshReceitas = useCallback(() => {
    void buscarReceitas(true);
  }, [buscarReceitas]);

  const value = useMemo<ReceitasContextValue>(
    () => ({
      receitasBanco,
      carregando,
      refreshReceitas,
      filtrarPorCategoria,
      filtrarPorBusca,
      filtrarPorPerfil,
    }),
    [receitasBanco, carregando, refreshReceitas],
  );

  return (
    <ReceitasContext.Provider value={value}>{children}</ReceitasContext.Provider>
  );
}

// Hook para usar o provedor de receitas
export function useReceitas(): ReceitasContextValue {
  const ctx = useContext(ReceitasContext);
  if (!ctx) {
    throw new Error("useReceitas deve ser usado dentro de ReceitasProvider");
  }
  return ctx;
}

const PAGE_SIZE = 30;

// Hook para obter a lista de receitas filtrada por busca, categoria, perfil e estoque, com suporte a paginação e carregamento incremental
export function useReceitasList() {
  const { receitasBanco, carregando, filtrarPorCategoria, filtrarPorBusca, filtrarPorPerfil } = useReceitas();
  const { filtrarPorEstoque } = useFiltroEstoque();
  const { user } = useAuth();

  const [busca, setBusca] = useState("");
  const [usarEstoque, setUsarEstoque] = useState(false);
  const [filtro, setFiltro] = useState("Todas");
  const [page, setPage] = useState(1);
  const [hasMounted, setHasMounted] = useState(false);
  const onEndReachedCalledDuringMomentum = useRef(true);

  const receitasFiltradas = useMemo(() => {
    try {
      let filtradas = Array.isArray(receitasBanco) ? receitasBanco : [];

      filtradas = filtrarPorPerfil(
        filtradas,
        user?.food_preferences,
        user?.allergies,
        user?.temporaryMode,
      );

      filtradas = filtrarPorCategoria(filtradas, filtro);
      filtradas = filtrarPorBusca(filtradas, busca);

      if (usarEstoque) {
        filtradas = filtrarPorEstoque(filtradas);
      }

      return filtradas;
    } catch (err) {
      console.error("❌ Erro ao filtrar receitas:", err);
      return [];
    }
  }, [receitasBanco, busca, filtro, usarEstoque, filtrarPorCategoria, filtrarPorBusca, filtrarPorEstoque, filtrarPorPerfil, user?.food_preferences, user?.allergies, user?.temporaryMode]);

  const totalReceitasEncontradas = receitasFiltradas.length;
  const receitasExibidas = useMemo(
    () => receitasFiltradas.slice(0, page * PAGE_SIZE),
    [receitasFiltradas, page],
  );
  const podeCarregarMais = receitasExibidas.length < totalReceitasEncontradas;

  useEffect(() => {
    setHasMounted(true);
  }, []);

  useEffect(() => {
    setPage(1);
    onEndReachedCalledDuringMomentum.current = true;
  }, [busca, filtro, usarEstoque]);


  // Funções de carregamento incremental
  const handleLoadMore = useCallback(() => {
    if (!podeCarregarMais) return;
    setPage((prevPage) => Math.min(prevPage + 1, Math.ceil(totalReceitasEncontradas / PAGE_SIZE)));
  }, [podeCarregarMais, totalReceitasEncontradas]);

  const handleMomentumScrollBegin = useCallback(() => {
    onEndReachedCalledDuringMomentum.current = false;
  }, []);

  const handleEndReached = useCallback(() => {
    if (!onEndReachedCalledDuringMomentum.current) {
      handleLoadMore();
      onEndReachedCalledDuringMomentum.current = true;
    }
  }, [handleLoadMore]);

  return {
    busca,
    setBusca,
    usarEstoque,
    setUsarEstoque,
    filtro,
    setFiltro,
    receitasFiltradas,
    receitasExibidas,
    totalReceitasEncontradas,
    carregando,
    podeCarregarMais,
    hasMounted,
    handleEndReached,
    handleMomentumScrollBegin,
  };
}