import { router } from "expo-router";
import { Mail } from "lucide-react-native";
import React, { useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Image,
  KeyboardAvoidingView, Platform,
  Pressable,
  ScrollView,
  Text, TextInput,
  View
} from "react-native";
import Animated, { FadeInDown, FadeInUp } from "react-native-reanimated";

// Meus imports
import AuthHeader from "../../components/AuthHeader";
import { supabase } from "@/services/supabase";
import { Colors } from "../../constants/theme";
import { authStyles as styles } from "../../styles/auth_styles";

export default function EsqueciSenhaScreen() {
  const [isFocusedEmail, setIsFocusedEmail] = useState(false);

  // Nossos novos estados
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);

  // ⚠️ COLOQUE SUAS CHAVES DO EMAILJS AQUI
  const EMAILJS_SERVICE_ID = "service_b5282sg";
  const EMAILJS_TEMPLATE_ID = "template_s1zb6fs";
  const EMAILJS_PUBLIC_KEY = "mqdmJb88HtTXkQn9Q";

  // Função que faz a mágica acontecer
  async function handleSolicitarRecuperacao() {
    if (!email) {
      Alert.alert("Opa!", "Por favor, digite seu e-mail para enviarmos o código.");
      return;
    }

    setLoading(true);

    try {
      // 1. Verifica se o usuário existe na sua tabela pública 'users'
      const { data: usuario, error: erroBusca } = await supabase
        .from('users')
        .select('id, email')
        .eq('email', email.trim().toLowerCase())
        .single();

      if (erroBusca || !usuario) {
        Alert.alert("Erro", "E-mail não encontrado em nossa base de dados.");
        setLoading(false);
        return;
      }

      // 2. Gera um código de 6 dígitos e o tempo de expiração (1 hora)
      const codigoGerado = Math.floor(100000 + Math.random() * 900000).toString();
      const tempoExpiracao = new Date(Date.now() + 60 * 60 * 1000).toISOString();

      // 3. Salva o código na sua tabela
      const { error: erroUpdate } = await supabase
        .from('users')
        .update({
          reset_token: codigoGerado,
          reset_token_expires: tempoExpiracao
        })
        .eq('id', usuario.id);

      if (erroUpdate) throw new Error("Erro ao salvar código no banco.");

      // 4. Envia o e-mail via EmailJS
      const respostaEmail = await fetch('https://api.emailjs.com/api/v1.0/email/send', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          service_id: EMAILJS_SERVICE_ID,
          template_id: EMAILJS_TEMPLATE_ID,
          user_id: EMAILJS_PUBLIC_KEY,
          template_params: {
            user_email: email.trim().toLowerCase(),
            codigo: codigoGerado,
          }
        })
      });

      if (!respostaEmail.ok) {
        const motivoDoErro = await respostaEmail.text(); // Lê a resposta da API
        console.error("Motivo da recusa do EmailJS:", motivoDoErro);
        throw new Error("Erro do EmailJS: " + motivoDoErro);
      }

      Alert.alert(
        "Código Enviado! 🚀",
        "Dê uma olhada na sua caixa de entrada (e na pasta de spam). Enviamos um código de 6 dígitos para lá."
      );

      // 5. Redireciona para a tela de digitar o código, passando o e-mail
      router.push({
        pathname: "/(auth)/nova_senha",
        params: { email: email.trim().toLowerCase() }
      });

    } catch (error) {
      console.error("Erro na recuperação:", error);
      Alert.alert("Ops", "Algo deu errado. Tente novamente mais tarde.");
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
              value={email}
              onChangeText={setEmail}
              onFocus={() => setIsFocusedEmail(true)}
              onBlur={() => setIsFocusedEmail(false)}
              selectionColor={Colors.primary}
            />
          </View>

          <Pressable
            style={styles.buttonPrimary}
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
            Ao entrar, você aceita nossos <Text style={styles.linkUnderline}>Termos de Serviço</Text> e <Text style={styles.linkUnderline}>Política de Privacidade</Text>.
          </Text>
        </Animated.View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}