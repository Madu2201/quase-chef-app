import * as ImagePicker from "expo-image-picker";
import { useRouter } from "expo-router";
import { AlertCircle, Camera, CheckCircle, ChevronRight, Leaf, Lightbulb, LogOut, Pencil, Settings, User as UserIcon } from "lucide-react-native";
import { useMemo, useState } from "react";
import { ActivityIndicator, Image, KeyboardAvoidingView, Platform, ScrollView, Text, TextInput, TouchableOpacity, View } from "react-native";

// Meus imports
import { useAuth } from "@/hooks/useAuth";
import { useProfile } from "@/hooks/useProfile";
import { TemporaryMode } from "@/types/perfil";
import { Header } from "../../components/header";
import { ALLERGY_OPTIONS, FOOD_PREFERENCE_OPTIONS } from "../../constants/OpcaoAlimentar";
import { Colors } from "../../constants/theme";
import { perfilStyles as styles } from "../../styles/perfil_styles";

// Tela de Perfil
export default function PerfilScreen() {
  const router = useRouter();
  const { user } = useAuth();
  const { profile, setProfile, preferences, setPreferences, isLoading, isSavingPref, savePreferences, saveBasicProfile } = useProfile(user);
  const [isEditing, setIsEditing] = useState(false);
  const [focusedInput, setFocusedInput] = useState<string | null>(null);

  // Descrições dinâmicas que você tinha originalmente
  const modeDescription = useMemo(() => {
    if (preferences.temporaryMode === "paused") {
      return "Modo “Pausado” desativa temporariamente apenas os filtros de estilo alimentar. As alergias permanecem sempre ativas para sua segurança.";
    }
    if (preferences.temporaryMode === "weekends_only") {
      return "No modo “Final de Semana”, suas preferências de estilo ficam flexíveis aos sábados e domingos. Alergias continuam ativas.";
    }
    return "No modo “Ativo”, suas preferências alimentares são aplicadas normalmente em todas as buscas.";
  }, [preferences.temporaryMode]);

  const toggleOption = (list: 'lifestyle' | 'allergies', val: string) => {
    const next = preferences[list].includes(val)
      ? preferences[list].filter(i => i !== val)
      : [...preferences[list], val];
    setPreferences({ ...preferences, [list]: next });
  };

  return (
    <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === "ios" ? "padding" : undefined}>
      <Header title="Meu Perfil" centerTitle showSearch={false} onBack={() => router.back()} />

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>

        {/* Header de Usuário */}
        <View style={styles.avatarSection}>
          <TouchableOpacity style={styles.avatarCircle} onPress={async () => {
            const res = await ImagePicker.launchImageLibraryAsync({ allowsEditing: true, aspect: [1, 1], quality: 0.7 });
            if (!res.canceled) setProfile({ ...profile, fotoUrl: res.assets[0].uri });
          }}>
            {profile.fotoUrl ? <Image source={{ uri: profile.fotoUrl }} style={styles.avatarImage} /> : <UserIcon size={50} color={Colors.subtitle} />}
            <View style={styles.cameraBadge}><Camera size={16} color="white" /></View>
          </TouchableOpacity>
          <Text style={styles.userNameDisplay}>{profile.nome}</Text>
          <Text style={styles.memberSince}>{profile.membroDesde || "Membro desde 2026"}</Text>
        </View>

        {/* Dados Pessoais */}
        <View style={styles.sectionCard}>
          <View style={styles.sectionHeader}><UserIcon size={20} color={Colors.primary} /><Text style={styles.sectionTitle}>Meus Dados</Text></View>
          <InputField label="Nome Completo" value={profile.nome} onChange={(t) => setProfile({ ...profile, nome: t })} />
          <InputField label="E-mail" value={profile.email} onChange={(t) => setProfile({ ...profile, email: t })} />
        </View>

        {/* Preferências Alimentares */}
        <View style={styles.sectionCard}>
          <View style={styles.sectionHeader}><Settings size={20} color={Colors.primary} /><Text style={styles.sectionTitle}>Preferências Alimentares</Text></View>

          <Text style={styles.prefDescription}>Gerencie suas escolhas e ajuste temporariamente seus filtros sem perder suas configurações.</Text>

          {/* Modo Temporário Restaurado */}
          <View style={styles.temporaryModeCard}>
            <View style={styles.temporaryModeHeader}>
              <View></View>
              <View style={styles.temporaryModeHeaderText}>
                <Text style={styles.temporaryModeTitle}>Modo temporário</Text>
                <Text style={styles.temporaryModeSubtitle}>Pause restrições sem perder as configurações</Text>
              </View>
            </View>

            <View style={styles.segmentedControl}>
              {(['always_on', 'paused', 'weekends_only'] as TemporaryMode[]).map((m) => (
                <TouchableOpacity key={m} onPress={() => setPreferences({ ...preferences, temporaryMode: m })}
                  style={[styles.segmentButton, preferences.temporaryMode === m && styles.segmentButtonActive]}>
                  <Text style={[styles.segmentButtonText, preferences.temporaryMode === m && styles.segmentButtonTextActive]}>
                    {m === 'always_on' ? 'Ativo' : m === 'paused' ? 'Pausado' : 'Final de Semana'}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>

            <View style={styles.modeHintBox}>
              <Lightbulb size={16} color={Colors.secondary} />
              <Text style={styles.modeHintText}>{modeDescription}</Text>
            </View>

            <View style={styles.lastUpdatedRow}>
              <Text style={styles.lastUpdatedLabel}>Última alteração:</Text>
              <Text style={styles.lastUpdatedValue}>{preferences.updatedAt || "Ainda não atualizada"}</Text>
            </View>
          </View>

          {/* Botão de Edição */}
          <TouchableOpacity style={styles.editPreferencesButton} onPress={() => setIsEditing(!isEditing)}>
            <Text style={styles.editPreferencesText}>{isEditing ? "Fechar edição" : "Editar preferências"}</Text>
            <ChevronRight size={18} color={Colors.primary} style={isEditing && styles.chevronExpanded} />
          </TouchableOpacity>

          {isEditing && (
            <View style={styles.editorContainer}>
              <PreferenceSelector
                title="Estilo alimentar"
                options={FOOD_PREFERENCE_OPTIONS}
                selected={preferences.lifestyle}
                onToggle={(v: string) => toggleOption('lifestyle', v)}
                icon={<Leaf size={18} color={Colors.success} />}
              />

              <PreferenceSelector
                title="Alergias"
                options={ALLERGY_OPTIONS}
                selected={preferences.allergies}
                onToggle={(v: string) => toggleOption('allergies', v)}
                icon={<AlertCircle size={18} color={Colors.secondary} />}
              />

              {/* Seção de Restrições Manuais Restaurada */}
              <View style={styles.editorSection}>
                <Text style={styles.editorSectionTitle}>Outras restrições</Text>
                <Text style={styles.editorHelperText}>Descreva preferências ou restrições não listadas.</Text>
                <View style={[styles.inputContainer, styles.textAreaContainer, focusedInput === "outras_restricoes" && styles.inputContainerFocused]}>
                  <TextInput
                    style={styles.textArea}
                    multiline
                    placeholder="Ex: Evitar pimenta ou coentro..."
                    placeholderTextColor={Colors.subtitle + "99"}
                    value={preferences.otherRestrictions}
                    onFocus={() => setFocusedInput("outras_restricoes")}
                    onBlur={() => setFocusedInput(null)}
                    onChangeText={(t) => setPreferences({ ...preferences, otherRestrictions: t })}
                  />
                </View>
              </View>

              <TouchableOpacity style={styles.preferencesSaveButton} onPress={savePreferences} disabled={isSavingPref}>
                {isSavingPref ? <ActivityIndicator color="white" /> : <><CheckCircle size={18} color="white" /><Text style={styles.preferencesSaveButtonText}>Salvar preferências alimentares</Text></>}
              </TouchableOpacity>
            </View>
          )}
        </View>

        {/* Footer */}
        <View style={styles.footerActions}>
          <TouchableOpacity style={styles.logoutButtonInline} onPress={() => router.replace("/(auth)/login")}>
            <LogOut size={18} color={Colors.errorDark} /><Text style={styles.logoutTextInline}>Sair</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.mainSaveButton} onPress={saveBasicProfile} disabled={isLoading}>
            {isLoading ? <ActivityIndicator color="white" /> : <><CheckCircle size={20} color="white" /><Text style={styles.mainSaveText}>Salvar</Text></>}
          </TouchableOpacity>
        </View>

      </ScrollView>
    </KeyboardAvoidingView>
  );
}

// Sub-componentes (Helpers)
const InputField = ({ label, value, onChange }: { label: string, value: string, onChange: (t: string) => void }) => (
  <View style={styles.inputBlock}>
    <Text style={styles.inputLabel}>{label}</Text>
    <View style={styles.inputRow}>
      <TextInput style={styles.textInput} value={value} onChangeText={onChange} />
      <Pencil size={14} color={Colors.subtext} />
    </View>
  </View>
);

const PreferenceSelector = ({ title, options, selected, onToggle, icon }: { title: string, options: OptionItem[], selected: string[], onToggle: (v: string) => void, icon: any }) => (
  <View style={styles.editorSection}>
    <View style={styles.editorSectionHeader}>{icon}<Text style={styles.editorSectionTitle}>{title}</Text></View>
    <View style={styles.chipsContainer}>
      {options.map((opt) => (
        <TouchableOpacity key={opt.key} onPress={() => onToggle(opt.key)} style={[styles.selectableChip, selected.includes(opt.key) && styles.selectableChipActive]}>
          <Text style={[styles.selectableChipText, selected.includes(opt.key) && styles.selectableChipTextActive]}>{opt.label}</Text>
        </TouchableOpacity>
      ))}
    </View>
  </View>
);