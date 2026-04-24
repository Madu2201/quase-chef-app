import { router } from "expo-router";
import {
  AlertTriangle, CheckCircle, ChefHat, ChevronDown, ChevronUp,
  Eye, EyeOff, Lock, Mail, User
} from "lucide-react-native";
import React, { useEffect, useState } from "react";
import {
  ActivityIndicator, Image, KeyboardAvoidingView, Platform, Pressable,
  ScrollView, Text, TextInput, View
} from "react-native";
import Animated, {
  FadeInDown, FadeInUp, FadeOut, useAnimatedStyle, useSharedValue,
  withSpring
} from "react-native-reanimated";

// Meus imports
import { ALLERGY_OPTIONS, FOOD_PREFERENCE_OPTIONS } from "../../constants/OpcaoAlimentar";
import { Colors } from "../../constants/theme";
import { useCadastroForm } from "../../hooks/useCadastro";
import { authStyles as styles } from "../../styles/auth_styles";
import { OptionItem } from "../../types/auth";
import { getPasswordRequirements } from "../../utils/validation";

// Componente de card para seleção de preferências/alergias
function PreferenceCard({
  item,
  selected,
  onPress,
}: {
  item: OptionItem;
  selected: boolean;
  onPress: () => void;
}) {
  const Icon = item.icon;
  const scale = useSharedValue(1);

  // Animação de escala ao pressionar
  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  return (
    <Animated.View style={[styles.cardWrapper, animatedStyle]}>
      <Pressable
        onPressIn={() => {
          scale.value = withSpring(0.985, { damping: 18, stiffness: 220 });
        }}
        onPressOut={() => {
          scale.value = withSpring(1, { damping: 18, stiffness: 220 });
        }}
        onPress={onPress}
        style={[styles.chipButton, selected && styles.chipButtonSelected]}
      >
        <View style={[styles.chipIconWrap, selected && styles.chipIconWrapSelected]}>
          <Icon size={16} color={selected ? Colors.light : Colors.primary} />
        </View>

        <Text style={[styles.chipText, selected && styles.chipTextSelected]} numberOfLines={2}>
          {item.label}
        </Text>
      </Pressable>
    </Animated.View>
  );
}

