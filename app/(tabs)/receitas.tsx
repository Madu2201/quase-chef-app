import { View, Text, FlatList } from "react-native";
import Header from "../../components/header";

const receitas = [
  { id: "1", nome: "Arroz com legumes" },
  { id: "2", nome: "Macarrão ao alho e óleo" },
  { id: "3", nome: "Salada tropical" },
  { id: "4", nome: "Sopa de abóbora" },
];

export default function ReceitasScreen() {
  return (
    <View style={{ flex: 1, backgroundColor: "#FFF3E8" }}>
      <Header title="Receitas" />

      <FlatList
        contentContainerStyle={{ padding: 20 }}
        data={receitas}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View
            style={{
              padding: 12,
              marginBottom: 8,
              backgroundColor: "#ffffff",
              borderRadius: 8,
              borderWidth: 1,
              borderColor: "#94A3B8",
            }}
          >
            <Text style={{ fontSize: 18, color: "#475569" }}>{item.nome}</Text>
          </View>
        )}
      />
    </View>
  );
}