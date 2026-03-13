import React, { useState } from "react";
import { View, Text, Button, StyleSheet } from "react-native";
import { gerarReceita } from "./src/services/gemini";

export default function App() {
  const [receita, setReceita] = useState<string>("");

  async function handleGerarReceita() {
    try {
      const texto = await gerarReceita();
      setReceita(texto);
    } catch (error) {
      console.error("Erro ao gerar receita:", error);
      setReceita("Não foi possível gerar a receita.");
    }
  }

  return (
    <View style={styles.container}>
      <Text style={styles.titulo}>🍳 Quase Chef</Text>
      <Button title="Gerar Receita" onPress={handleGerarReceita} />
      {receita ? <Text style={styles.receita}>{receita}</Text> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
    backgroundColor: "#fff",
  },
  titulo: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
  },
  receita: {
    marginTop: 20,
    fontSize: 16,
    textAlign: "center",
  },
});