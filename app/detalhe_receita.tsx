import { LinearGradient } from "expo-linear-gradient";
import { router } from "expo-router";
import {
  AlertCircle, BarChart3, CheckCircle2, Clock, Flame, Heart,
  Lightbulb, PlayCircle, Share2,
} from "lucide-react-native";
import React, { useEffect, useState } from "react";
import {
  ActivityIndicator, Image, Pressable, ScrollView, Share,
  StatusBar, Text, TouchableOpacity, View,
} from "react-native";
import Animated, {
  FadeInDown, FadeInLeft, FadeInUp,
} from "react-native-reanimated";

// Meus imports
import { gerarImagemDaReceita } from "@/services/huggingFaceService";
import { Header } from "../components/header";
import { RECEITA_STRINGS } from "../constants/ingredients";
import { Colors } from "../constants/theme";
import { useDetalheReceita } from "../hooks/useDetalheReceita";
import { useFavoritosGlobal } from "../hooks/useFavoritos";
import { detalheReceitaStyles as styles } from "../styles/detalhe_receita_styles";
import type { InfoCardProps } from "../types/detalhe_receita";

// Tela de detalhes da receita
export default function DetalheReceitaScreen() {
  // Usamos o hook personalizado para gerenciar a lógica
  const { receitaDetalhada, receitaFavoritoIA, isIA, receitaId, isLoading } = useDetalheReceita();

  const { isFavorito, toggleFavorito } = useFavoritosGlobal();
  
  // Adicionamos <string | number> para o TypeScript parar de chorar com o setCurrentId
  const [currentId, setCurrentId] = useState<string | number>(receitaId);
  
  // Simplificamos a checagem, já que o currentId vai ser atualizado!
  const ehFav = isFavorito(currentId);
  
  const [aiImageBase64, setAiImageBase64] = useState<string | null>(null);
  const [isLoadingImage, setIsLoadingImage] = useState(false);

  // --- EFFECT QUE CHAMA A FOTO ASSIM QUE A TELA ABRE ---
  useEffect(() => {
    async function fetchImage() {
      // Se a receita já tem uma imagem válida (seja URL do Supabase ou Base64), não gera outra
      const jaTemImagemValida = receitaDetalhada.imagem && 
        receitaDetalhada.imagem !== RECEITA_STRINGS.IMAGEM_PADRAO;

      if (jaTemImagemValida) {
        setAiImageBase64(receitaDetalhada.imagem);
        return;
      }

      // Só chama a IA se for receita gerada, se tiver título e se já não tiver baixado a imagem
      if (isIA && receitaDetalhada.titulo && !aiImageBase64) {
        setIsLoadingImage(true);
        try {
          const base64 = await gerarImagemDaReceita(receitaDetalhada.titulo);
          if (base64) {
            setAiImageBase64(base64);
          }
        } catch (error) {
          console.error("Erro na tela ao buscar imagem:", error);
        } finally {
          setIsLoadingImage(false);
        }
      }
    }
    fetchImage();
  }, [isIA, receitaDetalhada.titulo, receitaDetalhada.imagem]);

  // CRIADO: Função que clica no coração e pega o novo ID gerado pelo banco
  const handleToggleFavorito = async () => {
    // Se for IA e tivermos uma imagem base64, atualizamos o objeto para salvar com a imagem
    const receitaParaSalvar = isIA && aiImageBase64 
      ? { ...receitaFavoritoIA, image: aiImageBase64 } 
      : receitaFavoritoIA;

    const savedId = await (toggleFavorito as any)(currentId, receitaParaSalvar);
    if (savedId) {
      setCurrentId(String(savedId)); // Atualiza pro ID real do Supabase
    }
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" />
      <Header
        title={isIA ? "Receita gerada por IA" : "Detalhes da Receita"}
        centerTitle
        onBack={() => router.back()}
        showSearch={false}
        rightElement={
          <TouchableOpacity
            onPress={() =>
              Share.share({ message: `Receita de ${receitaDetalhada.titulo}` })
            }
          >
            <Share2 size={22} color={Colors.primary} />
          </TouchableOpacity>
        }
      />

      <View style={styles.mainContentWrapper}>
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.scrollContent}
        >
          {/* BLOCO DA IMAGEM ATUALIZADO */}

          {/* 1. Mostra LOADING se for IA e estiver carregando */}
          {(isIA && isLoadingImage) && (
            <Animated.View
              entering={FadeInUp.duration(600)}
              style={[styles.imageHeader, { justifyContent: 'center', alignItems: 'center', backgroundColor: '#E2E8F0' }]}
            >
              <ActivityIndicator size="large" color={Colors.primary} />
              <Text style={{ marginTop: 12, color: Colors.primary, fontWeight: 'bold' }}>
                Cozinhando a foto perfeita...
              </Text>
            </Animated.View>
          )}

          {/* 2. Mostra a IMAGEM (se for receita normal OU se a foto da IA já carregou) */}
          {(!isIA || aiImageBase64) && !isLoadingImage && (
            <Animated.View
              entering={FadeInUp.duration(600)}
              style={styles.imageHeader}
            >
              <Image
                source={{ uri: isIA ? (aiImageBase64 || "") : receitaDetalhada.imagem }}
                style={styles.image}
              />

              <Animated.View
                entering={FadeInLeft.delay(500)}
                style={[
                  styles.badgePopular,
                  { backgroundColor: isIA ? Colors.secondary : Colors.primary }, // Muda a cor se for IA
                ]}
              >
                <Text style={styles.badgeText}>
                  {isIA ? "Foto Gerada por IA 🤖" : "Sugestão Quase Chef"}
                </Text>
              </Animated.View>
            </Animated.View>
          )}

          <View style={styles.contentCard}>
            {isLoading ? (
              <View style={{ paddingVertical: 24, alignItems: 'center' }}>
                <ActivityIndicator size="large" color={Colors.primary} />
                <Text style={[styles.description, { marginTop: 12, textAlign: 'center' }]}>Carregando detalhes da receita...</Text>
              </View>
            ) : (
              <>
                <Animated.Text
                  entering={FadeInDown.delay(200)}
                  style={styles.title}
                >
                  {receitaDetalhada.titulo}
                </Animated.Text>
                <Text style={styles.description}>{receitaDetalhada.descricao}</Text>

                <View style={styles.infoContainer}>
                  <InfoCard icon={Clock} label="Tempo" value={receitaDetalhada.tempo} />
                  <InfoCard
                    icon={BarChart3}
                    label="Nível"
                    value={receitaDetalhada.dificuldade}
                  />
                  <InfoCard
                    icon={Flame}
                    label="Calorias"
                    value={receitaDetalhada.calorias}
                  />
                </View>

                <View style={styles.sectionTitleRow}>
              <Text style={styles.sectionTitle}>Ingredientes</Text>
              <Text style={styles.itemsCount}>{receitaDetalhada.itensCount} itens</Text>
            </View>

            {receitaDetalhada.ingredientes.map((item, index) => (
              <Animated.View
                key={item.id || index}
                entering={FadeInLeft.delay(400 + index * 50)}
                style={[
                  styles.ingredientItem,
                  item.status === "faltando" && styles.ingredientMissing,
                ]}
              >
                {item.status === "faltando" ? (
                  <AlertCircle size={20} color={Colors.errorDark} />
                ) : (
                  <CheckCircle2 size={20} color={Colors.success} />
                )}
                <Text style={styles.ingredientText}>{item.nome}</Text>
              </Animated.View>
            ))}

            {isIA && (
              <Animated.View
                entering={FadeInDown.delay(300)}
                style={styles.aiTipContainer}
              >
                <View style={styles.aiTipHeader}>
                  <Lightbulb size={18} color={Colors.secondary} />
                  <Text style={styles.aiTipTitle}>Dica da IA!</Text>
                </View>
                <Text style={styles.aiTipText}>{receitaDetalhada.dicaIA}</Text>
              </Animated.View>
            )}

            <Text style={styles.preparoTitle}>Modo de preparo</Text>

            {receitaDetalhada.preparo.map((passo, index) => (
              <View key={index} style={styles.stepItem}>
                <View style={styles.stepNumber}>
                  <Text style={styles.stepNumberText}>{index + 1}</Text>
                </View>
                <Text style={styles.stepText}>{passo.titulo}</Text>
              </View>
            ))}
          </>
        )}
          </View>
        </ScrollView>
        <LinearGradient
          colors={["transparent", Colors.background]}
          style={styles.fadeGradient}
          pointerEvents="none"
        />
      </View>

      <View style={styles.footer}>
        {/* BOTÃO DE FAVORITO ATUALIZADO (agora usa a handleToggleFavorito) */}
        <Pressable
          onPress={handleToggleFavorito}
          style={styles.favButton}
        >
          <Heart
            size={26}
            color={Colors.secondary}
            fill={ehFav ? Colors.secondary : "transparent"}
          />
        </Pressable>

        <Pressable
          style={styles.mainButton}
          onPress={() =>
            router.push({
              pathname: "/preparo_receita",
              params: {
                id: currentId,
                tipo: isIA ? "ia" : "regular",
                titulo: receitaDetalhada.titulo,
                imagem: receitaDetalhada.imagem,
                time: receitaDetalhada.tempo,
                difficulty: receitaDetalhada.dificuldade,
                calories: receitaDetalhada.calorias,
                description: receitaDetalhada.descricao,
                // AQUI É O PULO DO GATO PRA PASSAR AS LISTAS
                ingredientesStr: JSON.stringify(receitaDetalhada.ingredientes),
                preparoStr: JSON.stringify(receitaDetalhada.preparo),
              },
            })
          }
        >
          <PlayCircle size={22} color={Colors.light} />
          <Text style={styles.mainButtonText}>Iniciar preparo</Text>
        </Pressable>
      </View>
    </View>
  );
}

// Sub-componentes mantidos
const InfoCard: React.FC<InfoCardProps> = ({ icon: Icon, label, value }) => (
  <View style={styles.infoCard}>
    <View style={styles.infoIconContainer}>
      <Icon size={18} color={Colors.primary} />
    </View>
    <View>
      <Text style={styles.infoLabel}>{label}</Text>
      <Text style={styles.infoValue}>{value}</Text>
    </View>
  </View>
);