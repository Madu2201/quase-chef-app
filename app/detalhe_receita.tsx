import { LinearGradient } from "expo-linear-gradient";
import { router } from "expo-router";
import {
  AlertCircle,
  BarChart3,
  CheckCircle2,
  Clock,
  Flame,
  Heart,
  Lightbulb,
  PlayCircle,
  Share2,
} from "lucide-react-native";
import React from "react";
import {
  Image,
  Pressable,
  ScrollView,
  Share,
  StatusBar,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import Animated, {
  FadeInDown,
  FadeInLeft,
  FadeInUp,
} from "react-native-reanimated";

// Meus imports
import { Header } from "../components/header";
import { Colors } from "../constants/theme";
import { detalheReceitaStyles as styles } from "../styles/detalhe_receita_styles";
import { useDetalheReceita } from "../hooks/useDetalheReceita";
import { useFavoritosGlobal } from "../hooks/useFavoritos";
import type { InfoCardProps } from "../types/detalhe_receita";

// Tela de detalhes da receita
export default function DetalheReceitaScreen() {
  // Usamos o hook personalizado para gerenciar a lógica
  const { receitaDetalhada, receitaFavoritoIA, isIA, receitaId } = useDetalheReceita();

  // Puxamos as funções globais de favoritos
  const { isFavorito, toggleFavorito } = useFavoritosGlobal();
  const ehFav = isFavorito(receitaId);

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
          {!isIA && (
            <Animated.View
              entering={FadeInUp.duration(600)}
              style={styles.imageHeader}
            >
              <Image source={{ uri: receitaDetalhada.imagem }} style={styles.image} />
              <Animated.View
                entering={FadeInLeft.delay(500)}
                style={[
                  styles.badgePopular,
                  { backgroundColor: Colors.primary },
                ]}
              >
                <Text style={styles.badgeText}>Sugestão Quase Chef</Text>
              </Animated.View>
            </Animated.View>
          )}

          <View style={styles.contentCard}>
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
                key={item.id}
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
          </View>
        </ScrollView>
        <LinearGradient
          colors={["transparent", Colors.background]}
          style={styles.fadeGradient}
          pointerEvents="none"
        />
      </View>

      <View style={styles.footer}>
        {/* BOTÃO DE FAVORITO ATUALIZADO PARA USAR O HOOK GLOBAL */}
        <Pressable
          onPress={() => toggleFavorito(receitaId, receitaFavoritoIA)}
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
                imagem: receitaDetalhada.imagem,
                time: receitaDetalhada.tempo,
                difficulty: receitaDetalhada.dificuldade,
                calories: receitaDetalhada.calorias,
                description: receitaDetalhada.descricao,
                rawIngredients: JSON.stringify(receitaDetalhada.ingredientes),
                passosJson: JSON.stringify(receitaDetalhada.preparo),
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
