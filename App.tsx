import React from "react";
import { Text, View, StyleSheet, Dimensions, Image, TouchableOpacity } from "react-native";
import { NavigationContainer } from "@react-navigation/native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { createNativeStackNavigator, NativeStackScreenProps } from "@react-navigation/native-stack";
import { Home, Settings, Utensils, ChefHat } from "lucide-react-native";
import { StatusBar } from "expo-status-bar";
import { GestureHandlerRootView, GestureDetector, Gesture } from "react-native-gesture-handler";
import Animated, { useSharedValue, useAnimatedStyle, withSpring, interpolateColor, useDerivedValue } from "react-native-reanimated";

const { width } = Dimensions.get("window");

// --- TIPAGEM ---
type RecipeStackParamList = {
  Carrossel: undefined;
  Detalhe: { recipe: { title: string; desc: string; ingredients?: string[] } };
};

// --- DADOS ---
const recipes = [
  { title: "Bem-vindo ao Quase Chef!", desc: "Arraste para o lado para explorar receitas incríveis", isWelcome: true },
  { title: "🍊 Suco de Laranja", desc: "Refrescante e natural para o seu café da manhã.", ingredients: ["3 Laranjas", "Gelo", "Açúcar a gosto"] },
  { title: "🥗 Salada Tropical", desc: "Uma mistura leve de frutas e folhas verdes.", ingredients: ["Alface", "Manga em cubos", "Molho de mostarda e mel"] },
];

// --- TELAS ---
function CarrosselScreen({ navigation }: NativeStackScreenProps<RecipeStackParamList, "Carrossel">) {
  const translateX = useSharedValue(0);
  const currentIndex = useSharedValue(0);

  const panGesture = Gesture.Pan()
    .onUpdate((event) => {
      translateX.value = -currentIndex.value * width + event.translationX;
    })
    .onEnd((event) => {
      const moved = event.translationX;
      if (moved < -width / 4 && currentIndex.value < recipes.length - 1) {
        currentIndex.value += 1;
      } else if (moved > width / 4 && currentIndex.value > 0) {
        currentIndex.value -= 1;
      }
      translateX.value = withSpring(-currentIndex.value * width);
    });

  const animatedContainerStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: translateX.value }],
  }));

  return (
    <GestureHandlerRootView style={{ flex: 1, backgroundColor: '#FFF' }}>
      <GestureDetector gesture={panGesture}>
        <Animated.View style={[{ flexDirection: "row", flex: 1 }, animatedContainerStyle]}>
          {recipes.map((recipe, i) => (
            <View key={i} style={styles.card}>
              {recipe.isWelcome ? (
                <Image source={require('./assets/logo.jpeg')} style={styles.mainLogo} />
              ) : (
                <Utensils stroke="#FF8C00" size={64} />
              )}
              <Text style={styles.title}>{recipe.title}</Text>
              <Text style={styles.desc}>{recipe.desc}</Text>
              {!recipe.isWelcome && (
                <TouchableOpacity 
                  style={styles.detailButton}
                  onPress={() => navigation.navigate("Detalhe", { recipe: recipe as any })}
                >
                  <Text style={styles.detailButtonText}>Ver Receita Completa</Text>
                </TouchableOpacity>
              )}
            </View>
          ))}
        </Animated.View>
      </GestureDetector>
      
      {/* Indicadores de Página */}
      <View style={styles.indicators}>
        {recipes.map((_, i) => (
          <View key={i} style={[styles.dot, { opacity: 1, backgroundColor: '#FF8C00' }]} />
        ))}
      </View>
    </GestureHandlerRootView>
  );
}

