import React, { useState } from "react";
import {
  View, Text, TextInput, Pressable, Image, ScrollView, KeyboardAvoidingView, Platform,
} from "react-native";
import { router } from "expo-router";
import { Mail } from "lucide-react-native";
import Animated, { FadeInDown, FadeInUp } from "react-native-reanimated";

// Meus imports
import { authStyles as styles } from "../../styles/auth_styles";
import { Colors } from "../../constants/theme";

// Tela de Esqueci Senha
export default function EsqueciSenhaScreen() {
  // Estado para controlar o foco do input de email
  const [isFocusedEmail, setIsFocusedEmail] = useState(false);

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      <ScrollView
        contentContainerStyle={styles.container}
        showsVerticalScrollIndicator={false}
      >
        {/* Header com Logo e Instrução */}
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

          <Text style={styles.welcomeTitle}>Recuperar Conta</Text>
          <Text style={styles.welcomeSubtitle}>
            Insira seu e-mail para recuperar sua conta com segurança
          </Text>
        </Animated.View>

        {/* Campo de E-mail com Feedback de Foco e Ícone */}
        <Animated.View
          entering={FadeInDown.delay(300).duration(600)}
          style={styles.inputGroup}
        >
          <View style={[
            styles.inputContainer,
            isFocusedEmail && styles.inputContainerFocused
          ]}>
            {/* Ícone adicionado aqui */}
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
              onFocus={() => setIsFocusedEmail(true)}
              onBlur={() => setIsFocusedEmail(false)}
              selectionColor={Colors.primary}
            />
          </View>

          <Pressable
            style={styles.buttonPrimary}
            onPress={() => {
              // Aqui entraria a lógica de envio de e-mail
              console.log("Solicitar redefinição");
              router.replace("/(auth)/login");
            }}
          >
            <Text style={styles.buttonPrimaryText}>Enviar Instruções</Text>
          </Pressable>
        </Animated.View>

        {/* Voltar para Login */}
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

          {/* Texto Legal */}
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