import { Tabs } from "expo-router";
import { Home, Utensils, Heart, Refrigerator, ListTodo } from "lucide-react-native";
import { Colors, Fonts } from "../../constants/theme";

export default function TabsLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: Colors.primary,
        tabBarInactiveTintColor: Colors.subtitle,
        tabBarStyle: {
          height: 70,
          paddingBottom: 10,
          borderTopColor: '#F1F5F9',
        },
        tabBarLabelStyle: {
          fontFamily: Fonts.medium,
          fontSize: 12,
        }
      }}
    >
      <Tabs.Screen
        name="home"
        options={{
          title: "Home",
          tabBarIcon: ({ color }) => <Home size={24} color={color} />
        }}
      />
      <Tabs.Screen
        name="receitas"
        options={{
          title: "Receitas",
          tabBarIcon: ({ color }) => <Utensils size={24} color={color} />
        }}
      />
      <Tabs.Screen
        name="favoritos"
        options={{
          title: "Favoritos",
          tabBarIcon: ({ color }) => <Heart size={24} color={color} />
        }}
      />
      <Tabs.Screen
        name="dispensa"
        options={{
          title: "Dispensa",
          tabBarIcon: ({ color }) => <Refrigerator size={24} color={color} />
        }}
      />
      <Tabs.Screen
        name="lista"
        options={{
          title: "Lista",
          tabBarIcon: ({ color }) => <ListTodo size={24} color={color} />
        }}
      />
    </Tabs>
  );
}