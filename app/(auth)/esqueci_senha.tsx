import React from "react";
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
import Animated, { FadeInDown, FadeInUp } from "react-native-reanimated";
import { authStyles as styles } from "../../styles/auth_styles";
import { Colors } from "../../constants/theme";

export default function EsqueciSenhaScreen() {
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

          <Text style={styles.welcomeTitle}>Qual o e-mail da conta?</Text>
          <Text style={styles.welcomeSubtitle}>
            Enviaremos instruções para o seu e-mail, assim garantimos que apenas
            você pode redefinir a senha.
          </Text>
        </Animated.View>

        {/* Campo de E-mail */}
        <Animated.View
          entering={FadeInDown.delay(300).duration(600)}
          style={styles.inputGroup}
        >
          <Text style={styles.label}>Email</Text>
          <View style={styles.inputContainer}>
            <TextInput
              placeholder="Digite seu email"
              placeholderTextColor={Colors.subtext}
              style={styles.input}
              keyboardType="email-address"
              autoCapitalize="none"
            />
          </View>

          <Pressable
            style={styles.buttonPrimary}
            onPress={() => router.replace("/(auth)/login")}
          >
            <Text style={styles.buttonPrimaryText}>Entrar</Text>
          </Pressable>
        </Animated.View>

        {/* Voltar para Login */}
        <Animated.View entering={FadeInDown.delay(500).duration(600)}>
          <Text style={styles.footerText}>
            Voltar para o{" "}
            <Text
              style={{
                color: Colors.primary,
                fontFamily: "PlusJakartaSans-Bold",
              }}
              onPress={() => router.push("/(auth)/login")}
            >
              Login
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