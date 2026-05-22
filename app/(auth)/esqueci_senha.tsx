import { router } from "expo-router";
import { Mail } from "lucide-react-native";
import React, { useState } from "react";
import {
  ActivityIndicator,
  Alert,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  Text,
  TextInput,
  View
} from "react-native";
import Animated, { FadeInDown } from "react-native-reanimated";

// Meus imports
import { supabase } from "@/services/supabase";
import AuthHeader from "../../components/AuthHeader";
import { Colors } from "../../constants/theme";
import { authStyles as styles } from "../../styles/auth_styles";

export default function EsqueciSenhaScreen() {
  const [isFocusedEmail, setIsFocusedEmail] = useState(false);

  // Estados
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);

  // Função refatorada para a Autenticação Nativa do Supabase
  async function handleSolicitarRecuperacao() {
    if (!email) {
      Alert.alert("Email Requerido", "Digite seu endereço de email para receber o código de recuperação.");
      return;
    }

    setLoading(true);

    try {
      // 0. Verifica se o e-mail existe na nossa tabela de usuários antes de disparar o OTP
      const { data: userData, error: userError } = await supabase
        .from("users")
        .select("id")
        .eq("email", email.trim().toLowerCase())
        .maybeSingle();

      if (userError) throw userError;

      if (!userData) {
        Alert.alert(
          "E-mail não encontrado",
          "Não encontramos nenhuma conta com este e-mail. Deseja criar uma nova conta?",
          [
            {
              text: "Criar Conta",
              onPress: () => router.push("/(auth)/cadastro"),
            },
            {
              text: "Tentar novamente",
              style: "cancel",
            },
          ]
        );
        setLoading(false);
        return;
      }

      // 1. O Supabase dispara o e-mail de recuperação nativo com o código (OTP)
      const { error } = await supabase.auth.resetPasswordForEmail(email.trim().toLowerCase());

      if (error) {
        throw new Error(error.message);
      }

      Alert.alert(
        "Instruções enviadas",
        "Enviamos o código de recuperação para você. Por favor, verifique sua caixa de entrada e a pasta de spam."
      );

      // 2. Redireciona para a tela de digitar o código e a nova senha, passando o e-mail
      router.push({
        pathname: "/(auth)/nova_senha",
        params: { email: email.trim().toLowerCase() }
      });

    } catch (error: any) {
      console.error("Erro na recuperação:", error);
      Alert.alert("Erro", "Não foi possível enviar o e-mail. Verifique se o e-mail está correto.");
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
          title="Recuperar Conta"
          subtitle="Insira seu e-mail para receber um código de segurança."
        />

        <Animated.View
          entering={FadeInDown.delay(300).duration(600)}
          style={styles.inputGroup}
        >
          <View style={[
            styles.inputContainer,
            isFocusedEmail && styles.inputContainerFocused
          ]}>
            <Mail
              size={20}
              color={isFocusedEmail ? Colors.primary : Colors.subtitle}
            />
            <TextInput
              placeholder="Digite seu email"
              placeholderTextColor={Colors.subtitle + "99"}
              style={styles.input}
              keyboardType="email-address"
              autoCapitalize="none"
              autoCorrect={false}
              value={email}
              onChangeText={(t) => setEmail(t.trim())}
              onFocus={() => setIsFocusedEmail(true)}
              onBlur={() => setIsFocusedEmail(false)}
              selectionColor={Colors.primary}
            />
          </View>

          <Pressable
            style={[styles.buttonPrimary, loading && styles.buttonPrimaryDisabled]}
            onPress={handleSolicitarRecuperacao}
            disabled={loading}
          >
            {loading ? (
              <ActivityIndicator color={Colors.light} />
            ) : (
              <Text style={styles.buttonPrimaryText}>Enviar Código</Text>
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
            Ao continuar, você aceita nossos <Text style={styles.linkUnderline}>Termos de Serviço</Text> e <Text style={styles.linkUnderline}>Política de Privacidade</Text>.
          </Text>
        </Animated.View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}