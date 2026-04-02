import React, { useState } from 'react';
import { View, Text, TextInput, Pressable, Image, ScrollView, KeyboardAvoidingView, Platform, ActivityIndicator } from 'react-native';
import { router } from 'expo-router';
import { Eye, EyeOff, User, Mail, Lock, CheckCircle } from 'lucide-react-native';
import { FontAwesome5 } from "@expo/vector-icons";
import Animated, { FadeInDown, FadeInUp, FadeOut } from 'react-native-reanimated';

// Meus imports
import { authStyles as styles } from '../../styles/auth_styles';
import { Colors, Fonts, Spacing, Radius, FontSizes } from '../../constants/theme';
import { validateEmail, getPasswordRequirements, isPasswordStrong, validateName } from '../../utils/validation';
import { useAuth } from '../../hooks/useAuth';

// Definição do componente de cadastro
export default function CadastroScreen() {
  const { signUp, isLoading } = useAuth();
  const [nome, setNome] = useState('');
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [confirmarSenha, setConfirmarSenha] = useState('');
  const [errors, setErrors] = useState<any>({});
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [focusedInput, setFocusedInput] = useState<string | null>(null);
  const [isSuccess, setIsSuccess] = useState(false); 

  // Regras de validação em tempo real para a senha
  const reqs = getPasswordRequirements(senha);

  // Validação ao tentar cadastrar
  const handleRegister = async () => {
    let newErrors: any = {};
    if (!validateName(nome)) newErrors.nome = "Nome deve ter 3-50 caracteres.";
    if (!validateEmail(email)) newErrors.email = "E-mail inválido.";
    if (!isPasswordStrong(senha)) newErrors.senha = "Senha fora do padrão exigido.";
    if (senha !== confirmarSenha) newErrors.confirmarSenha = "As senhas não coincidem.";

    setErrors(newErrors);

    // Se não houver erros no front-end, chama o back-end
    if (Object.keys(newErrors).length === 0) {
      try {
        // Passamos uma string vazia '' no lugar do telefone que foi removido
        const result = await signUp(nome, email, senha);

        if (result.success) {
          setIsSuccess(true); // Ativa o banner de sucesso animado
          
          setTimeout(() => {
            router.push('/(auth)/login');
          }, 2000);
        } else {
          setErrors({ geral: result.error || 'Erro ao criar conta.' });
        }
      } catch (error) {
        setErrors({ geral: 'Erro de conexão com o servidor.' });
      }
    }
  };

  // Item do Checklist de senha
  const renderReqItem = (label: string, met: boolean) => (
    <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 4 }}>
      {met ? <CheckCircle size={14} color={Colors.success} /> :
        <View style={{ width: 14, height: 14, borderRadius: 7, borderWidth: 1, borderColor: Colors.subtext, opacity: 0.5 }} />}
      <Text style={{ fontSize: 13, color: met ? Colors.success : Colors.subtext, fontFamily: Fonts.medium }}>{label}</Text>
    </View>
  );

  // Renderização do componente
  return (
    <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
      <ScrollView contentContainerStyle={styles.container} showsVerticalScrollIndicator={false} keyboardShouldPersistTaps="handled">

        {/* Header com Animação */}
        <Animated.View entering={FadeInUp.delay(100).duration(600)} style={styles.header}>
          <Image source={require('../../assets/images/icon.png')} style={styles.logo} resizeMode="contain" />
          <Text style={styles.brandName}>Quase Chef!</Text>
          <Text style={styles.welcomeTitle}>Criar Conta</Text>
          <Text style={styles.welcomeSubtitle}>Sua jornada para evitar o desperdício começa aqui.</Text>
        </Animated.View>

        {/* Alerta de Sucesso: Posicionado entre o subtítulo e o input */}
        {isSuccess && (
          <Animated.View
            entering={FadeInDown}
            exiting={FadeOut}
            style={{
              backgroundColor: Colors.success,
              padding: Spacing.sm,
              borderRadius: Radius.lg,
              flexDirection: 'row',
              alignItems: 'center',
              gap: Spacing.md,
              marginTop: Spacing.xs,
              marginBottom: Spacing.xs 
            }}
          >
            <CheckCircle size={15} color="white" />
            <Text style={{ fontSize: FontSizes.small, color: Colors.light, fontWeight: 'bold' }}>
              Conta criada! Redirecionando para o login...
            </Text>
          </Animated.View>
        )}

        {/* Exibição de Erro Geral do Backend */}
        {errors.geral && !isSuccess && (
          <Animated.View entering={FadeInDown} style={{ marginBottom: 10, backgroundColor: Colors.errorLight, padding: 10, borderRadius: 8 }}>
            <Text style={{ color: Colors.errorDark, textAlign: 'center', fontSize: 14 }}>{errors.geral}</Text>
          </Animated.View>
        )}

        {/* Formulário de Cadastro */}
        <Animated.View entering={FadeInDown.delay(300).duration(600)} style={styles.inputGroup}>

          {/* Nome Completo */}
          <Text style={styles.label}>Nome Completo</Text>
          <View style={[styles.inputContainer, focusedInput === 'nome' && styles.inputContainerFocused, errors.nome && { borderColor: Colors.errorDark, backgroundColor: Colors.errorLight }]}>
            <User size={18} color={errors.nome ? Colors.errorDark : (focusedInput === 'nome' ? Colors.primary : Colors.subtitle)} />
            <TextInput
              style={styles.input}
              placeholder="Digite seu nome completo"
              placeholderTextColor={Colors.subtitle + "99"}
              onFocus={() => setFocusedInput('nome')}
              onBlur={() => setFocusedInput(null)}
              onChangeText={(t) => { setNome(t); setErrors({ ...errors, nome: null, geral: null }) }}
              value={nome}
            />
          </View>
          {errors.nome && <Text style={{ color: Colors.errorDark, fontSize: 12, marginTop: 4, marginLeft: 4, marginBottom: 8 }}>{errors.nome}</Text>}

          {/* E-mail */}
          <Text style={styles.label}>E-mail</Text>
          <View style={[styles.inputContainer, focusedInput === 'email' && styles.inputContainerFocused, errors.email && { borderColor: Colors.errorDark, backgroundColor: Colors.errorLight }]}>
            <Mail size={18} color={errors.email ? Colors.errorDark : (focusedInput === 'email' ? Colors.primary : Colors.subtitle)} />
            <TextInput
              style={styles.input}
              placeholder="seu@email.com"
              placeholderTextColor={Colors.subtitle + "99"}
              keyboardType="email-address"
              autoCapitalize="none"
              onFocus={() => setFocusedInput('email')}
              onBlur={() => setFocusedInput(null)}
              onChangeText={(t) => { setEmail(t); setErrors({ ...errors, email: null, geral: null }) }}
              value={email}
            />
          </View>
          {errors.email && <Text style={{ color: Colors.errorDark, fontSize: 12, marginTop: 4, marginLeft: 4, marginBottom: 8 }}>{errors.email}</Text>}

          {/* Senha */}
          <Text style={styles.label}>Senha</Text>
          <View style={[styles.inputContainer, focusedInput === 'senha' && styles.inputContainerFocused, errors.senha && { borderColor: Colors.errorDark, backgroundColor: Colors.errorLight }]}>
            <Lock size={18} color={errors.senha ? Colors.errorDark : (focusedInput === 'senha' ? Colors.primary : Colors.subtitle)} />
            <TextInput
              style={styles.input}
              placeholder="Digite sua senha"
              placeholderTextColor={Colors.subtitle + "99"}
              secureTextEntry={!showPassword}
              maxLength={8}
              onFocus={() => setFocusedInput('senha')}
              onBlur={() => setFocusedInput(null)}
              onChangeText={(t) => { setSenha(t); setErrors({ ...errors, senha: null, geral: null }) }}
              value={senha}
            />
            <Pressable onPress={() => setShowPassword(!showPassword)}>
              {showPassword ? <EyeOff size={20} color={Colors.primary} /> : <Eye size={20} color={Colors.primary} />}
            </Pressable>
          </View>

          {/* Checklist Vertical */}
          <View style={{ marginTop: 10, marginLeft: 4, marginBottom: 10 }}>
            {renderReqItem("Ter exatamente 8 caracteres", reqs.exactLength)}
            {renderReqItem("Pelo menos uma letra", reqs.hasLetter)}
            {renderReqItem("Pelo menos um símbolo", reqs.hasSymbol)}
          </View>

          {/* Confirmar Senha */}
          <Text style={styles.label}>Confirmar Senha</Text>
          <View style={[styles.inputContainer, focusedInput === 'conf' && styles.inputContainerFocused, errors.confirmarSenha && { borderColor: Colors.errorDark, backgroundColor: Colors.errorLight }]}>
            <CheckCircle size={18} color={errors.confirmarSenha ? Colors.errorDark : (focusedInput === 'conf' ? Colors.primary : Colors.subtitle)} />
            <TextInput
              style={styles.input}
              placeholder="Repita a senha"
              placeholderTextColor={Colors.subtitle + "99"}
              secureTextEntry={!showConfirmPassword}
              maxLength={8}
              onFocus={() => setFocusedInput('conf')}
              onBlur={() => setFocusedInput(null)}
              onChangeText={(t) => { setConfirmarSenha(t); setErrors({ ...errors, confirmarSenha: null, geral: null }) }}
              value={confirmarSenha}
            />
            <Pressable onPress={() => setShowConfirmPassword(!showConfirmPassword)}>
              {showConfirmPassword ? <EyeOff size={20} color={Colors.primary} /> : <Eye size={20} color={Colors.primary} />}
            </Pressable>
          </View>
          {errors.confirmarSenha && <Text style={{ color: Colors.errorDark, fontSize: 12, marginTop: 4, marginLeft: 4 }}>{errors.confirmarSenha}</Text>}

          {/* Botão de Cadastro */}
          <Pressable
            style={[styles.buttonPrimary, (isSuccess || isLoading) && { opacity: 0.8 }, { marginTop: 20 }]}
            onPress={handleRegister}
            disabled={isSuccess || isLoading}
          >
            {isLoading ? (
              <ActivityIndicator color="#FFF" />
            ) : (
              <Text style={styles.buttonPrimaryText}>{isSuccess ? "Cadastrado!" : "Criar minha conta"}</Text>
            )}
          </Pressable>
        </Animated.View>

        {/* Divisor e Redes Sociais */}
        <Animated.View entering={FadeInDown.delay(500).duration(600)}>
          <View style={styles.dividerContainer}>
            <View style={styles.dividerLine} />
            <Text style={styles.dividerText}>ou cadastrar-se com</Text>
            <View style={styles.dividerLine} />
          </View>

          <View style={styles.socialContainer}>
            <Pressable style={styles.socialButton}><FontAwesome5 name="google" size={16} color="#DB4437" /><Text style={styles.socialButtonText}>Google</Text></Pressable>
            <Pressable style={styles.socialButton}><FontAwesome5 name="facebook" size={16} color="#4267B2" /><Text style={styles.socialButtonText}>Facebook</Text></Pressable>
          </View>

          <Text style={styles.footerText}>Já tem uma conta? <Text style={styles.primaryLink} onPress={() => router.push("/(auth)/login")}>Entre aqui</Text></Text>

          <Text style={styles.legalText}>Ao se cadastrar, você aceita nossos <Text style={styles.linkUnderline}>Termos</Text> e <Text style={styles.linkUnderline}>Privacidade</Text>.</Text>
        </Animated.View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}