import { useEffect, useState } from 'react';
import { supabase } from '../services/supabase';

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
  tags: string[]; // <-- Nova propriedade!
}

export function useReceitas() {
  const [receitasBanco, setReceitasBanco] = useState<Recipe[]>([]);
  const [carregando, setCarregando] = useState(true);

  useEffect(() => {
    buscarReceitas();
  }, []);

  async function buscarReceitas() {
    try {
      setCarregando(true);
      const { data, error } = await supabase.from('receitas').select('*');

      if (error) {
        console.log('🚨 Deu erro ao buscar as receitas:', error.message);
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
            ingredients: '', 
            descEnd: '',
            image: item.imagem_url,
            calories: item.calorias || '0 kcal',
            rawIngredients: JSON.stringify(item.ingredientes || []),
            rawSteps: JSON.stringify(item.passos_detalhados || []),
            tags: item.tags || [] // <-- Puxando as tags do banco!
          };
        });
        setReceitasBanco(receitasTraduzidas);
      }
    } finally {
      setCarregando(false);
    }
  }

  return { receitasBanco, carregando };
}