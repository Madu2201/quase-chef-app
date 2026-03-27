import React, { useState } from "react";
import { View, Text, TextInput, Pressable, Image, ScrollView, KeyboardAvoidingView, Platform } from "react-native";
import { router } from "expo-router";
import { Eye, EyeOff, Mail, Lock, CheckCircle } from "lucide-react-native";
import { FontAwesome5 } from "@expo/vector-icons";
import Animated, { FadeInDown, FadeInUp, FadeOut } from "react-native-reanimated";

// Estilos e utilitários
import { authStyles as styles } from "../../styles/auth_styles";
import { Colors, Spacing, Radius, FontSizes } from "../../constants/theme";
import { validateEmail } from "../../utils/validation";

export default function LoginScreen() {
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState<any>({});
  const [focused, setFocused] = useState<string | null>(null);
  const [isSuccess, setIsSuccess] = useState(false); // Estado para controle de sucesso

  // Validação e feedback de entrada
  const handleLogin = () => {
    let newErrors: any = {};
    if (!validateEmail(email)) newErrors.email = "E-mail inválido.";
    if (!senha) newErrors.senha = "Senha obrigatória.";

    setErrors(newErrors);

    if (Object.keys(newErrors).length === 0) {
      setIsSuccess(true); // Ativa o banner de sucesso
      // Pequeno delay para o usuário ler a mensagem antes de entrar
      setTimeout(() => {
        router.replace("/(tabs)/home");
      }, 1500);
    }
  };

  return (
    <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === "ios" ? "padding" : "height"}>
      <ScrollView contentContainerStyle={styles.container} showsVerticalScrollIndicator={false} keyboardShouldPersistTaps="handled">

        {/* Header com Animação */}
        <Animated.View entering={FadeInUp.delay(100).duration(600)} style={styles.header}>
          <Image source={require("../../assets/images/icon.png")} style={styles.logo} resizeMode="contain" />
          <Text style={styles.brandName}>Quase Chef!</Text>
          <Text style={styles.welcomeTitle}>Bem-vindo de volta!</Text>
          <Text style={styles.welcomeSubtitle}>Sentimos sua falta. Entre para ver o que sobrou hoje!</Text>
        </Animated.View>

        {/* Alerta de Sucesso Animado */}
        {isSuccess && (
          <Animated.View
            exiting={FadeOut}
            style={{
              backgroundColor: Colors.success,
              padding: Spacing.sm,
              borderRadius: Radius.lg,
              flexDirection: 'row',
              alignItems: 'center',
              gap: Spacing.md,
              marginTop: Spacing.xs
            }}
          >
            <CheckCircle size={15} color="white" />
            <Text style={{ fontSize: FontSizes.small , color: Colors.light, fontWeight: 'bold' }}>Login realizado! Entrando...</Text>
          </Animated.View>
        )}

        <Animated.View entering={FadeInDown.delay(300).duration(600)} style={styles.inputGroup}>

          {/* E-mail com erro logo abaixo */}
          <View style={[styles.inputContainer, focused === 'email' && styles.inputContainerFocused, errors.email && { borderColor: Colors.errorDark, backgroundColor: Colors.errorLight }]}>
            <Mail size={20} color={errors.email ? Colors.errorDark : (focused === 'email' ? Colors.primary : Colors.subtitle)} />
            <TextInput
              placeholder="Digite seu e-mail"
              placeholderTextColor={Colors.subtitle + "99"}
              style={styles.input}
              autoCapitalize="none"
              onFocus={() => setFocused('email')}
              onBlur={() => setFocused(null)}
              onChangeText={(t) => { setEmail(t); setErrors({ ...errors, email: null }) }}
              value={email}
            />
          </View>
          {errors.email && <Text style={{ color: Colors.errorDark, fontSize: 12, marginBottom: 12, marginLeft: 4 }}>{errors.email}</Text>}

          {/* Senha com erro logo abaixo */}
          <View style={[styles.inputContainer, focused === 'senha' && styles.inputContainerFocused, errors.senha && { borderColor: Colors.errorDark, backgroundColor: Colors.errorLight }]}>
            <Lock size={20} color={errors.senha ? Colors.errorDark : (focused === 'senha' ? Colors.primary : Colors.subtitle)} />
            <TextInput
              placeholder="Digite sua senha"
              placeholderTextColor={Colors.subtitle + "99"}
              style={styles.input}
              secureTextEntry={!showPassword}
              onFocus={() => setFocused('senha')}
              onBlur={() => setFocused(null)}
              onChangeText={(t) => { setSenha(t); setErrors({ ...errors, senha: null }) }}
              value={senha}
            />
            <Pressable onPress={() => setShowPassword(!showPassword)}>
              {showPassword ? <EyeOff size={20} color={Colors.primary} /> : <Eye size={20} color={Colors.primary} />}
            </Pressable>
          </View>
          {errors.senha && <Text style={{ color: Colors.errorDark, fontSize: 12, marginBottom: 12, marginLeft: 4 }}>{errors.senha}</Text>}

          {/* Esqueci minha senha */}
          <Pressable onPress={() => router.push("/(auth)/esqueci_senha")}>
            <Text style={styles.forgotPasswordText}>Esqueceu a senha?</Text>
          </Pressable>

          {/* Botão de Login (fica desabilitado no sucesso) */}
          <Pressable
            style={[styles.buttonPrimary, isSuccess && { opacity: 0.8 }]}
            onPress={handleLogin}
            disabled={isSuccess}
          >
            <Text style={styles.buttonPrimaryText}>{isSuccess ? "Aguarde..." : "Entrar"}</Text>
          </Pressable>
        </Animated.View>

        {/* Rodapé Social */}
        <Animated.View entering={FadeInDown.delay(500).duration(600)}>
          <View style={styles.dividerContainer}>
            <View style={styles.dividerLine} />
            <Text style={styles.dividerText}>ou entre com</Text>
            <View style={styles.dividerLine} />
          </View>

          <View style={styles.socialContainer}>
            <Pressable style={styles.socialButton}><FontAwesome5 name="google" size={16} color="#DB4437" /><Text style={styles.socialButtonText}>Google</Text></Pressable>
            <Pressable style={styles.socialButton}><FontAwesome5 name="facebook" size={16} color="#4267B2" /><Text style={styles.socialButtonText}>Facebook</Text></Pressable>
          </View>

          <Text style={styles.footerText}>Não tem uma conta? <Text style={styles.primaryLink} onPress={() => router.push("/(auth)/cadastro")}>Cadastre-se</Text></Text>

          <Text style={styles.legalText}>Ao entrar, você concorda com nossos <Text style={styles.linkUnderline}>Termos</Text> e <Text style={styles.linkUnderline}>Privacidade</Text>.</Text>
        </Animated.View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}