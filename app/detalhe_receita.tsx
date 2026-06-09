import { LinearGradient } from "expo-linear-gradient";
import { router, useLocalSearchParams } from "expo-router";
import {
  AlertCircle, AlertTriangle, BarChart3, CheckCircle2, Clock,
  Flame, Heart, Lightbulb, PlayCircle, Share2, WifiOff,
} from "lucide-react-native";
import React, { useEffect, useMemo, useState } from "react";
import {
  ActivityIndicator, Image, Pressable, ScrollView, StatusBar,
  Text, TouchableOpacity, View,
} from "react-native";
import Animated, { FadeInDown, FadeInLeft, FadeInUp, } from "react-native-reanimated";
import { useSafeAreaInsets } from "react-native-safe-area-context";

// Meus imports
import { useAuth } from "@/hooks/useAuth";
import { Header } from "../components/header";
import { ALLERGY_OPTIONS } from "../constants/OpcaoAlimentar";
import { Colors } from "../constants/theme";
import { useCompartilharReceita } from "../hooks/useCompartilharReceita";
import { useDetalheReceita } from "../hooks/useDetalheReceita";
import { useFavoritosGlobal } from "../hooks/useFavoritos";
import { useNetworkStatus } from "../hooks/useNetworkStatus";
import { detalheReceitaStyles as styles } from "../styles/detalhe_receita_styles";
import type { InfoCardProps } from "../types/detalhe_receita";
import { alergiasReceitaQueColidemComUsuario } from "../utils/perfilReceitasFilter";

