import { INGREDIENTES_LIVRES } from "../constants/ingredients";
import { useDispensa } from "../hooks/useDispensa";
import { Recipe } from "../hooks/useReceitas";
import { normalizarBase, normalizarTexto } from "../utils/normalization";

export function useFiltroEstoque() {
  const { ingredients: dispensaIngredientes } = useDispensa();

  const filtrarPorEstoque = (receitas: Recipe[]): Recipe[] => {
    if (dispensaIngredientes.length === 0) return [];

    return receitas.filter((receita) => {
      try {
        const ingredientesDaReceita = JSON.parse(
          receita.rawIngredients || "[]"
        );

        return ingredientesDaReceita.every((ingRecObj: any) => {
          const textoIngrediente =
            ingRecObj.nome_base || ingRecObj.texto_original || "";
          const ingRecNormalizado = normalizarTexto(textoIngrediente);

          // Regra A: É ingrediente livre?
          const ehLivre = INGREDIENTES_LIVRES.some((livre) =>
            ingRecNormalizado.includes(normalizarTexto(livre))
          );
          if (ehLivre) return true;

          // Regra B: Existe na dispensa?
          // O checkbox da dispensa é usado apenas para selecionar ingredientes para IA,
          // não deve afetar o filtro de receitas por estoque.
          const itemNoEstoque = dispensaIngredientes.find((itemDispensa) => {
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

          if (baseReceita.tipo === "unidade" && baseDispensa.tipo === "unidade") {
            return baseDispensa.valor >= baseReceita.valor * 0.9;
          }

          if (baseDispensa.tipo === "massa_volume" && reqGramasMl_IA > 0) {
            return baseDispensa.valor >= reqGramasMl_IA * 0.9;
          }

          return true;
        });
      } catch (e) {
        console.error(`❌ Erro ao filtrar receita ${receita.title}:`, e);
        return false;
      }
    });
  };

  return { filtrarPorEstoque };
}