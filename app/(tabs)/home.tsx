import { View, Text } from "react-native";
import Header from "../../components/header";

export default function HomeScreen() {
  return (
    <View style={{ flex: 1, backgroundColor: "#FFF3E8" }}>
      <Header title="Home" />

      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <Text style={{ fontSize: 24, fontWeight: "bold", color: "#f88b3d" }}>
          Página Inicial
        </Text>
      </View>
    </View>
  );
}