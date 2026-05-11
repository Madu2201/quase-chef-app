import { router, useLocalSearchParams } from "expo-router";
import { KeyRound, Lock } from "lucide-react-native";
import React, { useState } from "react";
import {
  ActivityIndicator, Alert, Image, KeyboardAvoidingView, Platform,
  Pressable, ScrollView, Text, TextInput, View,
} from "react-native";
import Animated, { FadeInDown, FadeInUp } from "react-native-reanimated";
import { supabase } from "@/services/supabase";

// Meus imports
import AuthHeader from "../../components/AuthHeader";
import { Colors } from "../../constants/theme";
import { authStyles as styles } from "../../styles/auth_styles";

export default function NovaSenhaScreen() {
  const { email } = useLocalSearchParams(); // Pega o e-mail da tela anterior

  const [isFocusedCodigo, setIsFocusedCodigo] = useState(false);
  const [isFocusedSenha, setIsFocusedSenha] = useState(false);
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
          password_hash: novaSenha,
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
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      <ScrollView
        contentContainerStyle={styles.container}
        showsVerticalScrollIndicator={false}
      >
        <AuthHeader
          title="Criar Nova Senha"
          subtitle="Digite o código de 6 dígitos que enviamos para {email}"
          email={typeof email === 'string' ? email : ''}
        />

        <Animated.View
          entering={FadeInDown.delay(300).duration(600)}
          style={styles.inputGroup}
        >
          <View
            style={[
              styles.inputContainer,
              isFocusedCodigo && styles.inputContainerFocused,
            ]}
          >
            <KeyRound
              size={20}
              color={
                isFocusedCodigo ? Colors.primary : Colors.subtitle
              }
            />
            <TextInput
              placeholder="Código de 6 dígitos"
              placeholderTextColor={Colors.subtitle + "99"}
              style={styles.input}
              keyboardType="number-pad"
              maxLength={6}
              value={codigo}
              onChangeText={setCodigo}
              onFocus={() => setIsFocusedCodigo(true)}
              onBlur={() => setIsFocusedCodigo(false)}
              selectionColor={Colors.primary}
            />
          </View>

          <View
            style={[
              styles.inputContainer,
              isFocusedSenha && styles.inputContainerFocused,
            ]}
          >
            <Lock
              size={20}
              color={isFocusedSenha ? Colors.primary : Colors.subtitle}
            />
            <TextInput
              placeholder="Sua nova senha"
              placeholderTextColor={Colors.subtitle + "99"}
              style={styles.input}
              secureTextEntry
              value={novaSenha}
              onChangeText={setNovaSenha}
              onFocus={() => setIsFocusedSenha(true)}
              onBlur={() => setIsFocusedSenha(false)}
              selectionColor={Colors.primary}
            />
          </View>

          <Pressable
            style={styles.buttonPrimary}
            onPress={handleSalvarNovaSenha}
            disabled={loading}
          >
            {loading ? (
              <ActivityIndicator color={Colors.light} />
            ) : (
              <Text style={styles.buttonPrimaryText}>Alterar Senha</Text>
            )}
          </Pressable>
        </Animated.View>

        <Animated.View entering={FadeInDown.delay(500).duration(600)}>
          <Text style={styles.footerText}>
            Lembrou a senha?{" "}
            <Text
              style={styles.primaryLink}
              onPress={() => router.push("/(auth)/login")}
            >
              Voltar para o Login
            </Text>
          </Text>

          <Text style={styles.legalText}>
            Ao continuar, você concorda com nossos{" "}
            <Text style={styles.linkUnderline}>Termos de Serviço</Text> e{" "}
            <Text style={styles.linkUnderline}>Política de Privacidade</Text>.
          </Text>
        </Animated.View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}