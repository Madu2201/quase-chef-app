import { useEffect, useState } from "react";
import { INGREDIENTES_LIVRES } from "../constants/ingredients";
import { supabase } from "../services/supabase";
import { Ingredient } from "../types/dispensa";
import { TemporaryMode } from "../types/perfil";
import { normalizarBase, normalizarTexto } from "../utils/normalization";

export interface Recipe {
  id: string;
  title: string;
  time: string;
  difficulty: string;
  descStart: string;
  ingredients: string;
  descEnd: string;
  image: string;
  calories: string;
  rawIngredients: string;
  rawSteps: string;
  tags: string[];
  preferences?: string[];
  recipeAllergies?: string[];
  tipo?: string;
}

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

export function useReceitas() {
  const [receitasBanco, setReceitasBanco] = useState<Recipe[]>([]);
  const [carregando, setCarregando] = useState(true);

  useEffect(() => {
    buscarReceitas();
  }, []);

  async function buscarReceitas() {
    try {
      setCarregando(true);
      const { data, error } = await supabase.from("receitas").select("*");

      if (error) {
        console.error("❌ Erro ao buscar as receitas:", error.message);
        return;
      }

      if (data) {
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
          };
        });
        setReceitasBanco(receitasTraduzidas);
      }
    } finally {
      setCarregando(false);
    }
  }

  /**
   * Filtra receitas por categoria/tag
   */
  const filtrarPorCategoria = (
    receitas: Recipe[],
    categoria: string,
  ): Recipe[] => {
    if (categoria === "Todas") return receitas;
    return receitas.filter((r) => r.tags?.includes(categoria));
  };

  /**
   * Filtra receitas por texto de busca (título ou ingredientes)
   */
  const filtrarPorBusca = (receitas: Recipe[], busca: string): Recipe[] => {
    if (!busca.trim()) return receitas;
    const termoBusca = normalizarTexto(busca);
    return receitas.filter(
      (r) =>
        normalizarTexto(r.title).includes(termoBusca) ||
        normalizarTexto(r.rawIngredients).includes(termoBusca),
    );
  };

  const shouldApplyPreferences = (modo?: TemporaryMode | null) => {
    if (modo === "paused") return false;

    if (modo === "weekends_only") {
      const dia = new Date().getDay();
      return dia === 0 || dia === 6;
    }

    return true;
  };

  const filtrarPorPerfil = (
    receitas: Recipe[],
    foodPreferences?: string[] | null,
    allergies?: string[] | null,
    temporaryMode?: TemporaryMode | null,
  ): Recipe[] => {
    if (!receitas || receitas.length === 0) return receitas;

    const aplicarPreferencias = shouldApplyPreferences(temporaryMode);

    const preferenciasUsuario = aplicarPreferencias
      ? (foodPreferences || []).filter(Boolean).map((item) => normalizarTexto(String(item)))
      : [];

    const alergiasUsuario = (allergies || [])
      .filter(Boolean)
      .map((item) => normalizarTexto(String(item)));

    return receitas.filter((receita) => {
      const preferenciasReceita = normalizarLista(receita.preferences);
      const alergiasReceita = normalizarLista(receita.recipeAllergies);

      if (alergiasUsuario.length > 0) {
        const temAlergia = alergiasUsuario.some((alergiaUsuario) =>
          alergiasReceita.some(
            (alergiaReceita) => normalizarTexto(alergiaReceita) === alergiaUsuario,
          ),
        );
        if (temAlergia) return false;
      }

      if (preferenciasUsuario.length === 0) return true;
      if (preferenciasReceita.length === 0) return false;

      return preferenciasUsuario.every((prefUsuario) =>
        preferenciasReceita.some(
          (prefReceita) => normalizarTexto(prefReceita) === prefUsuario,
        ),
      );
    });
  };

  /**
   * Filtra receitas que o usuário consegue fazer com seu estoque
   * Usa tolerância de 10% na quantidade
   */
  const filtrarPorEstoque = (
    receitas: Recipe[],
    dispensaIngredientes: Ingredient[],
  ): Recipe[] => {
    if (dispensaIngredientes.length === 0) return [];

    return receitas.filter((receita) => {
      try {
        const ingredientesDaReceita = JSON.parse(
          receita.rawIngredients || "[]",
        );

        return ingredientesDaReceita.every((ingRecObj: any) => {
          const textoIngrediente =
            ingRecObj.nome_base || ingRecObj.texto_original || "";
          const ingRecNormalizado = normalizarTexto(textoIngrediente);

          // Regra A: É ingrediente livre?
          const ehLivre = INGREDIENTES_LIVRES.some((livre) =>
            ingRecNormalizado.includes(normalizarTexto(livre)),
          );
          if (ehLivre) return true;

          // Regra B: Existe na dispensa (marcado como ativo)?
          const itemNoEstoque = dispensaIngredientes.find((itemDispensa) => {
            if (!itemDispensa.selected) return false;
            const nomeDispNormalizado = normalizarTexto(itemDispensa.name);
            return (
              ingRecNormalizado.includes(nomeDispNormalizado) ||
              nomeDispNormalizado.includes(ingRecNormalizado)
            );
          });

          if (!itemNoEstoque) return false;

          // Regra C: Matemática dos 10% de Tolerância
          const qtdReceitaRaw = Number(ingRecObj.quantidade) || 0;
          const unidReceita = ingRecObj.unidade || "un";
          const reqGramasMl_IA = Number(ingRecObj.quantidade_gramas_ml) || 0;

          const qtdDispensa = Number(itemNoEstoque.qty) || 0;
          const unidDispensa = itemNoEstoque.unit || "un";

          const baseReceita = normalizarBase(qtdReceitaRaw, unidReceita);
          const baseDispensa = normalizarBase(qtdDispensa, unidDispensa);

          // Cenário 1: Tudo é contabilizado em "Unidades"
          if (
            baseReceita.tipo === "unidade" &&
            baseDispensa.tipo === "unidade"
          ) {
            return baseDispensa.valor >= baseReceita.valor * 0.9;
          }

          // Cenário 2: A Receita pede Massa/Volume (usando conversão da IA)
          if (baseDispensa.tipo === "massa_volume" && reqGramasMl_IA > 0) {
            return baseDispensa.valor >= reqGramasMl_IA * 0.9;
          }

          // Cenário 3: Inconpatibilidade - confia que o usuário tem suficiente
          return true;
        });
      } catch (e) {
        console.error(`❌ Erro ao filtrar receita ${receita.title}:`, e);
        return false;
      }
    });
  };

  return {
    receitasBanco,
    carregando,
    filtrarPorCategoria,
    filtrarPorBusca,
    filtrarPorPerfil,
    filtrarPorEstoque,
  };
}