export default function CadastroScreen() {
  // Hook customizado para lógica de formulário
  const {
    nome, setNome,
    email, setEmail,
    senha, setSenha,
    confirmarSenha, setConfirmarSenha,
    foodPreferences, setFoodPreferences,
    allergies, setAllergies,
    otherRestrictions, setOtherRestrictions,
    errors, setErrors,
    isLoading,
    isSuccess,
    toggleSelection,
    handleRegister,
  } = useCadastroForm();

  // Estados locais de UI
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [focusedInput, setFocusedInput] = useState<string | null>(null);
  const [foodSectionOpen, setFoodSectionOpen] = useState(true);
  const [allergySectionOpen, setAllergySectionOpen] = useState(false);

  // Redirecionamento após sucesso
  useEffect(() => {
    if (isSuccess) {
      const timer = setTimeout(() => {
        router.push("/(auth)/login");
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, [isSuccess]);

  const reqs = getPasswordRequirements(senha);

  // Renderiza item da lista de requisitos da senha
  const renderReqItem = (label: string, met: boolean) => (
    <View style={styles.passwordReqItem}>
      {met ? (
        <CheckCircle size={14} color={Colors.success} />
      ) : (
        <View style={styles.passwordReqCircle} />
      )}
      <Text style={met ? styles.passwordReqTextMet : styles.passwordReqTextUnmet}>
        {label}
      </Text>
    </View>
  );

  // Renderiza o formulário
  return (
    <KeyboardAvoidingView
      style={styles.keyboardAvoid}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      <ScrollView
        contentContainerStyle={styles.container}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        {/* Cabeçalho */}
        <Animated.View entering={FadeInUp.delay(100).duration(600)} style={styles.header}>
          <Image
            source={require("../../assets/images/icon.png")}
            style={styles.logo}
            resizeMode="contain"
          />
          <Text style={styles.brandName}>Quase Chef!</Text>
          <Text style={styles.welcomeTitle}>Criar Conta</Text>
          <Text style={styles.welcomeSubtitle}>Sua jornada para evitar o desperdício começa aqui.</Text>
        </Animated.View>

        {/* Alertas de Feedback */}
        {isSuccess && (
          <Animated.View entering={FadeInDown} exiting={FadeOut} style={styles.successAlert}>
            <CheckCircle size={15} color="white" />
            <Text style={styles.successAlertText}>Conta criada! Redirecionando para o login...</Text>
          </Animated.View>
        )}

        {errors.geral && !isSuccess && (
          <Animated.View entering={FadeInDown} style={styles.errorAlert}>
            <Text style={styles.errorAlertText}>{errors.geral}</Text>
          </Animated.View>
        )}

        {/* Campos de Input */}
        <Animated.View entering={FadeInDown.delay(300).duration(600)} style={styles.inputGroup}>
          <Text style={styles.label}>Nome Completo</Text>
          <View style={[styles.inputContainer, focusedInput === "nome" && styles.inputContainerFocused, errors.nome && { borderColor: Colors.errorDark, backgroundColor: Colors.errorLight }]}>
            <User size={18} color={errors.nome ? Colors.errorDark : focusedInput === "nome" ? Colors.primary : Colors.subtitle} />
            <TextInput
              style={styles.input}
              placeholder="Digite seu nome completo"
              placeholderTextColor={Colors.subtitle + "99"}
              onFocus={() => setFocusedInput("nome")}
              onBlur={() => setFocusedInput(null)}
              onChangeText={(t) => {
                setNome(t);
                setErrors({ ...errors, nome: null, geral: null });
              }}
              value={nome}
            />
          </View>
          {errors.nome && <Text style={styles.fieldErrorText}>{errors.nome}</Text>}

          <Text style={styles.label}>E-mail</Text>
          <View style={[styles.inputContainer, focusedInput === "email" && styles.inputContainerFocused, errors.email && { borderColor: Colors.errorDark, backgroundColor: Colors.errorLight }]}>
            <Mail size={18} color={errors.email ? Colors.errorDark : focusedInput === "email" ? Colors.primary : Colors.subtitle} />
            <TextInput
              style={styles.input}
              placeholder="seu@email.com"
              placeholderTextColor={Colors.subtitle + "99"}
              keyboardType="email-address"
              autoCapitalize="none"
              onFocus={() => setFocusedInput("email")}
              onBlur={() => setFocusedInput(null)}
              onChangeText={(t) => {
                setEmail(t);
                setErrors({ ...errors, email: null, geral: null });
              }}
              value={email}
            />
          </View>
          {errors.email && <Text style={styles.fieldErrorText}>{errors.email}</Text>}

          <Text style={styles.label}>Senha</Text>
          <View style={[styles.inputContainer, focusedInput === "senha" && styles.inputContainerFocused, errors.senha && { borderColor: Colors.errorDark, backgroundColor: Colors.errorLight }]}>
            <Lock size={18} color={errors.senha ? Colors.errorDark : focusedInput === "senha" ? Colors.primary : Colors.subtitle} />
            <TextInput
              style={styles.input}
              placeholder="Digite sua senha"
              placeholderTextColor={Colors.subtitle + "99"}
              secureTextEntry={!showPassword}
              maxLength={8}
              onFocus={() => setFocusedInput("senha")}
              onBlur={() => setFocusedInput(null)}
              onChangeText={(t) => {
                setSenha(t);
                setErrors({ ...errors, senha: null, geral: null });
              }}
              value={senha}
            />
            <Pressable onPress={() => setShowPassword(!showPassword)}>
              {showPassword ? <EyeOff size={20} color={Colors.primary} /> : <Eye size={20} color={Colors.primary} />}
            </Pressable>
          </View>

          {/* Validação de Senha em Tempo Real */}
          <View style={styles.passwordRequirements}>
            {renderReqItem("Ter exatamente 8 caracteres", reqs.exactLength)}
            {renderReqItem("Pelo menos uma letra", reqs.hasLetter)}
            {renderReqItem("Pelo menos um símbolo", reqs.hasSymbol)}
          </View>

          <Text style={styles.label}>Confirmar Senha</Text>
          <View style={[styles.inputContainer, focusedInput === "conf" && styles.inputContainerFocused, errors.confirmarSenha && { borderColor: Colors.errorDark, backgroundColor: Colors.errorLight }]}>
            <CheckCircle size={18} color={errors.confirmarSenha ? Colors.errorDark : focusedInput === "conf" ? Colors.primary : Colors.subtitle} />
            <TextInput
              style={styles.input}
              placeholder="Repita a senha"
              placeholderTextColor={Colors.subtitle + "99"}
              secureTextEntry={!showConfirmPassword}
              maxLength={8}
              onFocus={() => setFocusedInput("conf")}
              onBlur={() => setFocusedInput(null)}
              onChangeText={(t) => {
                setConfirmarSenha(t);
                setErrors({ ...errors, confirmarSenha: null, geral: null });
              }}
              value={confirmarSenha}
            />
            <Pressable onPress={() => setShowConfirmPassword(!showConfirmPassword)}>
              {showConfirmPassword ? <EyeOff size={20} color={Colors.primary} /> : <Eye size={20} color={Colors.primary} />}
            </Pressable>
          </View>
          {errors.confirmarSenha && <Text style={styles.fieldErrorText}>{errors.confirmarSenha}</Text>}

          {/* Preferências Alimentares */}
          <View style={styles.accordionSection}>
            <Pressable style={styles.accordionHeader} onPress={() => setFoodSectionOpen(!foodSectionOpen)}>
              <View style={styles.accordionHeaderLeft}>
                <View style={styles.sectionIconBadge}>
                  <ChefHat size={16} color={Colors.primary} />
                </View>
                <View style={styles.accordionTitleWrap}>
                  <View style={styles.accordionTitleRow}>
                    <Text style={styles.sectionTitle}>Preferências alimentares</Text>
                    <View style={styles.optionalPill}><Text style={styles.optionalPillText}>opcional</Text></View>
                  </View>
                  <Text style={styles.sectionDescription}>Personalize suas receitas com base nos seus hábitos.</Text>
                </View>
              </View>
              {foodSectionOpen ? <ChevronUp size={18} color={Colors.subtext} /> : <ChevronDown size={18} color={Colors.subtext} />}
            </Pressable>

            {foodSectionOpen && (
              <View style={styles.accordionContent}>
                <Text style={styles.sectionHelper}>Selecione quantas opções quiser.</Text>
                <View style={styles.chipsGrid}>
                  {FOOD_PREFERENCE_OPTIONS.map((item) => (
                    <PreferenceCard
                      key={item.key}
                      item={item}
                      selected={foodPreferences.includes(item.key)}
                      onPress={() => toggleSelection(item.key, foodPreferences, setFoodPreferences)}
                    />
                  ))}
                </View>
              </View>
            )}
          </View>

          {/* Alergias */}
          <View style={styles.accordionSection}>
            <Pressable style={styles.accordionHeader} onPress={() => setAllergySectionOpen(!allergySectionOpen)}>
              <View style={styles.accordionHeaderLeft}>
                <View style={[styles.sectionIconBadge, styles.sectionIconBadgeWarning]}>
                  <AlertTriangle size={16} color={Colors.primary} />
                </View>
                <View style={styles.accordionTitleWrap}>
                  <View style={styles.accordionTitleRow}>
                    <Text style={styles.sectionTitle}>Alergias alimentares</Text>
                    <View style={styles.optionalPill}><Text style={styles.optionalPillText}>opcional</Text></View>
                  </View>
                  <Text style={styles.sectionDescription}>Informe restrições para sugestões seguras.</Text>
                </View>
              </View>
              {allergySectionOpen ? <ChevronUp size={18} color={Colors.subtext} /> : <ChevronDown size={18} color={Colors.subtext} />}
            </Pressable>

            {allergySectionOpen && (
              <View style={styles.accordionContent}>
                <Text style={styles.sectionHelper}>Essas informações ajudam na sua segurança.</Text>
                <View style={styles.chipsGrid}>
                  {ALLERGY_OPTIONS.map((item) => (
                    <PreferenceCard
                      key={item.key}
                      item={item}
                      selected={allergies.includes(item.key)}
                      onPress={() => toggleSelection(item.key, allergies, setAllergies)}
                    />
                  ))}
                </View>
                <Text style={styles.label}>Outras restrições</Text>
                <View style={[styles.inputContainer, styles.textAreaContainer, focusedInput === "outras_restricoes" && styles.inputContainerFocused]}>
                  <TextInput
                    style={styles.textArea}
                    multiline
                    placeholder="Ex.: intolerâncias específicas, orientação médica..."
                    placeholderTextColor={Colors.subtitle + "99"}
                    value={otherRestrictions}
                    onFocus={() => setFocusedInput("outras_restricoes")}
                    onBlur={() => setFocusedInput(null)}
                    onChangeText={setOtherRestrictions}
                  />
                </View>
              </View>
            )}
          </View>

          <Text style={styles.afterAccordionText}>Poderá atualizar isso depois em Perfil {">"} Preferências.</Text>

          {/* Botão de Cadastro */}
          <Pressable
            style={[styles.buttonPrimary, (isSuccess || isLoading) && styles.buttonPrimaryDisabled]}
            onPress={handleRegister}
            disabled={isSuccess || isLoading}
          >
            {isLoading ? <ActivityIndicator color="#FFF" /> : <Text style={styles.buttonPrimaryText}>{isSuccess ? "Cadastrado!" : "Criar minha conta"}</Text>}
          </Pressable>
        </Animated.View>

        {/* Rodapé */}
        <Animated.View entering={FadeInDown.delay(500).duration(600)}>

          <Text style={styles.footerText}>
            Já tem uma conta? <Text style={styles.primaryLink} onPress={() => router.push("/(auth)/login")}>Entre aqui</Text>
          </Text>

          <Text style={styles.legalText}>
            Ao se cadastrar, você aceita nossos <Text style={styles.linkUnderline}>Termos</Text> e <Text style={styles.linkUnderline}>Privacidade</Text>.
          </Text>
        </Animated.View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}