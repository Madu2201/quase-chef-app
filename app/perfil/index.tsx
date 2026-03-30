import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Image,
  Switch,
  ActivityIndicator,
  Alert,
  KeyboardAvoidingView,
  Platform
} from 'react-native';
import { useRouter } from 'expo-router';
import * as ImagePicker from 'expo-image-picker';

// Ícones
import {
  Leaf,
  User as UserIcon,
  Settings,
  LogOut,
  Camera,
  ChevronRight,
  AlertCircle,
  Pencil,
  CheckCircle
} from 'lucide-react-native';

// Tema e Estilos
import { Colors } from '../../constants/theme';
import { perfilStyles as styles } from '../../styles/perfil_styles';
import { Header } from '../../components/header';

export default function PerfilScreen() {
  const router = useRouter();

  // --- ESTADOS ---
  const [email, setEmail] = useState('maria.silva@email.com');
  const [fotoUrl, setFotoUrl] = useState<string | null>(null);
  const [isVegetariano, setIsVegetariano] = useState(false);
  const [loadingImage, setLoadingImage] = useState(false);

  // --- FUNÇÕES ---
  const handleBack = () => {
    // Correção para o erro "GO_BACK not handled":
    if (router.canGoBack()) {
      router.back();
    } else {
      router.replace('/(tabs)/home'); // Caminho padrão caso abra o app direto no perfil
    }
  };

  const pickImage = async () => {
    try {
      setLoadingImage(true);
      const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();

      if (status !== 'granted') {
        Alert.alert('Permissão Negada', 'Acesso às fotos é necessário.');
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

  const handleSave = () => Alert.alert('Sucesso', 'Perfil atualizado!');

  return (
    <KeyboardAvoidingView
      style={styles.keyboardContainer}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <Header
        title="Meu Perfil"
        showSearch={false}
        onBack={handleBack}
      />

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>

        {/* Avatar Section */}
        <View style={styles.avatarSection}>
          <TouchableOpacity style={styles.avatarCircle} onPress={pickImage} activeOpacity={0.8}>
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
          <Text style={styles.userNameDisplay}>Maria Silva</Text>
          <Text style={styles.memberSince}>Membro desde Março 2026</Text>
        </View>

        {/* Card: Meus Dados */}
        <View style={styles.sectionCard}>
          <View style={styles.sectionHeader}>
            <UserIcon size={20} color={Colors.primary} />
            <Text style={styles.sectionTitle}>Meus Dados</Text>
          </View>

          <View style={styles.inputBlock}>
            <Text style={styles.inputLabel}>E-mail</Text>
            <View style={styles.inputRow}>
              <TextInput
                style={styles.textInput}
                value={email}
                onChangeText={setEmail}
                keyboardType="email-address"
                autoCapitalize="none"
              />
              <Pencil size={14} color={Colors.subtext} />
            </View>
          </View>
        </View>

        {/* Card: Preferências */}
        <View style={styles.sectionCard}>
          <View style={styles.sectionHeader}>
            <Settings size={20} color={Colors.primary} />
            <Text style={styles.sectionTitle}>Preferências</Text>
          </View>

          <View style={styles.prefRow}>
            <View style={styles.prefLeft}>
              <Leaf size={20} color={Colors.success} />
              <Text style={styles.prefText}>Vegetariano</Text>
            </View>
            <Switch
              value={isVegetariano}
              onValueChange={setIsVegetariano}
              trackColor={{ false: Colors.subtitle + '30', true: Colors.success }}
              thumbColor={Colors.light}
            />
          </View>

          <TouchableOpacity
            style={[styles.prefRow, { borderBottomWidth: 0 }]}
            activeOpacity={0.6}
          >
            <View style={styles.prefLeft}>
              <AlertCircle size={20} color={Colors.secondary} />
              <Text style={styles.prefText} numberOfLines={2}>Alergias Alimentares</Text>
            </View>
            <View style={styles.prefRight}>
              <Text style={styles.prefHintText}>Configurar</Text>
              <ChevronRight size={18} color={Colors.subtitle} />
            </View>
          </TouchableOpacity>
        </View>

        {/* Ações Inferiores */}
        <View style={styles.footerActions}>
          <TouchableOpacity
            style={styles.logoutButtonInline}
            onPress={() => router.replace('/(auth)/login')}
          >
            <LogOut size={18} color={Colors.errorDark} />
            <Text style={styles.logoutTextInline}>Sair da Conta</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.mainSaveButton} onPress={handleSave}>
            <CheckCircle size={20} color={Colors.light} />
            <Text style={styles.mainSaveText}>Salvar</Text>
          </TouchableOpacity>
        </View>

      </ScrollView>
    </KeyboardAvoidingView>
  );
}