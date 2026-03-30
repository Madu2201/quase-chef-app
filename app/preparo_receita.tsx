import React, { useState, useEffect } from 'react';
import { View, Text, Pressable, Image, ScrollView, StatusBar, Share, Alert } from 'react-native';
import { X, Lightbulb, Stars, Share2, Heart, RotateCcw, Play, Pause } from 'lucide-react-native';
import { router, useLocalSearchParams } from 'expo-router';
import Animated, {
    FadeIn,
    FadeInUp,
    FadeInLeft,
    useSharedValue,
    useAnimatedStyle,
    withSpring
} from 'react-native-reanimated';

// Meus imports
import { preparoStyles as styles } from '../styles/preparo_styles';
import { Colors } from '../constants/theme';

// Tela de preparo da receita, com passos dinâmicos e timer integrado
export default function PreparoReceitaScreen() {
    const params = useLocalSearchParams();

    const imagemUri = Array.isArray(params.imagem) ? params.imagem[0] : params.imagem;
    const passosDinamicos = params.passosJson ? JSON.parse(params.passosJson as string) : [];

    const [passoAtual, setPassoAtual] = useState(0);
    const [isConcluido, setIsConcluido] = useState(false);
    const [tempo, setTempo] = useState<number>(0);
    const [timerAtivo, setTimerAtivo] = useState(false);

    const [isFavorito, setIsFavorito] = useState(false);
    const heartScale = useSharedValue(1);

    const step = passosDinamicos[passoAtual];

    // Sincroniza o timer com o passo atual, reiniciando quando necessário
    useEffect(() => {
        if (step?.hasTimer) {
            setTempo(step.tempoTimer || 300);
            setTimerAtivo(false);
        }
    }, [passoAtual]);

    // Lógica do timer, decrementando a cada segundo quando ativo
    useEffect(() => {
        let interval: NodeJS.Timeout;
        if (timerAtivo && tempo > 0) {
            interval = setInterval(() => setTempo(t => t - 1), 1000);
        } else if (tempo === 0) {
            setTimerAtivo(false);
        }
        return () => clearInterval(interval);
    }, [timerAtivo, tempo]);

    const formatTime = (s: number) => {
        const mins = Math.floor(s / 60).toString().padStart(2, '0');
        const secs = (s % 60).toString().padStart(2, '0');
        return `${mins}:${secs}`;
    };

    // Função para resetar o timer para o valor original do passo
    const resetarTimer = () => {
        setTimerAtivo(false);
        setTempo(step?.tempoTimer || 300);
    };

    // Função para compartilhar a receita concluída, utilizando a API de compartilhamento nativa
    const handleShare = async () => {
        try {
            await Share.share({
                message: `Olha só a receita de ${params.titulo} que acabei de preparar! 🍳`,
            });
        } catch (error) {
            Alert.alert("Erro", "Não foi possível compartilhar.");
        }
    };

    // Função para alternar o estado de favorito, com animação de escala no ícone de coração
    const toggleFavorito = () => {
        setIsFavorito(!isFavorito);
        heartScale.value = withSpring(1.5, {}, () => {
            heartScale.value = withSpring(1);
        });
    };

    const animatedHeartStyle = useAnimatedStyle(() => ({
        transform: [{ scale: heartScale.value }]
    }));

    // Dados de exemplo para a receita, incluindo passos com e sem timer
    if (isConcluido) {
        return (
            <ScrollView contentContainerStyle={styles.containerSucesso} showsVerticalScrollIndicator={false}>
                <StatusBar barStyle="dark-content" />

                <Animated.View entering={FadeInUp.duration(600)} style={styles.badgeWrapper}>
                    <View style={styles.successBadge}>
                        <Stars size={48} color={Colors.primary} />
                    </View>
                </Animated.View>

                <Animated.View entering={FadeInUp.duration(600).delay(200)} style={{ width: '100%', alignItems: 'center' }}>
                    <Text style={styles.congratsTitle}>Parabéns!</Text>
                    <Text style={styles.congratsSub}>Você concluiu sua receita com sucesso.</Text>
                </Animated.View>

                {/* Card de sucesso */}
                <Animated.View
                    entering={FadeInLeft.duration(600).delay(400)}
                    style={[styles.successCard, { width: '100%' }]}
                >
                    <Image source={{ uri: imagemUri as string }} style={styles.successImage} resizeMode="cover" />
                    <View style={styles.successInfo}>
                        <Text style={styles.preparouLabel}>VOCÊ PREPAROU:</Text>
                        <Text style={styles.sucessRecipeTitle}>{params.titulo}</Text>
                    </View>
                </Animated.View>

                {/* Ações de compartilhamento e favorito */}
                <Animated.View
                    entering={FadeInUp.duration(600).delay(600)}
                    style={[styles.successActions, { width: '100%' }]}
                >
                    <Pressable
                        style={[styles.btnOutline, isFavorito && styles.btnOutlineActive]}
                        onPress={toggleFavorito}
                    >
                        <Animated.View style={animatedHeartStyle}>
                            <Heart
                                size={18}
                                color={isFavorito ? Colors.errorDark : Colors.primary}
                                fill={isFavorito ? Colors.errorDark : "transparent"}
                            />
                        </Animated.View>
                        <Text style={[styles.btnOutlineText, isFavorito && { color: Colors.errorDark }]}>
                            {isFavorito ? 'Favoritado' : 'Favoritar'}
                        </Text>
                    </Pressable>

                    <Pressable style={styles.btnOutline} onPress={handleShare}>
                        <Share2 size={18} color={Colors.primary} />
                        <Text style={styles.btnOutlineText}>Compartilhar</Text>
                    </Pressable>
                </Animated.View>

                {/* Botão para voltar ao início */}
                <Animated.View
                    entering={FadeInUp.duration(600).delay(800)}
                    style={{ width: '100%' }}
                >
                    <Pressable style={styles.btnVoltarInico} onPress={() => router.back()}>
                        <Text style={[styles.btnAcaoTexto, { color: Colors.light }]}>Voltar para Início</Text>
                    </Pressable>
                </Animated.View>
            </ScrollView>
        );
    }

    return (
        <View style={styles.container}>
            {/* Cabeçalho */}
            <StatusBar barStyle="dark-content" />
            <View style={styles.header}>
                <Pressable onPress={() => router.back()} style={styles.closeButton}>
                    <X size={24} color={Colors.primary} />
                </Pressable>
                <Text style={styles.headerTitle}>{params.titulo}</Text>
            </View>

            <View style={styles.progressContainer}>
                {passosDinamicos.map((_: any, i: number) => (
                    <View key={i} style={[styles.progressStep, i <= passoAtual ? styles.progressActive : styles.progressInactive]} />
                ))}
            </View>
            
            <ScrollView showsVerticalScrollIndicator={false}>
                <Animated.View key={passoAtual} entering={FadeIn.duration(400)}>
                    <View style={styles.stepCard}>
                        <Text style={styles.stepIndicator}>Passo {passoAtual + 1} de {passosDinamicos.length}</Text>
                        <Text style={styles.stepTitle}>{step?.titulo}</Text>
                        <Text style={styles.stepDescription}>{step?.descricao}</Text>

                        {step?.hasTimer && (
                            <View style={styles.timerInternalWrapper}>
                                <View style={styles.outerCircle}>
                                    <View style={styles.innerCircle}>
                                        <Text style={styles.timerText}>{formatTime(tempo)}</Text>
                                        <Text style={styles.timerSubtext}>Tempo</Text>
                                    </View>
                                </View>

                                <View style={styles.timerActionsRow}>
                                    <Pressable style={styles.btnTimerReset} onPress={resetarTimer}>
                                        <RotateCcw size={15} color={Colors.primary} />
                                        <Text style={styles.btnTimerResetText}>Reiniciar</Text>
                                    </Pressable>

                                    <Pressable style={styles.btnTimerControl} onPress={() => setTimerAtivo(!timerAtivo)}>
                                        {timerAtivo ? <Pause size={20} color="white" fill="white" /> : <Play size={15} color="white" fill="white" />}
                                        <Text style={styles.btnTimerControlText}>{timerAtivo ? 'Pausar' : 'Iniciar'}</Text>
                                    </Pressable>
                                </View>
                            </View>
                        )}
                    </View>

                    <Animated.View
                        entering={FadeInLeft.duration(600).delay(200)}
                        style={styles.dicaBox}
                    >
                        <View style={styles.dicaIconCircle}><Lightbulb size={20} color={Colors.primary} /></View>
                        <View style={{ flex: 1 }}>
                            <Text style={styles.dicaTitle}>DICA DO CHEF</Text>
                            <Text style={styles.dicaText}>{step?.dica}</Text>
                        </View>
                    </Animated.View>
                </Animated.View>
            </ScrollView>

            <View style={styles.footer}>
                {passoAtual > 0 && (
                    <Pressable style={[styles.btnAcao, styles.btnBorda]} onPress={() => setPassoAtual(passoAtual - 1)}>
                        <Text style={[styles.btnAcaoTexto, { color: Colors.primary }]}>Anterior</Text>
                    </Pressable>
                )}
                <Pressable
                    style={[styles.btnAcao, styles.btnLaranja]}
                    onPress={() => passoAtual === passosDinamicos.length - 1 ? setIsConcluido(true) : setPassoAtual(passoAtual + 1)}
                >
                    <Text style={[styles.btnAcaoTexto, { color: Colors.light }]}>
                        {passoAtual === passosDinamicos.length - 1 ? 'Concluir' : 'Próximo'}
                    </Text>
                </Pressable>
            </View>
        </View>
    );
}