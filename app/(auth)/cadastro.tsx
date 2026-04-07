import { FontAwesome5 } from "@expo/vector-icons";
import { router } from "expo-router";
import {
  AlertTriangle,
  Candy,
  CheckCircle,
  ChefHat,
  ChevronDown,
  ChevronUp,
  Drumstick,
  Egg,
  Eye,
  EyeOff,
  Fish,
  Leaf,
  Lock,
  Mail,
  Milk,
  Nut,
  User,
  Wheat,
} from "lucide-react-native";
import React, { useState } from "react";
import {
  ActivityIndicator,
  Image,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  Text,
  TextInput,
  View,
} from "react-native";
import Animated, {
  FadeInDown,
  FadeInUp,
  FadeOut,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from "react-native-reanimated";

import {
  Colors,
  Fonts,
  FontSizes,
  Radius,
  Spacing,
} from "../../constants/theme";
import { useAuth } from "../../hooks/useAuth";
import { authStyles as styles } from "../../styles/auth_styles";
import {
  getPasswordRequirements,
  isPasswordStrong,
  validateEmail,
  validateName,
} from "../../utils/validation";

const foodPreferenceOptions = [
  { key: "vegano", label: "Vegana", icon: Leaf },
  { key: "vegetariano", label: "Vegetariana", icon: Leaf },
  { key: "sem_gluten", label: "Sem glúten", icon: Wheat },
  { key: "sem_lactose", label: "Sem lactose", icon: Milk },
  { key: "baixo_carboidrato", label: "Baixo carbo", icon: Drumstick },
  { key: "sem_acucar", label: "Sem açúcar", icon: Candy },
];

const allergyOptions = [
  { key: "amendoim", label: "Amendoim", icon: Nut },
  { key: "nozes", label: "Nozes", icon: Nut },
  { key: "leite", label: "Leite", icon: Milk },
  { key: "ovo", label: "Ovo", icon: Egg },
  { key: "soja", label: "Soja", icon: Leaf },
  { key: "trigo", label: "Trigo", icon: Wheat },
  { key: "gergelim", label: "Gergelim", icon: Wheat },
  { key: "frutos_do_mar", label: "Frutos do mar", icon: Fish },
];

type OptionItem = {
  key: string;
  label: string;
  icon: any;
};

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
        <View
          style={[styles.chipIconWrap, selected && styles.chipIconWrapSelected]}
        >
          <Icon size={16} color={selected ? Colors.light : Colors.primary} />
        </View>

        <Text
          style={[styles.chipText, selected && styles.chipTextSelected]}
          numberOfLines={2}
        >
          {item.label}
        </Text>
      </Pressable>
    </Animated.View>
  );
}

