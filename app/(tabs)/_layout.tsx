import { Tabs } from "expo-router";
import {
  Heart,
  Home,
  ListTodo,
  Refrigerator,
  Utensils,
} from "lucide-react-native";

// Meu import
import { Colors, FontSizes } from "../../constants/theme";

// Layout de tabs para navegação inferior
export default function TabsLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: Colors.primary,
        tabBarInactiveTintColor: Colors.subtitle,
        tabBarLabelStyle: {
          fontSize: FontSizes.small,
          marginTop: -4,
        },
      }}
    >
      <Tabs.Screen
        name="home"
        options={{
          title: "Home",
          tabBarIcon: ({ color, focused }) => (
            <Home
              size={24}
              color={color}
              fill={focused ? color : "transparent"}
              fillOpacity={0.4}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="receitas"
        options={{
          title: "Receitas",
          tabBarIcon: ({ color, focused }) => (
            <Utensils
              size={24}
              color={color}
              fill={focused ? color : "transparent"}
              fillOpacity={0.4}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="favoritos"
        options={{
          title: "Favoritos",
          tabBarIcon: ({ color, focused }) => (
            <Heart
              size={24}
              color={color}
              fill={focused ? color : "transparent"}
              fillOpacity={focused ? 1 : 0}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="despensa"
        options={{
          title: "Despensa",
          tabBarIcon: ({ color, focused }) => (
            <Refrigerator
              size={24}
              color={color}
              fill={focused ? color : "transparent"}
              fillOpacity={0.4}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="lista"
        options={{
          title: "Lista",
          tabBarIcon: ({ color, focused }) => (
            <ListTodo
              size={24}
              color={color}
              fill={focused ? color : "transparent"}
              fillOpacity={focused ? 1 : 0}
            />
          ),
        }}
      />
    </Tabs>
  );
}
