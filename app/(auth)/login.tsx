import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  Pressable,
  Image,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { router } from "expo-router";
import { Eye, EyeOff } from "lucide-react-native";
import Animated, { FadeInDown, FadeInUp } from "react-native-reanimated";
import { authStyles as styles } from "../../styles/auth_styles";
import { Colors } from "../../constants/theme";
import { FontAwesome5 } from "@expo/vector-icons";

export default function LoginScreen() {
  const [showPassword, setShowPassword] = useState(false);

  // Estados para controlar o foco de cada input individualmente
  const [isFocusedEmail, setIsFocusedEmail] = useState(false);
  const [isFocusedPassword, setIsFocusedPassword] = useState(false);

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      <ScrollView
        contentContainerStyle={styles.container}
        showsVerticalScrollIndicator={false}
      >
        {/* Header Compacto */}
        <Animated.View
          entering={FadeInUp.delay(100).duration(600)}
          style={styles.header}
        >
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

        {/* Formulário */}
        <Animated.View
          entering={FadeInDown.delay(300).duration(600)}
          style={styles.inputGroup}
        >
          <View style={[
            styles.inputContainer,
            isFocusedEmail && styles.inputContainerFocused
          ]}>
            <TextInput
              placeholder="Digite seu email"
              placeholderTextColor={Colors.subtitle + "99"}
              style={styles.input}
              keyboardType="email-address"
              autoCapitalize="none"
              onFocus={() => setIsFocusedEmail(true)}
              onBlur={() => setIsFocusedEmail(false)}
              selectionColor={Colors.primary}
            />
          </View>

          <View style={[
            styles.inputContainer,
            isFocusedPassword && styles.inputContainerFocused
          ]}>
            <TextInput
              placeholder="Digite sua senha"
              placeholderTextColor={Colors.subtitle + "99"}
              style={styles.input}
              secureTextEntry={!showPassword}
              onFocus={() => setIsFocusedPassword(true)}
              onBlur={() => setIsFocusedPassword(false)}
              selectionColor={Colors.primary}
            />
            <Pressable
              onPress={() => setShowPassword(!showPassword)}
              hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
            >
              {showPassword ? (
                <EyeOff size={20} color={Colors.primary} />
              ) : (
                <Eye size={20} color={Colors.primary} />
              )}
            </Pressable>
          </View>

          <Pressable onPress={() => router.push("/(auth)/esqueci_senha")}>
            <Text style={styles.forgotPasswordText}>Esqueceu a senha?</Text>
          </Pressable>

          <Pressable
            style={styles.buttonPrimary}
            onPress={() => router.replace("/(tabs)/home")}
          >
            <Text style={styles.buttonPrimaryText}>Entrar</Text>
          </Pressable>
        </Animated.View>

        {/* Divisor e Redes Sociais */}
        <Animated.View entering={FadeInDown.delay(500).duration(600)}>
          <View style={styles.dividerContainer}>
            <View style={styles.dividerLine} />
            <Text style={styles.dividerText}>ou entre com</Text>
            <View style={styles.dividerLine} />
          </View>

          <View style={styles.socialContainer}>
            <Pressable style={styles.socialButton}>
              <FontAwesome5 name="google" size={16} color="#DB4437" />
              <Text style={styles.socialButtonText}>Google</Text>
            </Pressable>
            <Pressable style={styles.socialButton}>
              <FontAwesome5 name="facebook" size={16} color="#4267B2" />
              <Text style={styles.socialButtonText}>Facebook</Text>
            </Pressable>
          </View>

          {/* Cadastro */}
          <Text style={styles.footerText}>
            Não tem uma conta?{" "}
            <Text
              style={styles.primaryLink}
              onPress={() => router.push("/(auth)/cadastro")}
            >
              Cadastre-se
            </Text>
          </Text>

          {/* Texto Legal */}
          <Text style={styles.legalText}>
            Ao entrar, você concorda com nossos{" "}
            <Text style={styles.linkUnderline}>Termos de Serviço</Text> e{" "}
            <Text style={styles.linkUnderline}>Política de Privacidade</Text>.
          </Text>
        </Animated.View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}