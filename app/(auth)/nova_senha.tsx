import React, { useState } from "react";
import {
  View, Text, TextInput, Pressable, Alert, ActivityIndicator, ScrollView, KeyboardAvoidingView, Platform
} from "react-native";
import { router, useLocalSearchParams } from "expo-router";
import { Lock, KeyRound } from "lucide-react-native";

import { authStyles as styles } from "../../styles/auth_styles";
import { Colors } from "../../constants/theme";
import { supabase } from "@/services/supabase";

export default function NovaSenhaScreen() {
  const { email } = useLocalSearchParams(); // Pega o e-mail da tela anterior
  
  const [codigo, setCodigo] = useState("");
  const [novaSenha, setNovaSenha] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSalvarNovaSenha() {
    if (!codigo || !novaSenha) {
      Alert.alert("Atenção", "Preencha o código e a nova senha.");
      return;
    }

    setLoading(true);

    try {
      // 1. Busca o usuário com o e-mail e verifica se o código bate
      const { data: usuario, error: erroBusca } = await supabase
        .from('users')
        .select('id, reset_token, reset_token_expires')
        .eq('email', email)
        .single();

      if (erroBusca || !usuario) {
        throw new Error("Erro ao validar conta.");
      }

      // 2. Validações de segurança
      if (usuario.reset_token !== codigo.trim()) {
        Alert.alert("Erro", "Código incorreto.");
        setLoading(false);
        return;
      }

      const agora = new Date().toISOString();
      if (usuario.reset_token_expires < agora) {
        Alert.alert("Erro", "Este código expirou. Solicite um novo.");
        setLoading(false);
        return;
      }

      // 3. Atualiza a senha na tabela e limpa o código
      const { error: erroUpdate } = await supabase
        .from('users')
        .update({
          password_hash: novaSenha, // <--- O SEGREDO ESTAVA AQUI!
          reset_token: null,   
          reset_token_expires: null
        })
        .eq('id', usuario.id);

      if (erroUpdate) throw new Error("Erro ao atualizar a senha.");

      Alert.alert("Sucesso!", "Sua senha foi alterada. Você já pode fazer login.");
      router.replace("/(auth)/login");

    } catch (error: any) {
      Alert.alert("Ops", "Algo deu errado. Verifique o código e tente novamente.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === "ios" ? "padding" : "height"}>
      <ScrollView contentContainerStyle={styles.container}>
        <View style={styles.header}>
          <Text style={styles.welcomeTitle}>Criar Nova Senha</Text>
          <Text style={styles.welcomeSubtitle}>
            Digite o código de 6 dígitos que enviamos para {email}
          </Text>
        </View>

        <View style={styles.inputGroup}>
          <View style={styles.inputContainer}>
            <KeyRound size={20} color={Colors.subtitle} />
            <TextInput
              placeholder="Código de 6 dígitos"
              style={styles.input}
              keyboardType="number-pad"
              maxLength={6}
              value={codigo}
              onChangeText={setCodigo}
            />
          </View>

          <View style={styles.inputContainer}>
            <Lock size={20} color={Colors.subtitle} />
            <TextInput
              placeholder="Sua nova senha"
              style={styles.input}
              secureTextEntry
              value={novaSenha}
              onChangeText={setNovaSenha}
            />
          </View>

          <Pressable 
            style={styles.buttonPrimary} 
            onPress={handleSalvarNovaSenha}
            disabled={loading}
          >
            {loading ? <ActivityIndicator color={Colors.light} /> : <Text style={styles.buttonPrimaryText}>Alterar Senha</Text>}
          </Pressable>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}