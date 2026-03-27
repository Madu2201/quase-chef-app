import { Ionicons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  Image,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Switch,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';

import { Colors } from '../../constants/theme';
import { perfilStyles as styles } from '../../styles/perfil_styles';

export default function PerfilScreen() {
  const router = useRouter();

  const [email, setEmail] = useState('');
  const [telefone, setTelefone] = useState('');
  const [fotoUrl, setFotoUrl] = useState<string | null>(null);
  const [isVegetariano, setIsVegetariano] = useState(false);
  const [loadingImage, setLoadingImage] = useState(false);

  const formatarTelefone = (valor: string) => {
    const numeros = valor.replace(/\D/g, '');
    let resultado = '';

    if (numeros.length > 0) resultado = '(' + numeros.substring(0, 2);
    if (numeros.length > 2) resultado += ') ' + numeros.substring(2, 7);
    if (numeros.length > 7) resultado += '-' + numeros.substring(7, 11);

    setTelefone(resultado);
  };

  const pickImage = async () => {
    try {
      setLoadingImage(true);

      const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();

      if (status !== 'granted') {
        Alert.alert('Permissão Negada', 'Precisamos de acesso às suas fotos.');
        return;
      }

      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.7,
      });

      if (!result.canceled) {
        setFotoUrl(result.assets[0].uri);
      }
    } catch (error) {
      console.error('Erro ao selecionar imagem:', error);
    } finally {
      setLoadingImage(false);
    }
  };

  const handleSaveProfile = () => {
    Alert.alert('Sucesso', 'Perfil salvo!');
  };

  return (
    <KeyboardAvoidingView
      style={styles.keyboardContainer}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <View style={styles.topHeader}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color={Colors.primary} />
        </TouchableOpacity>

        <Text style={styles.topHeaderTitle}>Meu Perfil</Text>

        <TouchableOpacity activeOpacity={0.7} onPress={handleSaveProfile}>
          <Text style={styles.saveText}>Salvar</Text>
        </TouchableOpacity>
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        <View style={styles.avatarSection}>
          <TouchableOpacity
            style={styles.avatarCircle}
            onPress={pickImage}
            activeOpacity={0.8}
          >
            {fotoUrl ? (
              <Image source={{ uri: fotoUrl }} style={styles.avatarImage} />
            ) : (
              <Ionicons name="person" size={50} color="#CCC" />
            )}

            <View style={styles.cameraBadge}>
              <Ionicons name="camera" size={16} color="#FFF" />
            </View>

            {loadingImage && (
              <View style={styles.loadingOverlay}>
                <ActivityIndicator color="#FFF" />
              </View>
            )}
          </TouchableOpacity>

          <Text style={styles.userNameDisplay}>Maria Silva</Text>
          <Text style={styles.memberSince}>Membro desde Janeiro 2024</Text>
        </View>

        <View style={styles.sectionCard}>
          <View style={styles.sectionHeader}>
            <Ionicons name="person-outline" size={20} color={Colors.primary} />
            <Text style={styles.sectionTitle}>Meus Dados</Text>
          </View>

          <View style={styles.inputBlock}>
            <Text style={styles.inputLabel}>Email</Text>
            <View style={styles.inputRow}>
              <TextInput
                style={styles.textInput}
                placeholder="maria.silva@email.com"
                placeholderTextColor="#999"
                value={email}
                onChangeText={setEmail}
                keyboardType="email-address"
                autoCapitalize="none"
              />
              <Ionicons name="pencil" size={16} color="#CCC" />
            </View>
          </View>

          <View style={styles.inputBlock}>
            <Text style={styles.inputLabel}>Telefone</Text>
            <View style={styles.inputRow}>
              <TextInput
                style={styles.textInput}
                placeholder="(11) 98765-4321"
                placeholderTextColor="#999"
                value={telefone}
                onChangeText={formatarTelefone}
                keyboardType="phone-pad"
                maxLength={15}
              />
              <Ionicons name="pencil" size={16} color="#CCC" />
            </View>
          </View>
        </View>

        <View style={styles.sectionCard}>
          <View style={styles.sectionHeader}>
            <Ionicons name="options-outline" size={20} color={Colors.primary} />
            <Text style={styles.sectionTitle}>Preferências</Text>
          </View>

          <View style={styles.prefRow}>
            <View style={styles.prefLeft}>
              <Ionicons name="leaf-outline" size={22} color="#48BB78" />
              <Text style={styles.prefText}>Vegetariano</Text>
            </View>

            <Switch
              value={isVegetariano}
              onValueChange={setIsVegetariano}
              trackColor={{ false: '#E2E8F0', true: '#48BB78' }}
              thumbColor="#FFF"
            />
          </View>

          <TouchableOpacity style={[styles.prefRow, { borderBottomWidth: 0 }]}>
            <View style={styles.prefLeft}>
              <Ionicons
                name="alert-circle-outline"
                size={22}
                color={Colors.secondary}
              />
              <Text style={styles.prefText}>Alergias Alimentares</Text>
            </View>

            <View style={styles.prefRight}>
              <Text style={styles.prefHintText}>Configurar</Text>
              <Ionicons name="chevron-forward" size={18} color="#CCC" />
            </View>
          </TouchableOpacity>
        </View>

        <TouchableOpacity
          style={styles.logoutButton}
          onPress={() => router.replace('/(auth)/login')}
        >
          <Ionicons name="log-out-outline" size={20} color={Colors.secondary} />
          <Text style={styles.logoutText}>Sair da Conta</Text>
        </TouchableOpacity>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}