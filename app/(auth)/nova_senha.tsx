import { supabase } from "@/services/supabase";
import { router, useLocalSearchParams } from "expo-router";
import { Eye, EyeOff, KeyRound, Lock } from "lucide-react-native";
import React, { useState } from "react";
import {
  ActivityIndicator, Alert,
  Keyboard,
  KeyboardAvoidingView, Platform,
  Pressable, ScrollView, Text, TextInput, View
} from "react-native";
import Animated, { FadeInDown } from "react-native-reanimated";

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
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  async function handleSalvarNovaSenha() {
    if (!codigo || !novaSenha) {
      Alert.alert("Atenção", "Preencha o código e a nova senha.");
      return;
    }

    const emailStr = typeof email === 'string' ? email.trim().toLowerCase() : '';

    if (!emailStr) {
      Alert.alert("Erro", "E-mail não encontrado. Volte e tente novamente.");
      return;
    }

    setLoading(true);

    try {
      // 1. SEMPRE validar o OTP, independente de sessão existente (segurança crítica)
      const { error: verifyError } = await supabase.auth.verifyOtp({
        email: emailStr,
        token: codigo.trim(),
        type: 'recovery',
      });

      if (verifyError) {
        Alert.alert("Código Inválido", "O código expirou ou está incorreto. Solicite um novo código.");
        setLoading(false);
        return;
      }

      // 2. Tenta injetar a nova senha
      const { error: updateError } = await supabase.auth.updateUser({
        password: novaSenha,
      });

      if (updateError) {
        if (updateError.message?.includes("different from the old password") || updateError.status === 422) {
          // Estratégia de Segurança Estrita: O código OTP foi invalidado pelo Supabase
          // Usuário deve gerar um novo código obrigatoriamente
          Alert.alert(
            "Senha Repetida",
            "Sua nova senha não pode ser igual à anterior. Por segurança, o código de verificação foi invalidado. Por favor, solicite um novo código de recuperação.",
            [
              {
                text: "Solicitar Novo Código",
                onPress: () => {
                  setLoading(false);
                  router.replace("/(auth)/esqueci_senha");
                }
              }
            ],
            { cancelable: false }
          );
          setLoading(false);
          return;
        }
        throw new Error(updateError.message);
      }

      Keyboard.dismiss();
      setLoading(false);

      // 3. Devolvemos o aviso de sucesso (que você pediu) com navegação atrelada ao botão OK
      Alert.alert(
        "Senha atualizada",
        "Sua senha foi redefinida com sucesso. Você já pode acessar sua conta utilizando suas novas credenciais.",
        [
          {
            text: "Ir para o Login",
            onPress: () => {
              router.replace("/(auth)/login");
              // Limpa a sessão em background
              setTimeout(() => {
                supabase.auth.signOut().catch(console.error);
              }, 300);
            }
          }
        ],
        { cancelable: false }
      );

    } catch (error: any) {
      console.error("Erro ao alterar senha:", error);
      Alert.alert("Erro de Atualização", "Algo inesperado aconteceu. Tente novamente ou solicite um novo código de recuperação.");
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
          subtitle={`Digite o código de 8 dígitos que enviamos para ${typeof email === 'string' ? email : ''}`}
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
              placeholder="Código de 8 dígitos"
              placeholderTextColor={Colors.subtitle + "99"}
              style={styles.input}
              keyboardType="number-pad"
              maxLength={8}
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
              secureTextEntry={!showPassword}
              maxLength={16}
              value={novaSenha}
              onChangeText={setNovaSenha}
              onFocus={() => setIsFocusedSenha(true)}
              onBlur={() => setIsFocusedSenha(false)}
              selectionColor={Colors.primary}
            />
            <Pressable onPress={() => setShowPassword(!showPassword)}>
              {showPassword ? (
                <EyeOff size={20} color={Colors.primary} />
              ) : (
                <Eye size={20} color={Colors.primary} />
              )}
            </Pressable>
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