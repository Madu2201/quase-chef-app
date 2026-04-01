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

//Backend
import { useAuth } from '@/hooks/useAuth';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useEffect } from 'react';
import { uploadAvatar, updateUserProfile } from '@/services/authService';
export default function PerfilScreen() {
  const router = useRouter();
  const { user } = useAuth(); // Puxando o usuário do banco

  // --- ESTADOS ---
  const [userId, setUserId] = useState<string | null>(null); // <- Novo estado para o ID
  const [nome, setNome] = useState('Carregando...');
  const [email, setEmail] = useState('');
  const [fotoUrl, setFotoUrl] = useState('');
  const [isUpdating, setIsUpdating] = useState(false);
  const [isVegetariano, setIsVegetariano] = useState(false);
  const [loadingImage, setLoadingImage] = useState(false);

  // --- PREENCHER OS DADOS ---
  useEffect(() => {
    const carregarDados = async () => {
      // 1. Resgata os dados da memória do celular (AsyncStorage)
      const idSalvo = await AsyncStorage.getItem('@user_id');
      const nomeSalvo = await AsyncStorage.getItem('@user_full_name');
      const emailSalvo = await AsyncStorage.getItem('@user_email');
      const fotoSalva = await AsyncStorage.getItem('@user_foto');

      // 2. Define o ID (prioriza o do Hook, se falhar, usa o do celular)
      setUserId(user?.id || idSalvo);

      // 3. Atualiza os textos da tela
      setNome(user?.full_name || nomeSalvo || 'Usuário');
      setEmail(user?.email || emailSalvo || '');
      setFotoUrl(user?.avatar_url || fotoSalva || '');
    };

    carregarDados();
  }, [user]);
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

  const handleSave = async () => {
    if (!userId) {
      Alert.alert('Sessão Expirada', 'Por favor, faça logout e login novamente.');
      return;
    }

    try {
      setLoadingImage(true);
      setIsUpdating(true); // Se quiser usar aquele estado de loading pro texto também

      // 1. Salva a foto (se tiver uma nova)
      if (fotoUrl && !fotoUrl.startsWith('http')) {
        const novaUrl = await uploadAvatar(userId, nome, fotoUrl);
        setFotoUrl(novaUrl);
        await AsyncStorage.setItem('@user_foto', novaUrl);
      }

      // 2. Salva o Nome e E-mail no Supabase
      await updateUserProfile(userId, nome, email);

      // 3. Salva o Nome e E-mail na memória do celular (para a Home atualizar)
      await AsyncStorage.setItem('@user_full_name', nome);
      await AsyncStorage.setItem('@user_email', email);

      Alert.alert('Sucesso', 'Perfil atualizado com sucesso!');
    } catch (error) {
      console.error('Erro ao salvar perfil:', error);
      Alert.alert('Erro', 'Não foi possível salvar os dados no momento.');
    } finally {
      setLoadingImage(false);
      setIsUpdating(false);
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.keyboardContainer}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <Header
        title="Meu Perfil"
        centerTitle
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
          <Text style={styles.userNameDisplay}>{nome}</Text>
          <Text style={styles.memberSince}>Membro desde Março 2026</Text>
        </View>

        {/* Card: Meus Dados */}
        <View style={styles.sectionCard}>
          <View style={styles.sectionHeader}>
            <UserIcon size={20} color={Colors.primary} />
            <Text style={styles.sectionTitle}>Meus Dados</Text>
          </View>

          {/* NOVO: Adicione o bloco do Nome aqui! */}
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

          {/* NOVO: Adicione o bloco do Email aqui! */}
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
            onPress={async () => {
              try {
                // Limpa TODA a sessão do AsyncStorage de uma vez só
                await AsyncStorage.clear();

                // Volta para a tela de login
                router.replace('/(auth)/login');
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
            disabled={isUpdating} // <--- Evita cliques duplos enquanto salva
          >
            {isUpdating ? (
              <ActivityIndicator color={Colors.light} /> // Mostra a rodinha
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