function RecipeDetailScreen({ route }: NativeStackScreenProps<RecipeStackParamList, "Detalhe">) {
  const { recipe } = route.params;
  return (
    <View style={styles.detailContainer}>
      <ChefHat stroke="#FF8C00" size={80} style={{ marginBottom: 20 }} />
      <Text style={styles.detailTitle}>{recipe.title}</Text>
      <Text style={styles.detailDesc}>{recipe.desc}</Text>
      {recipe.ingredients && (
        <View style={styles.ingredientsBox}>
          <Text style={styles.ingredientsTitle}>Ingredientes:</Text>
          {recipe.ingredients.map((ing, idx) => (
            <Text key={idx} style={styles.ingredientItem}>• {ing}</Text>
          ))}
        </View>
      )}
    </View>
  );
}

function SettingsScreen() {
  return (
    <View style={styles.container}>
      <Settings stroke="#FF8C00" size={60} />
      <Text style={styles.title}>Configurações</Text>
      <Text style={{ color: '#666' }}>Versão 1.0.0 - Duda Rodrigues</Text>
    </View>
  );
}

// --- NAVEGAÇÃO ---
const Stack = createNativeStackNavigator<RecipeStackParamList>();
function RecipeStack() {
  return (
    <Stack.Navigator screenOptions={{ animation: "slide_from_right", headerTintColor: '#FF8C00' }}>
      <Stack.Screen name="Carrossel" component={CarrosselScreen} options={{ headerShown: false }} />
      <Stack.Screen name="Detalhe" component={RecipeDetailScreen} options={{ title: "Modo de Preparo" }} />
    </Stack.Navigator>
  );
}

const Tab = createBottomTabNavigator();
export default function App() {
  return (
    <NavigationContainer>
      <StatusBar style="dark" />
      <Tab.Navigator
        screenOptions={({ route }) => ({
          tabBarActiveTintColor: "#FF8C00",
          tabBarInactiveTintColor: "#666",
          headerShown: true,
          headerTitleStyle: { color: '#FF8C00', fontWeight: 'bold' },
          tabBarIcon: ({ color, size }) => {
            if (route.name === "Receitas") return <Home stroke={color} size={size} />;
            if (route.name === "Configurações") return <Settings stroke={color} size={size} />;
          },
        })}
      >
        <Tab.Screen name="Receitas" component={RecipeStack} />
        <Tab.Screen name="Configurações" component={SettingsScreen} />
      </Tab.Navigator>
    </NavigationContainer>
  );
}

// --- ESTILOS ---
const styles = StyleSheet.create({
  card: { width, justifyContent: "center", alignItems: "center", backgroundColor: "#fff", padding: 30 },
  mainLogo: { width: 160, height: 160, borderRadius: 80, marginBottom: 20, borderWidth: 4, borderColor: '#FF8C00' },
  title: { fontSize: 26, marginTop: 20, color: "#FF8C00", fontWeight: "bold", textAlign: 'center' },
  desc: { fontSize: 16, marginTop: 15, color: "#555", textAlign: 'center', lineHeight: 22 },
  detailButton: { marginTop: 30, backgroundColor: '#FF8C00', paddingVertical: 12, paddingHorizontal: 25, borderRadius: 25 },
  detailButtonText: { color: '#FFF', fontWeight: 'bold', fontSize: 16 },
  container: { flex: 1, justifyContent: "center", alignItems: "center", backgroundColor: '#FFF' },
  detailContainer: { flex: 1, padding: 25, backgroundColor: '#FFF', alignItems: 'center', justifyContent: 'center' },
  detailTitle: { fontSize: 28, fontWeight: 'bold', color: '#FF8C00', marginBottom: 15 },
  detailDesc: { fontSize: 18, color: '#444', textAlign: 'center', marginBottom: 30 },
  ingredientsBox: { alignSelf: 'stretch', backgroundColor: '#FFF4E6', padding: 20, borderRadius: 15 },
  ingredientsTitle: { fontSize: 20, fontWeight: 'bold', color: '#FF8C00', marginBottom: 10 },
  ingredientItem: { fontSize: 16, color: '#555', marginBottom: 5 },
  indicators: { flexDirection: "row", justifyContent: "center", marginBottom: 30 },
  dot: { width: 12, height: 12, borderRadius: 6, marginHorizontal: 6 },
});