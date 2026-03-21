import { View, Text, Pressable } from "react-native";
import { router } from "expo-router";
import { User } from "lucide-react-native"; // ícone de perfil

export default function Header({ title }: { title: string }) {
  return (
    <View
      style={{
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        paddingHorizontal: 16,
        paddingVertical: 12,
        backgroundColor: "#FFF3E8",
        borderBottomWidth: 1,
        borderBottomColor: "#94A3B8",
      }}
    >
      <Text style={{ fontSize: 20, fontWeight: "bold", color: "#f88b3d" }}>
        {title}
      </Text>

      <Pressable onPress={() => router.push("/perfil")}>
        <User color="#f88b3d" size={28} />
      </Pressable>
    </View>
  );
}