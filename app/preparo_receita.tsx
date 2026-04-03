import { router, useLocalSearchParams } from 'expo-router';
import { Heart, Lightbulb, Pause, Play, RotateCcw, Share2, Stars, X } from 'lucide-react-native';
import React, { useEffect, useState } from 'react';
import { Alert, Image, Pressable, ScrollView, Share, StatusBar, Text, View } from 'react-native';
import Animated, {
    FadeIn,
    FadeInLeft,
    FadeInUp,
    useAnimatedStyle,
    useSharedValue,
    withSpring
} from 'react-native-reanimated';

// Meus imports
import { Colors } from '../constants/theme';
import { preparoStyles as styles } from '../styles/preparo_styles';

// ✅ 1. IMPORTA O HOOK GLOBAL (O Cérebro)
import { useFavoritosGlobal } from '../hooks/useFavoritos';

// Tela de preparo da receita, com passos dinâmicos e timer integrado
export default function PreparoReceitaScreen() {
    const params = useLocalSearchParams();

    // Precisamos do ID para saber o que favoritar!
    const idReceita = params.id as string;

    const imagemUri = Array.isArray(params.imagem) ? params.imagem[0] : params.imagem;
    const passosDinamicos = params.passosJson ? JSON.parse(params.passosJson as string) : [];

    const [passoAtual, setPassoAtual] = useState(0);
    const [isConcluido, setIsConcluido] = useState(false);
    const [tempo, setTempo] = useState<number>(0);
    const [timerAtivo, setTimerAtivo] = useState(false);

    // ✅ 2. PUXA AS FUNÇÕES DO CÉREBRO
    const { isFavorito, toggleFavorito } = useFavoritosGlobal();
    const ehFav = isFavorito(idReceita); // Verifica no banco se já é favorito

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
        let interval: ReturnType<typeof setInterval>;
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

    // Função para compartilhar a receita concluída
    const handleShare = async () => {
        try {
            await Share.share({
                message: `Olha só a receita de ${params.titulo} que acabei de preparar! 🍳`,
            });
        } catch (error) {
            Alert.alert("Erro", "Não foi possível compartilhar.");
        }
    };

    // ✅ 3. FUNÇÃO DE FAVORITAR ATUALIZADA
    const handleToggleFavorito = () => {
        if (idReceita) {
            toggleFavorito(idReceita); // Manda o comando pro banco de dados
            heartScale.value = withSpring(1.5, {}, () => {
                heartScale.value = withSpring(1); // Faz a animação de pulo do coração
            });
        }
    };

    const animatedHeartStyle = useAnimatedStyle(() => ({
        transform: [{ scale: heartScale.value }]
    }));

    // Dados de exemplo para a receita, incluindo passos com e sem timer
    if (isConcluido) {
        return (
            <ScrollView contentContainerStyle={styles.containerSucesso} showsVerticalScrollIndicator={false}>
                <StatusBar barStyle="dark-content" />
                {/* Badge de sucesso */}
                <Animated.View entering={FadeInUp.duration(600)} style={styles.badgeWrapper}>
                    <View style={styles.successBadge}>
                        <Stars size={48} color={Colors.primary} />
                    </View>
                </Animated.View>
                {/* Parágrafo de parabéns */}
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
                    {/* ✅ 4. BOTÃO USANDO A VARIÁVEL GLOBAL */}
                    <Pressable
                        style={[styles.btnOutline, ehFav && styles.btnOutlineActive]}
                        onPress={handleToggleFavorito}
                    >
                        <Animated.View style={animatedHeartStyle}>
                            <Heart
                                size={18}
                                color={ehFav ? Colors.errorDark : Colors.primary}
                                fill={ehFav ? Colors.errorDark : "transparent"}
                            />
                        </Animated.View>
                        <Text style={[styles.btnOutlineText, ehFav && { color: Colors.errorDark }]}>
                            {ehFav ? 'Favoritado' : 'Favoritar'}
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
    // Tela de preparo com passos dinâmicos, timer integrado e dicas do chef
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
            {/* Indicador de progresso dos passos */}
            <View style={styles.progressContainer}>
                {passosDinamicos.map((_: any, i: number) => (
                    <View key={i} style={[styles.progressStep, i <= passoAtual ? styles.progressActive : styles.progressInactive]} />
                ))}
            </View>
            {/* Card do passo atual */}
            <ScrollView showsVerticalScrollIndicator={false}>
                <Animated.View key={passoAtual} entering={FadeIn.duration(400)}>
                    <View style={styles.stepCard}>
                        <Text style={styles.stepIndicator}>Passo {passoAtual + 1} de {passosDinamicos.length}</Text>
                        <Text style={styles.stepTitle}>{step?.titulo}</Text>
                        <Text style={styles.stepDescription}>{step?.descricao}</Text>
                        {/* Timer integrado, exibido apenas se o passo tiver um timer associado */}
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
                    {/* Dica do Chef */}
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
            {/* Botoes de acao */}
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