export default function CadastroScreen() {
  const { signUp, isLoading } = useAuth();
  const [nome, setNome] = useState("");
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [confirmarSenha, setConfirmarSenha] = useState("");
  const [errors, setErrors] = useState<any>({});
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [focusedInput, setFocusedInput] = useState<string | null>(null);
  const [isSuccess, setIsSuccess] = useState(false);

  const [foodPreferences, setFoodPreferences] = useState<string[]>([]);
  const [allergies, setAllergies] = useState<string[]>([]);
  const [otherRestrictions, setOtherRestrictions] = useState("");

  const [foodSectionOpen, setFoodSectionOpen] = useState(true);
  const [allergySectionOpen, setAllergySectionOpen] = useState(false);

  const reqs = getPasswordRequirements(senha);

  const toggleSelection = (
    key: string,
    currentList: string[],
    setter: React.Dispatch<React.SetStateAction<string[]>>,
  ) => {
    if (currentList.includes(key)) {
      setter(currentList.filter((item) => item !== key));
    } else {
      setter([...currentList, key]);
    }
  };

  const handleRegister = async () => {
    let newErrors: any = {};
    if (!validateName(nome)) newErrors.nome = "Nome deve ter 3-50 caracteres.";
    if (!validateEmail(email)) newErrors.email = "E-mail inválido.";
    if (!isPasswordStrong(senha))
      newErrors.senha = "Senha fora do padrão exigido.";
    if (senha !== confirmarSenha)
      newErrors.confirmarSenha = "As senhas não coincidem.";

    setErrors(newErrors);

    if (Object.keys(newErrors).length === 0) {
      try {
        const result = await signUp(nome, email, senha);

        if (result.success) {
          setIsSuccess(true);

          setTimeout(() => {
            router.push("/(auth)/login");
          }, 2000);
        } else {
          setErrors({ geral: result.error || "Erro ao criar conta." });
        }
      } catch {
        setErrors({ geral: "Erro de conexão com o servidor." });
      }
    }
  };

  const renderReqItem = (label: string, met: boolean) => (
    <View
      style={{
        flexDirection: "row",
        alignItems: "center",
        gap: 8,
        marginBottom: 4,
      }}
    >
      {met ? (
        <CheckCircle size={14} color={Colors.success} />
      ) : (
        <View
          style={{
            width: 14,
            height: 14,
            borderRadius: 7,
            borderWidth: 1,
            borderColor: Colors.subtext,
            opacity: 0.5,
          }}
        />
      )}
      <Text
        style={{
          fontSize: 13,
          color: met ? Colors.success : Colors.subtext,
          fontFamily: Fonts.medium,
        }}
      >
        {label}
      </Text>
    </View>
  );

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
          <Text style={styles.welcomeTitle}>Criar Conta</Text>
          <Text style={styles.welcomeSubtitle}>
            Sua jornada para evitar o desperdício começa aqui.
          </Text>
        </Animated.View>

        {isSuccess && (
          <Animated.View
            entering={FadeInDown}
            exiting={FadeOut}
            style={{
              backgroundColor: Colors.success,
              padding: Spacing.sm,
              borderRadius: Radius.lg,
              flexDirection: "row",
              alignItems: "center",
              gap: Spacing.md,
              marginTop: Spacing.xs,
              marginBottom: Spacing.xs,
            }}
          >
            <CheckCircle size={15} color="white" />
            <Text
              style={{
                fontSize: FontSizes.small,
                color: Colors.light,
                fontWeight: "bold",
              }}
            >
              Conta criada! Redirecionando para o login...
            </Text>
          </Animated.View>
        )}

        {errors.geral && !isSuccess && (
          <Animated.View
            entering={FadeInDown}
            style={{
              marginBottom: 10,
              backgroundColor: Colors.errorLight,
              padding: 10,
              borderRadius: 8,
            }}
          >
            <Text
              style={{
                color: Colors.errorDark,
                textAlign: "center",
                fontSize: 14,
              }}
            >
              {errors.geral}
            </Text>
          </Animated.View>
        )}

        <Animated.View
          entering={FadeInDown.delay(300).duration(600)}
          style={styles.inputGroup}
        >
          <Text style={styles.label}>Nome Completo</Text>
          <View
            style={[
              styles.inputContainer,
              focusedInput === "nome" && styles.inputContainerFocused,
              errors.nome && {
                borderColor: Colors.errorDark,
                backgroundColor: Colors.errorLight,
              },
            ]}
          >
            <User
              size={18}
              color={
                errors.nome
                  ? Colors.errorDark
                  : focusedInput === "nome"
                    ? Colors.primary
                    : Colors.subtitle
              }
            />
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
          {errors.nome && (
            <Text
              style={{
                color: Colors.errorDark,
                fontSize: 12,
                marginTop: 4,
                marginLeft: 4,
                marginBottom: 8,
              }}
            >
              {errors.nome}
            </Text>
          )}

          <Text style={styles.label}>E-mail</Text>
          <View
            style={[
              styles.inputContainer,
              focusedInput === "email" && styles.inputContainerFocused,
              errors.email && {
                borderColor: Colors.errorDark,
                backgroundColor: Colors.errorLight,
              },
            ]}
          >
            <Mail
              size={18}
              color={
                errors.email
                  ? Colors.errorDark
                  : focusedInput === "email"
                    ? Colors.primary
                    : Colors.subtitle
              }
            />
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
          {errors.email && (
            <Text
              style={{
                color: Colors.errorDark,
                fontSize: 12,
                marginTop: 4,
                marginLeft: 4,
                marginBottom: 8,
              }}
            >
              {errors.email}
            </Text>
          )}

          <Text style={styles.label}>Senha</Text>
          <View
            style={[
              styles.inputContainer,
              focusedInput === "senha" && styles.inputContainerFocused,
              errors.senha && {
                borderColor: Colors.errorDark,
                backgroundColor: Colors.errorLight,
              },
            ]}
          >
            <Lock
              size={18}
              color={
                errors.senha
                  ? Colors.errorDark
                  : focusedInput === "senha"
                    ? Colors.primary
                    : Colors.subtitle
              }
            />
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
              {showPassword ? (
                <EyeOff size={20} color={Colors.primary} />
              ) : (
                <Eye size={20} color={Colors.primary} />
              )}
            </Pressable>
          </View>

          <View style={{ marginTop: 10, marginLeft: 4, marginBottom: 10 }}>
            {renderReqItem("Ter exatamente 8 caracteres", reqs.exactLength)}
            {renderReqItem("Pelo menos uma letra", reqs.hasLetter)}
            {renderReqItem("Pelo menos um símbolo", reqs.hasSymbol)}
          </View>

          <Text style={styles.label}>Confirmar Senha</Text>
          <View
            style={[
              styles.inputContainer,
              focusedInput === "conf" && styles.inputContainerFocused,
              errors.confirmarSenha && {
                borderColor: Colors.errorDark,
                backgroundColor: Colors.errorLight,
              },
            ]}
          >
            <CheckCircle
              size={18}
              color={
                errors.confirmarSenha
                  ? Colors.errorDark
                  : focusedInput === "conf"
                    ? Colors.primary
                    : Colors.subtitle
              }
            />
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
            <Pressable
              onPress={() => setShowConfirmPassword(!showConfirmPassword)}
            >
              {showConfirmPassword ? (
                <EyeOff size={20} color={Colors.primary} />
              ) : (
                <Eye size={20} color={Colors.primary} />
              )}
            </Pressable>
          </View>
          {errors.confirmarSenha && (
            <Text
              style={{
                color: Colors.errorDark,
                fontSize: 12,
                marginTop: 4,
                marginLeft: 4,
              }}
            >
              {errors.confirmarSenha}
            </Text>
          )}

          <View style={styles.accordionSection}>
            <Pressable
              style={styles.accordionHeader}
              onPress={() => setFoodSectionOpen(!foodSectionOpen)}
            >
              <View style={styles.accordionHeaderLeft}>
                <View style={styles.sectionIconBadge}>
                  <ChefHat size={16} color={Colors.primary} />
                </View>

                <View style={styles.accordionTitleWrap}>
                  <View style={styles.accordionTitleRow}>
                    <Text style={styles.sectionTitle}>
                      Preferências alimentares
                    </Text>
                    <View style={styles.optionalPill}>
                      <Text style={styles.optionalPillText}>opcional</Text>
                    </View>
                  </View>

                  <Text style={styles.sectionDescription}>
                    Personalize suas receitas e sugestões com base nos seus
                    hábitos alimentares.
                  </Text>
                </View>
              </View>

              {foodSectionOpen ? (
                <ChevronUp size={18} color={Colors.subtext} />
              ) : (
                <ChevronDown size={18} color={Colors.subtext} />
              )}
            </Pressable>

            {foodSectionOpen && (
              <View style={styles.accordionContent}>
                <Text style={styles.sectionHelper}>
                  Selecione quantas opções quiser.
                </Text>

                <View style={styles.chipsGrid}>
                  {foodPreferenceOptions.map((item) => (
                    <PreferenceCard
                      key={item.key}
                      item={item}
                      selected={foodPreferences.includes(item.key)}
                      onPress={() =>
                        toggleSelection(
                          item.key,
                          foodPreferences,
                          setFoodPreferences,
                        )
                      }
                    />
                  ))}
                </View>
              </View>
            )}
          </View>

          <View style={styles.accordionSection}>
            <Pressable
              style={styles.accordionHeader}
              onPress={() => setAllergySectionOpen(!allergySectionOpen)}
            >
              <View style={styles.accordionHeaderLeft}>
                <View
                  style={[
                    styles.sectionIconBadge,
                    styles.sectionIconBadgeWarning,
                  ]}
                >
                  <AlertTriangle size={16} color="#D97706" />
                </View>

                <View style={styles.accordionTitleWrap}>
                  <View style={styles.accordionTitleRow}>
                    <Text style={styles.sectionTitle}>
                      Alergias alimentares
                    </Text>
                    <View style={styles.optionalPill}>
                      <Text style={styles.optionalPillText}>opcional</Text>
                    </View>
                  </View>

                  <Text style={styles.sectionDescription}>
                    Informe suas restrições para evitarmos ingredientes
                    indesejados nas sugestões.
                  </Text>
                </View>
              </View>

              {allergySectionOpen ? (
                <ChevronUp size={18} color={Colors.subtext} />
              ) : (
                <ChevronDown size={18} color={Colors.subtext} />
              )}
            </Pressable>

            {allergySectionOpen && (
              <View style={styles.accordionContent}>
                <Text style={styles.sectionHelper}>
                  Essas informações ajudam a tornar sua experiência mais segura
                  e personalizada.
                </Text>

                <View style={styles.chipsGrid}>
                  {allergyOptions.map((item) => (
                    <PreferenceCard
                      key={item.key}
                      item={item}
                      selected={allergies.includes(item.key)}
                      onPress={() =>
                        toggleSelection(item.key, allergies, setAllergies)
                      }
                    />
                  ))}
                </View>

                <Text style={[styles.label, { marginTop: Spacing.md }]}>
                  Outras restrições
                </Text>

                <Text style={styles.textAreaHelper}>
                  Se necessário, descreva aqui restrições não listadas acima.
                </Text>

                <View
                  style={[
                    styles.inputContainer,
                    styles.textAreaContainer,
                    focusedInput === "outras_restricoes" &&
                      styles.inputContainerFocused,
                  ]}
                >
                  <TextInput
                    style={styles.textArea}
                    multiline
                    placeholder="Ex.: intolerâncias específicas, orientação médica ou preferências pessoais."
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

          <Text style={styles.afterAccordionText}>
            Você poderá atualizar essas informações a qualquer momento em Perfil
            &gt; Preferências.
          </Text>

          <Pressable
            style={[
              styles.buttonPrimary,
              (isSuccess || isLoading) && { opacity: 0.8 },
              { marginTop: 20 },
            ]}
            onPress={handleRegister}
            disabled={isSuccess || isLoading}
          >
            {isLoading ? (
              <ActivityIndicator color="#FFF" />
            ) : (
              <Text style={styles.buttonPrimaryText}>
                {isSuccess ? "Cadastrado!" : "Criar minha conta"}
              </Text>
            )}
          </Pressable>
        </Animated.View>

        <Animated.View entering={FadeInDown.delay(500).duration(600)}>
          <View style={styles.dividerContainer}>
            <View style={styles.dividerLine} />
            <Text style={styles.dividerText}>ou cadastrar-se com</Text>
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

          <Text style={styles.footerText}>
            Já tem uma conta?{" "}
            <Text
              style={styles.primaryLink}
              onPress={() => router.push("/(auth)/login")}
            >
              Entre aqui
            </Text>
          </Text>

          <Text style={styles.legalText}>
            Ao se cadastrar, você aceita nossos{" "}
            <Text style={styles.linkUnderline}>Termos</Text> e{" "}
            <Text style={styles.linkUnderline}>Privacidade</Text>.
          </Text>
        </Animated.View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
