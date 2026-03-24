import { Tabs } from "expo-router";
import { Home, Utensils, Heart, Refrigerator, ListTodo } from "lucide-react-native";
import { Colors, Fonts, Spacing } from "../../constants/theme";

export default function TabsLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: Colors.primary,
        tabBarInactiveTintColor: Colors.subtitle,
        tabBarStyle: {
          height: 80,
          paddingBottom: Spacing.sm,
          paddingTop: Spacing.xs,
          borderTopColor: '#F1F5F9',
          backgroundColor: Colors.light,
          elevation: 0, // Remove sombra no Android
          shadowOpacity: 0, // Remove sombra no iOS
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
          tabBarIcon: ({ color, focused }) => (
            <Home
              size={24}
              color={color}
              fill={focused ? color : "transparent"}
              fillOpacity={0.4}
            />
          )
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
          )
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
          )
        }}
      />
      <Tabs.Screen
        name="dispensa"
        options={{
          title: "Dispensa",
          tabBarIcon: ({ color, focused }) => (
            <Refrigerator
              size={24}
              color={color}
              fill={focused ? color : "transparent"}
              fillOpacity={0.4}
            />
          )
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
          )
        }}
      />
    </Tabs>
  );
}