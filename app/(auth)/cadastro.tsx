import { Ionicons } from '@expo/vector-icons';
import { Link, router } from 'expo-router';
import React, { useState } from 'react';
import {
  Alert,
  Image,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  Text,
  TextInput,
  View,
} from 'react-native';

import { Colors } from '../../constants/theme';
import { cadastroStyles as styles } from '../../styles/cadastro_styles';

export default function CadastroScreen() {
  const [nome, setNome] = useState('');
  const [email, setEmail] = useState('');
  const [telefone, setTelefone] = useState('');
  const [senha, setSenha] = useState('');
  const [confirmarSenha, setConfirmarSenha] = useState('');

  const [mostrarSenha, setMostrarSenha] = useState(false);
  const [mostrarConfirmarSenha, setMostrarConfirmarSenha] = useState(false);
  const [focusedInput, setFocusedInput] = useState<string | null>(null);

  const formatarTelefone = (valor: string) => {
    const numeros = valor.replace(/\D/g, '');
    let resultado = '';

    if (numeros.length > 0) {
      resultado = '(' + numeros.substring(0, 2);
    }
    if (numeros.length > 2) {
      resultado += ') ' + numeros.substring(2, 7);
    }
    if (numeros.length > 7) {
      resultado += '-' + numeros.substring(7, 11);
    }

    setTelefone(resultado);
  };

  const validarEmail = (valor: string) => {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(valor);
  };

  const handleRegister = () => {
    if (!nome || !email || !telefone || !senha || !confirmarSenha) {
      Alert.alert('Erro', 'Por favor, preencha todos os campos.');
      return;
    }

    if (!validarEmail(email)) {
      Alert.alert('E-mail inválido', 'Por favor, insira um endereço de e-mail válido.');
      return;
    }

    if (senha.length < 6) {
      Alert.alert('Senha curta', 'A senha precisa ter pelo menos 6 caracteres.');
      return;
    }

    if (senha !== confirmarSenha) {
      Alert.alert('Erro', 'As senhas não coincidem.');
      return;
    }

    console.log('Dados do Cadastro:', { nome, email, telefone, senha });

    Alert.alert('Sucesso', 'Sua conta foi criada com sucesso!', [
      { text: 'OK', onPress: () => router.push('/(auth)/login') },
    ]);
  };

  return (
    <KeyboardAvoidingView
      style={styles.screen}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <ScrollView
        contentContainerStyle={styles.container}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        <View style={styles.header}>
          <View style={styles.logoBadge}>
            <Image
              source={require('../../assets/images/icon.png')}
              style={styles.logo}
              resizeMode="contain"
            />
          </View>

          <Text style={styles.brandName}>Quase-Chef</Text>
          <Text style={styles.welcomeTitle}>Criar Conta</Text>
          <Text style={styles.welcomeSubtitle}>
            Junte-se a nós e transforme os ingredientes da sua geladeira em pratos incríveis.
          </Text>
        </View>

        <View style={styles.formCard}>
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Nome Completo</Text>
            <View
              style={[
                styles.inputContainer,
                focusedInput === 'nome' && styles.inputContainerFocused,
              ]}
            >
              <Ionicons
                name="person-outline"
                size={20}
                color={focusedInput === 'nome' ? Colors.primary : Colors.subtitle}
              />
              <TextInput
                style={styles.input}
                placeholder="Digite seu nome completo"
                placeholderTextColor={Colors.subtext}
                value={nome}
                onChangeText={setNome}
                onFocus={() => setFocusedInput('nome')}
                onBlur={() => setFocusedInput(null)}
                autoCapitalize="words"
                maxLength={60}
              />
            </View>

            <Text style={styles.label}>E-mail</Text>
            <View
              style={[
                styles.inputContainer,
                focusedInput === 'email' && styles.inputContainerFocused,
              ]}
            >
              <Ionicons
                name="mail-outline"
                size={20}
                color={focusedInput === 'email' ? Colors.primary : Colors.subtitle}
              />
              <TextInput
                style={styles.input}
                placeholder="seuemail@exemplo.com"
                placeholderTextColor={Colors.subtext}
                value={email}
                onChangeText={setEmail}
                onFocus={() => setFocusedInput('email')}
                onBlur={() => setFocusedInput(null)}
                keyboardType="email-address"
                autoCapitalize="none"
                autoCorrect={false}
              />
            </View>

            <Text style={styles.label}>Telefone</Text>
            <View
              style={[
                styles.inputContainer,
                focusedInput === 'telefone' && styles.inputContainerFocused,
              ]}
            >
              <Ionicons
                name="call-outline"
                size={20}
                color={focusedInput === 'telefone' ? Colors.primary : Colors.subtitle}
              />
              <TextInput
                style={styles.input}
                placeholder="(00) 00000-0000"
                placeholderTextColor={Colors.subtext}
                value={telefone}
                onChangeText={formatarTelefone}
                onFocus={() => setFocusedInput('telefone')}
                onBlur={() => setFocusedInput(null)}
                keyboardType="phone-pad"
                maxLength={15}
              />
            </View>

            <Text style={styles.label}>Senha</Text>
            <View
              style={[
                styles.inputContainer,
                focusedInput === 'senha' && styles.inputContainerFocused,
              ]}
            >
              <Ionicons
                name="lock-closed-outline"
                size={20}
                color={focusedInput === 'senha' ? Colors.primary : Colors.subtitle}
              />
              <TextInput
                style={styles.input}
                placeholder="Crie uma senha forte"
                placeholderTextColor={Colors.subtext}
                value={senha}
                onChangeText={setSenha}
                onFocus={() => setFocusedInput('senha')}
                onBlur={() => setFocusedInput(null)}
                secureTextEntry={!mostrarSenha}
                maxLength={10}
              />
              <Pressable onPress={() => setMostrarSenha(!mostrarSenha)} hitSlop={10}>
                <Ionicons
                  name={mostrarSenha ? 'eye-off-outline' : 'eye-outline'}
                  size={20}
                  color={Colors.subtitle}
                />
              </Pressable>
            </View>

            <Text style={styles.label}>Confirmar senha</Text>
            <View
              style={[
                styles.inputContainer,
                focusedInput === 'confirmarSenha' && styles.inputContainerFocused,
              ]}
            >
              <Ionicons
                name="checkmark-circle-outline"
                size={20}
                color={focusedInput === 'confirmarSenha' ? Colors.primary : Colors.subtitle}
              />
              <TextInput
                style={styles.input}
                placeholder="Digite novamente sua senha"
                placeholderTextColor={Colors.subtext}
                value={confirmarSenha}
                onChangeText={setConfirmarSenha}
                onFocus={() => setFocusedInput('confirmarSenha')}
                onBlur={() => setFocusedInput(null)}
                secureTextEntry={!mostrarConfirmarSenha}
                maxLength={10}
              />
              <Pressable
                onPress={() => setMostrarConfirmarSenha(!mostrarConfirmarSenha)}
                hitSlop={10}
              >
                <Ionicons
                  name={mostrarConfirmarSenha ? 'eye-off-outline' : 'eye-outline'}
                  size={20}
                  color={Colors.subtitle}
                />
              </Pressable>
            </View>

            <Pressable
              style={({ pressed }) => [
                styles.buttonPrimary,
                { opacity: pressed ? 0.9 : 1 },
              ]}
              onPress={handleRegister}
            >
              <Text style={styles.buttonPrimaryText}>Cadastrar</Text>
            </Pressable>
          </View>
        </View>

        <View style={styles.footerBlock}>
          <View style={styles.dividerContainer}>
            <View style={styles.dividerLine} />
            <Text style={styles.dividerText}>ou</Text>
            <View style={styles.dividerLine} />
          </View>

          <Link href="/(auth)/login" asChild>
            <Pressable>
              <Text style={styles.backToLoginText}>
                Já tem conta? <Text style={styles.primaryLink}>Voltar para Login</Text>
              </Text>
            </Pressable>
          </Link>

          <Text style={styles.legalText}>
            Ao se cadastrar, você concorda com nossos{' '}
            <Text style={styles.primaryLink}>Termos de Serviço</Text> e{' '}
            <Text style={styles.primaryLink}>Política de Privacidade</Text>.
          </Text>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}