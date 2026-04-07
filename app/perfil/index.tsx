import * as ImagePicker from "expo-image-picker";
import { useRouter } from "expo-router";
import { useEffect, useMemo, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Image,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

// Ícones
import {
  AlertCircle,
  Camera,
  CheckCircle,
  ChevronRight,
  Leaf,
  Lightbulb,
  LogOut,
  Pencil,
  RotateCcw,
  Settings,
  User as UserIcon,
} from "lucide-react-native";

// Tema e Estilos
import { Header } from "../../components/header";
import { Colors } from "../../constants/theme";
import { perfilStyles as styles } from "../../styles/perfil_styles";

// Backend
import { useAuth } from "@/hooks/useAuth";
import { updateUserProfile, uploadAvatar } from "@/services/authService";
import AsyncStorage from "@react-native-async-storage/async-storage";

type TemporaryMode = "always_on" | "paused" | "weekends_only";

const LIFESTYLE_OPTIONS = [
  "Vegana",
  "Vegetariana",
  "Sem glúten",
  "Sem lactose",
  "Baixo carbo",
  "Sem açúcar",
];

const ALLERGY_OPTIONS = [
  "Amendoim",
  "Nozes",
  "Leite",
  "Ovo",
  "Soja",
  "Trigo",
  "Gergelim",
  "Frutos do mar",
];

const STORAGE_KEYS = {
  lifestyle: "@perfil_food_lifestyle",
  allergies: "@perfil_food_allergies",
  otherRestrictions: "@perfil_food_other_restrictions",
  temporaryMode: "@perfil_food_temporary_mode",
  updatedAt: "@perfil_food_updated_at",
};

export default function PerfilScreen() {
  const router = useRouter();
  const { user } = useAuth();

  // --- ESTADOS JÁ EXISTENTES ---
  const [userId, setUserId] = useState<string | null>(null);
  const [nome, setNome] = useState("Carregando...");
  const [email, setEmail] = useState("");
  const [fotoUrl, setFotoUrl] = useState("");
  const [isUpdating, setIsUpdating] = useState(false);
  const [loadingImage, setLoadingImage] = useState(false);

  // --- NOVOS ESTADOS: PREFERÊNCIAS ALIMENTARES (LOCAL / ASYNCSTORAGE) ---
  const [isEditingPreferences, setIsEditingPreferences] = useState(false);
  const [lifestylePreferences, setLifestylePreferences] = useState<string[]>(
    [],
  );
  const [foodAllergies, setFoodAllergies] = useState<string[]>([]);
  const [otherRestrictions, setOtherRestrictions] = useState("");
  const [temporaryMode, setTemporaryMode] =
    useState<TemporaryMode>("always_on");
  const [preferencesUpdatedAt, setPreferencesUpdatedAt] = useState("");
  const [isSavingPreferences, setIsSavingPreferences] = useState(false);

  // --- PREENCHER OS DADOS ---
  useEffect(() => {
    const carregarDados = async () => {
      // Dados do perfil já existentes
      const idSalvo = await AsyncStorage.getItem("@user_id");
      const nomeSalvo = await AsyncStorage.getItem("@user_full_name");
      const emailSalvo = await AsyncStorage.getItem("@user_email");
      const fotoSalva = await AsyncStorage.getItem("@user_foto");

      setUserId(user?.id || idSalvo);
      setNome(user?.full_name || nomeSalvo || "Usuário");
      setEmail(user?.email || emailSalvo || "");
      setFotoUrl(user?.avatar_url || fotoSalva || "");

      // Preferências alimentares locais
      const lifestyleSalvo = await AsyncStorage.getItem(STORAGE_KEYS.lifestyle);
      const allergiesSalvo = await AsyncStorage.getItem(STORAGE_KEYS.allergies);
      const otherRestrictionsSalvo = await AsyncStorage.getItem(
        STORAGE_KEYS.otherRestrictions,
      );
      const temporaryModeSalvo = await AsyncStorage.getItem(
        STORAGE_KEYS.temporaryMode,
      );
      const updatedAtSalvo = await AsyncStorage.getItem(STORAGE_KEYS.updatedAt);

      if (lifestyleSalvo) {
        setLifestylePreferences(JSON.parse(lifestyleSalvo));
      }

      if (allergiesSalvo) {
        setFoodAllergies(JSON.parse(allergiesSalvo));
      }

      if (otherRestrictionsSalvo) {
        setOtherRestrictions(otherRestrictionsSalvo);
      }

      if (
        temporaryModeSalvo === "always_on" ||
        temporaryModeSalvo === "paused" ||
        temporaryModeSalvo === "weekends_only"
      ) {
        setTemporaryMode(temporaryModeSalvo);
      }

      if (updatedAtSalvo) {
        setPreferencesUpdatedAt(updatedAtSalvo);
      }
    };

    carregarDados();
  }, [user]);

  // --- HELPERS ---
  const formatLastUpdated = () => {
    const now = new Date();
    const hours = String(now.getHours()).padStart(2, "0");
    const minutes = String(now.getMinutes()).padStart(2, "0");
    return `hoje, ${hours}h${minutes}`;
  };

  const toggleLifestylePreference = (option: string) => {
    setLifestylePreferences((prev) =>
      prev.includes(option)
        ? prev.filter((item) => item !== option)
        : [...prev, option],
    );
  };

  const toggleFoodAllergy = (option: string) => {
    setFoodAllergies((prev) =>
      prev.includes(option)
        ? prev.filter((item) => item !== option)
        : [...prev, option],
    );
  };

  const saveFoodPreferences = async () => {
    try {
      setIsSavingPreferences(true);

      const updatedAt = formatLastUpdated();

      await AsyncStorage.multiSet([
        [STORAGE_KEYS.lifestyle, JSON.stringify(lifestylePreferences)],
        [STORAGE_KEYS.allergies, JSON.stringify(foodAllergies)],
        [STORAGE_KEYS.otherRestrictions, otherRestrictions],
        [STORAGE_KEYS.temporaryMode, temporaryMode],
        [STORAGE_KEYS.updatedAt, updatedAt],
      ]);

      setPreferencesUpdatedAt(updatedAt);
      setIsEditingPreferences(false);
      Alert.alert(
        "Sucesso",
        "Preferências alimentares atualizadas com sucesso!",
      );
    } catch (error) {
      console.error("Erro ao salvar preferências alimentares:", error);
      Alert.alert(
        "Erro",
        "Não foi possível salvar as preferências no momento.",
      );
    } finally {
      setIsSavingPreferences(false);
    }
  };

  const modeDescription = useMemo(() => {
    if (temporaryMode === "paused") {
      return "Modo “Pausado” desativa temporariamente apenas os filtros de estilo alimentar e outras preferências. Suas configurações são mantidas e podem ser reativadas quando quiser. As alergias permanecem sempre ativas para sua segurança.";
    }

    if (temporaryMode === "weekends_only") {
      return "No modo “Só nos fins de semana”, suas preferências de estilo alimentar ficam flexíveis aos sábados e domingos. As alergias continuam sendo respeitadas em todos os momentos.";
    }

    return "No modo “Sempre ativo”, suas preferências alimentares são aplicadas normalmente. As alergias são sempre consideradas para garantir sua segurança.";
  }, [temporaryMode]);

  const temporaryModeLabel = useMemo(() => {
    if (temporaryMode === "paused") return "Pausado";
    if (temporaryMode === "weekends_only") return "Só nos fins de semana";
    return "Sempre ativo";
  }, [temporaryMode]);

  const lifestyleSummary =
    lifestylePreferences.length > 0 ? lifestylePreferences : [];

  const allergiesSummary =
    foodAllergies.length > 0
      ? foodAllergies.join(", ")
      : "Nenhuma alergia informada";

  const otherRestrictionsSummary =
    otherRestrictions.trim().length > 0
      ? otherRestrictions.trim()
      : "Nenhuma restrição adicional informada";

  // --- FUNÇÕES JÁ EXISTENTES ---
  const handleBack = () => {
    if (router.canGoBack()) {
      router.back();
    } else {
      router.replace("/(tabs)/home");
    }
  };

  const pickImage = async () => {
    try {
      setLoadingImage(true);
      const { status } =
        await ImagePicker.requestMediaLibraryPermissionsAsync();

      if (status !== "granted") {
        Alert.alert("Permissão Negada", "Acesso às fotos é necessário.");
        return;
      }

      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.7,
      });

      if (!result.canceled) setFotoUrl(result.assets[0].uri);
    } catch (error) {
      console.error(error);
    } finally {
      setLoadingImage(false);
    }
  };

  const handleSave = async () => {
    if (!userId) {
      Alert.alert(
        "Sessão Expirada",
        "Por favor, faça logout e login novamente.",
      );
      return;
    }

    try {
      setLoadingImage(true);
      setIsUpdating(true);

      if (fotoUrl && !fotoUrl.startsWith("http")) {
        const novaUrl = await uploadAvatar(userId, nome, fotoUrl);
        setFotoUrl(novaUrl);
        await AsyncStorage.setItem("@user_foto", novaUrl);
      }

      await updateUserProfile(userId, nome, email);

      await AsyncStorage.setItem("@user_full_name", nome);
      await AsyncStorage.setItem("@user_email", email);

      Alert.alert("Sucesso", "Perfil atualizado com sucesso!");
    } catch (error) {
      console.error("Erro ao salvar perfil:", error);
      Alert.alert("Erro", "Não foi possível salvar os dados no momento.");
    } finally {
      setLoadingImage(false);
      setIsUpdating(false);
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.keyboardContainer}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
    >
      <Header
        title="Meu Perfil"
        centerTitle
        showSearch={false}
        onBack={handleBack}
      />

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* Avatar Section */}
        <View style={styles.avatarSection}>
          <TouchableOpacity
            style={styles.avatarCircle}
            onPress={pickImage}
            activeOpacity={0.8}
          >
            {fotoUrl ? (
              <Image source={{ uri: fotoUrl }} style={styles.avatarImage} />
            ) : (
              <UserIcon size={50} color={Colors.subtitle} />
            )}
            <View style={styles.cameraBadge}>
              <Camera size={16} color={Colors.light} />
            </View>
            {loadingImage && (
              <View style={styles.loadingOverlay}>
                <ActivityIndicator color={Colors.light} />
              </View>
            )}
          </TouchableOpacity>
          <Text style={styles.userNameDisplay}>{nome}</Text>
          <Text style={styles.memberSince}>Membro desde Março 2026</Text>
        </View>

        {/* Card: Meus Dados */}
        <View style={styles.sectionCard}>
          <View style={styles.sectionHeader}>
            <UserIcon size={20} color={Colors.primary} />
            <Text style={styles.sectionTitle}>Meus Dados</Text>
          </View>

          <View style={styles.inputBlock}>
            <Text style={styles.inputLabel}>Nome Completo</Text>
            <View style={styles.inputRow}>
              <TextInput
                style={styles.textInput}
                value={nome}
                onChangeText={setNome}
              />
              <Pencil size={14} color={Colors.subtext} />
            </View>
          </View>

          <View style={styles.inputBlock}>
            <Text style={styles.inputLabel}>Email</Text>
            <View style={styles.inputRow}>
              <TextInput
                style={styles.textInput}
                value={email}
                onChangeText={setEmail}
              />
              <Pencil size={14} color={Colors.subtext} />
            </View>
          </View>
        </View>

        {/* Card: Preferências Alimentares */}
        <View style={styles.sectionCard}>
          <View style={styles.sectionHeader}>
            <Settings size={20} color={Colors.primary} />
            <Text style={styles.sectionTitle}>Preferências alimentares</Text>
          </View>

          <Text style={styles.prefDescription}>
            Gerencie suas escolhas e ajuste temporariamente seus filtros sem
            perder suas configurações.
          </Text>

          {/* Estilo alimentar */}
          <View style={styles.preferenceBlock}>
            <Text style={styles.preferenceLabel}>Estilo alimentar</Text>

            {lifestyleSummary.length > 0 ? (
              <View style={styles.chipsContainer}>
                {lifestyleSummary.map((item) => (
                  <View key={item} style={styles.chip}>
                    <Text style={styles.chipText}>{item}</Text>
                  </View>
                ))}
              </View>
            ) : (
              <Text style={styles.preferenceValueMuted}>
                Nenhuma preferência alimentar selecionada.
              </Text>
            )}
          </View>

          {/* Alergias */}
          <View style={styles.preferenceRow}>
            <View style={styles.preferenceRowLeft}>
              <Text style={styles.preferenceLabel}>Alergias</Text>
              <Text style={styles.preferenceValue}>{allergiesSummary}</Text>
            </View>
          </View>

          {/* Outras restrições */}
          <View style={styles.preferenceRow}>
            <View style={styles.preferenceRowLeft}>
              <Text style={styles.preferenceLabel}>Outras restrições</Text>
              <Text
                style={
                  otherRestrictions.trim().length > 0
                    ? styles.preferenceValue
                    : styles.preferenceValueMuted
                }
              >
                {otherRestrictionsSummary}
              </Text>
            </View>
          </View>

          {/* Modo temporário */}
          <View style={styles.temporaryModeCard}>
            <View style={styles.temporaryModeHeader}>
              <View style={styles.temporaryModeIconWrap}>
                <RotateCcw size={20} color={Colors.subtitle} />
              </View>

              <View style={styles.temporaryModeHeaderText}>
                <Text style={styles.temporaryModeTitle}>Modo temporário</Text>
                <Text style={styles.temporaryModeSubtitle}>
                  Pause restrições sem perder suas configurações
                </Text>
              </View>
            </View>

            <View style={styles.segmentedControl}>
              <TouchableOpacity
                style={[
                  styles.segmentButton,
                  temporaryMode === "always_on" && styles.segmentButtonActive,
                ]}
                activeOpacity={0.8}
                onPress={() => setTemporaryMode("always_on")}
              >
                <Text
                  style={[
                    styles.segmentButtonText,
                    temporaryMode === "always_on" &&
                      styles.segmentButtonTextActive,
                  ]}
                >
                  Sempre ativo
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[
                  styles.segmentButton,
                  temporaryMode === "paused" && styles.segmentButtonActive,
                ]}
                activeOpacity={0.8}
                onPress={() => setTemporaryMode("paused")}
              >
                <Text
                  style={[
                    styles.segmentButtonText,
                    temporaryMode === "paused" &&
                      styles.segmentButtonTextActive,
                  ]}
                >
                  Pausado
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[
                  styles.segmentButton,
                  temporaryMode === "weekends_only" &&
                    styles.segmentButtonActive,
                ]}
                activeOpacity={0.8}
                onPress={() => setTemporaryMode("weekends_only")}
              >
                <Text
                  style={[
                    styles.segmentButtonText,
                    temporaryMode === "weekends_only" &&
                      styles.segmentButtonTextActive,
                  ]}
                  numberOfLines={2}
                ></Text>
              </TouchableOpacity>
            </View>

            <View style={styles.modeHintBox}>
              <Lightbulb size={18} color={Colors.warning || Colors.secondary} />
              <Text style={styles.modeHintText}>{modeDescription}</Text>
            </View>

            <View style={styles.lastUpdatedRow}>
              <Text style={styles.lastUpdatedLabel}>Última alteração</Text>
              <Text style={styles.lastUpdatedValue}>
                {preferencesUpdatedAt || "Ainda não atualizada"}
              </Text>
            </View>
          </View>

          <TouchableOpacity
            style={styles.editPreferencesButton}
            activeOpacity={0.8}
            onPress={() => setIsEditingPreferences((prev) => !prev)}
          >
            <Text style={styles.editPreferencesText}>
              {isEditingPreferences ? "Fechar edição" : "Editar preferências"}
            </Text>
            <ChevronRight
              size={18}
              color={Colors.primary}
              style={isEditingPreferences ? styles.chevronExpanded : undefined}
            />
          </TouchableOpacity>

          {/* Editor inline */}
          {isEditingPreferences && (
            <View style={styles.editorContainer}>
              <View style={styles.editorSection}>
                <View style={styles.editorSectionHeader}>
                  <Leaf size={18} color={Colors.success} />
                  <Text style={styles.editorSectionTitle}>
                    Estilo alimentar
                  </Text>
                </View>

                <View style={styles.chipsContainer}>
                  {LIFESTYLE_OPTIONS.map((option) => {
                    const isSelected = lifestylePreferences.includes(option);
                    return (
                      <TouchableOpacity
                        key={option}
                        style={[
                          styles.selectableChip,
                          isSelected && styles.selectableChipActive,
                        ]}
                        activeOpacity={0.8}
                        onPress={() => toggleLifestylePreference(option)}
                      >
                        <Text
                          style={[
                            styles.selectableChipText,
                            isSelected && styles.selectableChipTextActive,
                          ]}
                        >
                          {option}
                        </Text>
                      </TouchableOpacity>
                    );
                  })}
                </View>
              </View>

              <View style={styles.editorSection}>
                <View style={styles.editorSectionHeader}>
                  <AlertCircle size={18} color={Colors.secondary} />
                  <Text style={styles.editorSectionTitle}>Alergias</Text>
                </View>

                <View style={styles.chipsContainer}>
                  {ALLERGY_OPTIONS.map((option) => {
                    const isSelected = foodAllergies.includes(option);
                    return (
                      <TouchableOpacity
                        key={option}
                        style={[
                          styles.selectableChip,
                          isSelected && styles.selectableChipActive,
                        ]}
                        activeOpacity={0.8}
                        onPress={() => toggleFoodAllergy(option)}
                      >
                        <Text
                          style={[
                            styles.selectableChipText,
                            isSelected && styles.selectableChipTextActive,
                          ]}
                        >
                          {option}
                        </Text>
                      </TouchableOpacity>
                    );
                  })}
                </View>
              </View>

              <View style={styles.editorSection}>
                <Text style={styles.editorSectionTitle}>Outras restrições</Text>
                <Text style={styles.editorHelperText}>
                  Descreva aqui preferências ou restrições não listadas acima.
                </Text>

                <TextInput
                  style={styles.restrictionsInput}
                  value={otherRestrictions}
                  onChangeText={setOtherRestrictions}
                  placeholder="Ex.: Evitar alimentos muito apimentados ou ingredientes específicos."
                  placeholderTextColor={Colors.subtext}
                  multiline
                  textAlignVertical="top"
                />
              </View>

              <TouchableOpacity
                style={styles.preferencesSaveButton}
                activeOpacity={0.8}
                onPress={saveFoodPreferences}
                disabled={isSavingPreferences}
              >
                {isSavingPreferences ? (
                  <ActivityIndicator color={Colors.light} />
                ) : (
                  <>
                    <CheckCircle size={18} color={Colors.light} />
                    <Text style={styles.preferencesSaveButtonText}>
                      Salvar preferências alimentares
                    </Text>
                  </>
                )}
              </TouchableOpacity>
            </View>
          )}
        </View>

        {/* Ações Inferiores */}
        <View style={styles.footerActions}>
          <TouchableOpacity
            style={styles.logoutButtonInline}
            onPress={async () => {
              try {
                await AsyncStorage.clear();
                router.replace("/(auth)/login");
              } catch (error) {
                console.error("Erro ao limpar a sessão:", error);
              }
            }}
          >
            <LogOut size={18} color={Colors.errorDark} />
            <Text style={styles.logoutTextInline}>Sair</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.mainSaveButton}
            onPress={handleSave}
            disabled={isUpdating}
          >
            {isUpdating ? (
              <ActivityIndicator color={Colors.light} />
            ) : (
              <>
                <CheckCircle size={20} color={Colors.light} />
                <Text style={styles.mainSaveText}>Salvar</Text>
              </>
            )}
          </TouchableOpacity>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