// Tela de detalhes da receita
export default function DetalheReceitaScreen() {
  const params = useLocalSearchParams();
  const insets = useSafeAreaInsets();

  // Hook principal com lógica de busca
  const {
    receitaDetalhada,
    receitaFavoritoIA,
    rawIngredientsPreparo,
    rawStepsPreparo,
    isIA,
    receitaId,
    isLoading,
    erro,
    retryReceita,
    preferenciasReceita,
    alergiasReceita,
  } = useDetalheReceita();

  // Puxamos as funções globais de favoritos
  const { isFavorito, toggleFavorito } = useFavoritosGlobal();
  const { user } = useAuth();
  const { isOffline, notifyInternetRequired } = useNetworkStatus();

  const { compartilhar, isSharing } = useCompartilharReceita();

  // Estados locais
  const [aiImageUrl, setAiImageUrl] = useState<string | null>(null);
  const [isLoadingImage] = useState(false);
  const [imageFailed, setImageFailed] = useState(false);

  // Determinar if favorito
  const ehFav = isFavorito(receitaId);

  const conflitosAlergias = useMemo(() => {
    const u = user?.allergies?.filter(Boolean).map(String) ?? [];
    const r = alergiasReceita ?? [];
    if (!u.length || !r.length) return [];
    return alergiasReceitaQueColidemComUsuario(u, r);
  }, [user?.allergies, alergiasReceita]);

  const imageSourceUri = useMemo(
    () => aiImageUrl || receitaDetalhada.imagem || "",
    [aiImageUrl, receitaDetalhada.imagem],
  );
  const isOfflineBlockingError =
    !!erro && isOffline && !!receitaId && !isNaN(Number(receitaId));

  // Carregar a imagem (se for receita IA, a imagem pode vir dos params ou ser gerada, para receitas do banco a imagem já vem pronta)
  useEffect(() => {
    let isMounted = true;

    async function fetchImage() {
      const imageParam = params.image as string | undefined;
      if (
        imageParam &&
        (imageParam.startsWith("data:image") || imageParam.startsWith("http"))
      ) {
        if (isMounted) setAiImageUrl(imageParam);
        return;
      }

      // Para receitas não-IA, a imagem vem do banco automaticamente
      if (!isIA) {
        return;
      }
    }

    fetchImage();
    return () => {
      isMounted = false;
    };
  }, [isIA, params.image]);

  useEffect(() => {
    setImageFailed(false);
  }, [imageSourceUri]);

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" />
      {/* Cabeçalho */}
      <Header
        title={isIA ? "Receita gerada por IA" : "Detalhes da Receita"}
        centerTitle
        onBack={() => router.back()}
        showSearch={false}
        rightElement={
          isSharing ? (
            <ActivityIndicator size="small" color={Colors.primary} />
          ) : (
            <TouchableOpacity
              disabled={isLoading || !receitaId}
              onPress={() =>
                compartilhar({
                  id: receitaId,
                  titulo: receitaDetalhada.titulo || "Receita",
                  imagemUrl: imageFailed ? undefined : imageSourceUri,
                })
              }
            >
              <Share2 size={22} color={Colors.primary} />
            </TouchableOpacity>
          )
        }
      />

      {/* Loading inicial ao buscar receita no banco */}
      {isLoading && (
        <View
          style={[
            styles.container,
            { justifyContent: "center", alignItems: "center" },
          ]}
        >
          <ActivityIndicator size="large" color={Colors.secondary} />
          <Text style={{ marginTop: 12, color: Colors.subtext }}>
            Carregando receita...
          </Text>
        </View>
      )}

      {/* Erro ao buscar receita */}
      {erro && !isLoading && (
        <View
          style={[
            styles.container,
            { justifyContent: "center", alignItems: "center", padding: 20 },
          ]}
        >
          <AlertCircle
            size={48}
            color={Colors.secondary}
            style={{ marginBottom: 16 }}
          />
          <Text
            style={{
              fontSize: 16,
              fontWeight: "bold",
              color: Colors.primary,
              textAlign: "center",
              marginBottom: 8,
            }}
          >
            {isOfflineBlockingError
              ? "Conexão necessária para abrir a receita"
              : "Oops! Algo deu errado"}
          </Text>
          <Text
            style={{
              fontSize: 14,
              color: Colors.subtext,
              textAlign: "center",
              marginBottom: 20,
            }}
          >
            {erro}
          </Text>
          {isOfflineBlockingError ? (
            <>
              <WifiOff
                size={18}
                color={Colors.subtext}
                style={{ marginBottom: 12 }}
              />
              <Text
                style={{
                  fontSize: 13,
                  color: Colors.subtext,
                  textAlign: "center",
                  marginBottom: 20,
                }}
              >
                Assim que a internet voltar, toque em tentar novamente.
              </Text>
              <TouchableOpacity
                onPress={() => {
                  if (!notifyInternetRequired("Reconecte-se para abrir esta receita.")) {
                    return;
                  }
                  void retryReceita();
                }}
                style={styles.errorActionButton}
              >
                <Text style={styles.errorActionButtonText}>Tentar novamente</Text>
              </TouchableOpacity>
            </>
          ) : (
            <TouchableOpacity
              onPress={() => {
                void retryReceita();
              }}
              style={styles.errorActionButton}
            >
              <Text style={styles.errorActionButtonText}>Tentar novamente</Text>
            </TouchableOpacity>
          )}
        </View>
      )}

      {/* Conteúdo da receita (renderizado após todos os hooks) */}
      {!isLoading && !erro && (
        <>
          <View style={styles.mainContentWrapper}>
            <ScrollView
              showsVerticalScrollIndicator={false}
              contentContainerStyle={[
                styles.scrollContent,
                { paddingBottom: insets.bottom + 140 },
              ]}
            >
              {/* BLOCO DA IMAGEM ATUALIZADO */}

              {/* 1. Mostra LOADING se for IA e estiver carregando */}
              {isIA && isLoadingImage && (
                <Animated.View
                  entering={FadeInUp.duration(600)}
                  style={[
                    styles.imageHeader,
                    {
                      justifyContent: "center",
                      alignItems: "center",
                      backgroundColor: "#E2E8F0",
                    },
                  ]}
                >
                  <ActivityIndicator size="large" color={Colors.primary} />
                  <Text
                    style={{
                      marginTop: 12,
                      color: Colors.primary,
                      fontWeight: "bold",
                    }}
                  >
                    Cozinhando a foto perfeita...
                  </Text>
                </Animated.View>
              )}

              {/* 2. Mostra a IMAGEM (seja vinda de params ou do banco de dados) */}
              {!!imageSourceUri && !imageFailed && !isLoadingImage && (
                <Animated.View
                  entering={FadeInUp.duration(600)}
                  style={styles.imageHeader}
                >
                  <Image
                    source={{
                      uri: imageSourceUri,
                    }}
                    style={styles.image}
                    onError={() => setImageFailed(true)}
                  />

                  <Animated.View
                    entering={FadeInLeft.delay(500)}
                    style={[
                      styles.badgePopular,
                      {
                        backgroundColor: isIA
                          ? Colors.secondary
                          : Colors.primary,
                      },
                    ]}
                  >
                    <Text style={styles.badgeText}>
                      {isIA ? "Foto Gerada por IA 🤖" : "Sugestão Quase Chef"}
                    </Text>
                  </Animated.View>
                </Animated.View>
              )}

              {/* 3. Mostra o AVISO de IMAGEM INDISPONIVEL */}
              {(!imageSourceUri || imageFailed) && !isLoadingImage && (
                <Animated.View
                  entering={FadeInUp.duration(600)}
                  style={[
                    styles.imageHeader,
                    {
                      justifyContent: "center",
                      alignItems: "center",
                      backgroundColor: "#E2E8F0",
                      paddingHorizontal: 24,
                    },
                  ]}
                >
                  <AlertCircle
                    size={34}
                    color={Colors.primary}
                    style={{ marginBottom: 12 }}
                  />
                  <Text
                    style={{
                      color: Colors.primary,
                      fontWeight: "bold",
                      marginBottom: 6,
                    }}
                  >
                    Imagem indisponível
                  </Text>
                  <Text
                    style={{
                      color: Colors.subtext,
                      textAlign: "center",
                    }}
                  >
                    A receita continua disponível mesmo sem a foto.
                  </Text>
                </Animated.View>
              )}

              {/* BLOCO DO CONTEUDO */}
              <View style={styles.contentCard}>
                <Animated.Text
                  entering={FadeInDown.delay(200)}
                  style={styles.title}
                >
                  {receitaDetalhada.titulo}
                </Animated.Text>
                <Text style={styles.description}>
                  {receitaDetalhada.descricao}
                </Text>

                <View style={styles.infoContainer}>
                  <InfoCard
                    icon={Clock}
                    label="Tempo"
                    value={receitaDetalhada.tempo}
                  />
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

                {conflitosAlergias.length > 0 && (
                  <Animated.View
                    entering={FadeInDown.delay(100)}
                    style={styles.safetyAlertContainer}
                  >
                    <View style={styles.safetyAlertHeader}>
                      <AlertTriangle size={20} color={Colors.warning} />
                      <Text style={styles.safetyAlertTitle}>
                        Alerta de Segurança
                      </Text>
                    </View>
                    <Text style={styles.safetyAlertText}>
                      Esta receita contém ingredientes que podem causar alergia:{" "}
                      <Text style={{ fontWeight: "bold" }}>
                        {conflitosAlergias
                          .map(
                            (a) =>
                              ALLERGY_OPTIONS.find((opt) => opt.key === a)
                                ?.label || a,
                          )
                          .join(", ")}
                      </Text>
                      .
                    </Text>
                  </Animated.View>
                )}

                {/* BLOCO DE INGREDIENTES */}
                <View style={styles.sectionTitleRow}>
                  <Text style={styles.sectionTitle}>Ingredientes</Text>
                  <Text style={styles.itemsCount}>
                    {receitaDetalhada.itensCount} itens
                  </Text>
                </View>

                {receitaDetalhada.ingredientes.map((item, index) => (
                  <Animated.View
                    key={item.id}
                    entering={FadeInLeft.delay(400 + index * 50)}
                    style={[
                      styles.ingredientItem,
                      item.status === "faltando" && styles.ingredientMissing,
                    ]}
                  >
                    {item.status === "faltando" ? (
                      <AlertTriangle size={20} color={Colors.warning} />
                    ) : (
                      <CheckCircle2 size={20} color={Colors.success} />
                    )}
                    <Text style={styles.ingredientText}>{item.nome}</Text>
                  </Animated.View>
                ))}

                {receitaDetalhada.dica_rapida ? (
                  <Animated.View
                    entering={FadeInDown.delay(300)}
                    style={styles.aiTipContainer}
                  >
                    <View style={styles.aiTipHeader}>
                      <Lightbulb size={18} color={Colors.secondary} />
                      <Text style={styles.aiTipTitle}>
                        {isIA ? "Dica da IA!" : "Dica Rápida"}
                      </Text>
                    </View>
                    <Text style={styles.aiTipText}>
                      {receitaDetalhada.dica_rapida}
                    </Text>
                  </Animated.View>
                ) : null}

                {/* BLOCO DE PREPARO */}
                <Text style={styles.preparoTitle}>Modo de preparo</Text>
                {receitaDetalhada.preparo.map((passo, index) => (
                  <View key={index} style={styles.stepItem}>
                    {/* A linha só aparece se não for o último item */}
                    {index !== receitaDetalhada.preparo.length - 1 && (
                      <View style={styles.stepLine} />
                    )}

                    <View style={styles.stepNumber}>
                      <Text style={styles.stepNumberText}>{index + 1}</Text>
                    </View>

                    <Text style={styles.stepText}>{passo.titulo}</Text>
                  </View>
                ))}
              </View>
            </ScrollView>
            <LinearGradient
              colors={["transparent", Colors.background]}
              style={styles.fadeGradient}
              pointerEvents="none"
            />
          </View>

          {/* BLOCO DE FAVORITOS */}
          <View style={[styles.footer, { paddingBottom: insets.bottom + 12 }]}>
            <Pressable
              onPress={() => {
                if (
                  !notifyInternetRequired(
                    "Reconecte-se para favoritar esta receita.",
                  )
                ) {
                  return;
                }

                void toggleFavorito(receitaId, receitaFavoritoIA);
              }}
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
                    id: receitaId,
                    tipo: isIA ? "ia" : "regular",
                    titulo: receitaDetalhada.titulo,
                    time: receitaDetalhada.tempo,
                    difficulty: receitaDetalhada.dificuldade,
                    calories: receitaDetalhada.calorias,
                    description: receitaDetalhada.descricao,
                    imagem: imageFailed ? "" : imageSourceUri,
                    rawIngredients: rawIngredientsPreparo,
                    passosJson: JSON.stringify(receitaDetalhada.preparo),
                    rawSteps: rawStepsPreparo,
                    preferencias: JSON.stringify(preferenciasReceita || []),
                    alergias: JSON.stringify(alergiasReceita || []),
                  },
                })
              }
            >
              <PlayCircle size={22} color={Colors.light} />
              <Text style={styles.mainButtonText}>Iniciar preparo</Text>
            </Pressable>
          </View>
        </>
      )}
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