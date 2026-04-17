import React, { useState, useEffect } from "react";
import {
  Image, KeyboardAvoidingView, Platform, Pressable,
  ScrollView, Text, TextInput, View, ActivityIndicator
} from "react-native";
import { router } from "expo-router";
import { FontAwesome5 } from "@expo/vector-icons";
import { CheckCircle, Eye, EyeOff, Lock, Mail } from "lucide-react-native";
import Animated, { FadeInDown, FadeInUp, FadeOut } from "react-native-reanimated";

// Imports de Configuração e Estilo
import { Colors, FontSizes, Radius, Spacing } from "../../constants/theme";
import { authStyles as styles } from "../../styles/auth_styles";
import { validateEmail } from "../../utils/validation";
import { LoginErrors } from "../../types/auth";
import { useAuth } from "@/hooks/useAuth";
import * as WebBrowser from 'expo-web-browser';
import * as Linking from 'expo-linking';
import { supabase } from "@/services/supabase";
//Avisa ao Expo para fechar o navegador assim que o usuário autenticar
WebBrowser.maybeCompleteAuthSession();
export default function LoginScreen() {
  const { signIn, isLoading } = useAuth();

  // Estados do Formulário
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [focused, setFocused] = useState<string | null>(null);
  const [errors, setErrors] = useState<LoginErrors>({});
  const [isSuccess, setIsSuccess] = useState(false);

  // Lógica de Autenticação
  const handleLogin = async () => {
    let newErrors: LoginErrors = {};
    if (!validateEmail(email)) newErrors.email = "E-mail inválido.";
    if (!senha) newErrors.senha = "Senha obrigatória.";

    setErrors(newErrors);

    if (Object.keys(newErrors).length === 0) {
      try {
        const result = await signIn(email, senha);

        if (result.success) {
          setIsSuccess(true);
          setTimeout(() => router.replace("/(tabs)/home"), 1500);
        } else {
          setErrors({ geral: result.error || "E-mail ou senha incorretos." });
        }
      } catch (error) {
        setErrors({ geral: "Erro ao conectar com o servidor." });
      }
    }
  };
  //Logica com o Google
  // Lógica do Google
  const handleGoogleLogin = async () => {
    try {
      // 1. Define a URL de retorno dependendo de onde o app tá rodando
      const redirectUrl = Platform.OS === 'web'
        ? 'http://localhost:8081/(tabs)/home' // Volta pro seu navegador
        : Linking.createURL('/(tabs)/home'); // Volta pro app no celular

      // 2. Chama o Supabase
      const { data, error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: redirectUrl,
          // O PULO DO GATO: Se for Web, o Supabase redireciona a aba inteira. 
          // Se for celular (iOS/Android), a gente impede isso para usar o WebBrowser do Expo.
          skipBrowserRedirect: Platform.OS !== 'web',
        },
      });

      if (error) throw error;

      // 3. Abre a janela do Google APENAS se for celular (no Web o Supabase já fez sozinho)
      if (Platform.OS !== 'web' && data?.url) {
        await WebBrowser.openAuthSessionAsync(data.url, redirectUrl);
      }

    } catch (error) {
      console.error("Erro no Google:", error);
      setErrors({ geral: "Não foi possível conectar com o Google." });
    }
  };

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      <ScrollView
        contentContainerStyle={styles.container}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        {/* Header - Identidade Visual */}
        <Animated.View entering={FadeInUp.delay(100).duration(600)} style={styles.header}>
          <Image
            source={require("../../assets/images/icon.png")}
            style={styles.logo}
            resizeMode="contain"
          />
          <Text style={styles.brandName}>Quase Chef!</Text>
          <Text style={styles.welcomeTitle}>Bem-vindo de volta!</Text>
          <Text style={styles.welcomeSubtitle}>
            Sentimos sua falta. Entre para ver o que sobrou hoje!
          </Text>
        </Animated.View>

        {/* Feedback de Sucesso */}
        {isSuccess && (
          <Animated.View exiting={FadeOut} style={styles.successAlert}>
            <CheckCircle size={18} color="white" />
            <Text style={styles.successAlertText}>Login realizado! Entrando...</Text>
          </Animated.View>
        )}

        {/* Formulário de Login */}
        <Animated.View entering={FadeInDown.delay(300).duration(600)} style={styles.inputGroup}>
          {errors.geral && <Text style={styles.errorGeral}>{errors.geral}</Text>}

          {/* Campo E-mail */}
          <View style={[
            styles.inputContainer,
            focused === "email" && styles.inputContainerFocused,
            errors.email && styles.inputContainerError
          ]}>
            <Mail size={20} color={errors.email ? Colors.errorDark : (focused === "email" ? Colors.primary : Colors.subtitle)} />
            <TextInput
              placeholder="Digite seu e-mail"
              placeholderTextColor={Colors.subtitle + "99"}
              style={styles.input}
              autoCapitalize="none"
              keyboardType="email-address"
              value={email}
              onFocus={() => setFocused("email")}
              onBlur={() => setFocused(null)}
              onChangeText={(t) => { setEmail(t); setErrors(prev => ({ ...prev, email: null })); }}
            />
          </View>
          {errors.email && <Text style={styles.errorText}>{errors.email}</Text>}

          {/* Campo Senha */}
          <View style={[
            styles.inputContainer,
            focused === "senha" && styles.inputContainerFocused,
            errors.senha && styles.inputContainerError
          ]}>
            <Lock size={20} color={errors.senha ? Colors.errorDark : (focused === "senha" ? Colors.primary : Colors.subtitle)} />
            <TextInput
              placeholder="Digite sua senha"
              placeholderTextColor={Colors.subtitle + "99"}
              style={styles.input}
              secureTextEntry={!showPassword}
              value={senha}
              onFocus={() => setFocused("senha")}
              onBlur={() => setFocused(null)}
              onChangeText={(t) => { setSenha(t); setErrors(prev => ({ ...prev, senha: null })); }}
            />
            <Pressable onPress={() => setShowPassword(!showPassword)}>
              {showPassword ? <EyeOff size={20} color={Colors.primary} /> : <Eye size={20} color={Colors.primary} />}
            </Pressable>
          </View>
          {errors.senha && <Text style={styles.errorText}>{errors.senha}</Text>}

          <Pressable onPress={() => router.push("/(auth)/esqueci_senha")}>
            <Text style={styles.forgotPasswordText}>Esqueceu a senha?</Text>
          </Pressable>

          {/* Botão de Ação */}
          <Pressable
            style={[styles.buttonPrimary, (isSuccess || isLoading) && { opacity: 0.7 }]}
            onPress={handleLogin}
            disabled={isSuccess || isLoading}
          >
            {isLoading ? <ActivityIndicator color="white" /> : (
              <Text style={styles.buttonPrimaryText}>{isSuccess ? "Aguarde..." : "Entrar"}</Text>
            )}
          </Pressable>
        </Animated.View>

        {/* Footer - Social e Cadastro */}
        <Animated.View entering={FadeInDown.delay(500).duration(600)}>
          <View style={styles.dividerContainer}>
            <View style={styles.dividerLine} /><Text style={styles.dividerText}>ou entre com</Text><View style={styles.dividerLine} />
          </View>

          <View style={styles.socialContainer}>
            <Pressable
              style={styles.socialButton}
              onPress={handleGoogleLogin}
            >
              <FontAwesome5 name="google" size={16} color="#DB4437" />
              <Text style={styles.socialButtonText}>Google</Text>
            </Pressable>

            <Pressable style={styles.socialButton}>
              <FontAwesome5 name="facebook" size={16} color="#4267B2" />
              <Text style={styles.socialButtonText}>Facebook</Text>
            </Pressable>
          </View>

          <Text style={styles.footerText}>
            Não tem uma conta? <Text style={styles.primaryLink} onPress={() => router.push("/(auth)/cadastro")}>Cadastre-se</Text>
          </Text>

          <Text style={styles.legalText}>
            Ao se cadastrar, você aceita nossos <Text style={styles.linkUnderline}>Termos</Text> e <Text style={styles.linkUnderline}>Privacidade</Text>.
          </Text>
        </Animated.View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}