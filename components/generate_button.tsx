import { LinearGradient } from 'expo-linear-gradient';
import { Sparkles } from 'lucide-react-native';
import React, { useEffect } from 'react';
import { StyleProp, StyleSheet, Text, TouchableOpacity, View, ViewStyle } from 'react-native';
import Animated, {
    cancelAnimation,
    Easing,
    interpolate,
    useAnimatedStyle,
    useSharedValue,
    withRepeat,
    withTiming,
} from 'react-native-reanimated';

// Meus imports
import { Colors, Fonts, FontSizes, Radius, Shadows, Spacing } from '../constants/theme';

/** Largura da faixa luminosa (onda). Subir = onda mais “grossa”. */
const SHIMMER_BAND_WIDTH = 124;

// Componente de botão de gerar receitas
interface GenerateButtonProps {
    onPress: () => void;
    selectedCount: number;
    label?: string;
    style?: StyleProp<ViewStyle>;
    badgeContainerStyle?: StyleProp<ViewStyle>;
    showBadge?: boolean;
    alwaysVisible?: boolean;
    iconColor?: string;
    disabled?: boolean;
    forceEnabled?: boolean;
    /** Onda clara contínua — “em progresso” */
    loading?: boolean;
}

export const GenerateButton = ({
    onPress,
    selectedCount,
    label = "Gerar receitas",
    style,
    badgeContainerStyle,
    showBadge = true,        
    alwaysVisible = false,   
    iconColor = Colors.light,
    disabled = false,
    forceEnabled = false,
    loading = false,
}: GenerateButtonProps) => {

    if (!alwaysVisible && selectedCount === 0) return null;

    // Verifica se o botão deve estar desabilitado
    const isDisabled = forceEnabled ? disabled : (disabled || (alwaysVisible && selectedCount === 0));
    const shouldReduceOpacity = forceEnabled ? false : (alwaysVisible && selectedCount === 0);

    const buttonW = useSharedValue(220);
    const shimmerPhase = useSharedValue(0);

    useEffect(() => {
        if (loading) {
            shimmerPhase.value = withRepeat(
                withTiming(1, { duration: 1600, easing: Easing.linear }),
                -1,
                false,
            );
        } else {
            cancelAnimation(shimmerPhase);
            shimmerPhase.value = 0;
        }
    }, [loading]);

    const shimmerStyle = useAnimatedStyle(() => ({
        transform: [
            {
                translateX: interpolate(
                    shimmerPhase.value,
                    [0, 1],
                    [
                        -SHIMMER_BAND_WIDTH,
                        Math.max(buttonW.value, 120) + SHIMMER_BAND_WIDTH,
                    ],
                ),
            },
            { rotate: '-14deg' },
        ],
    }));

    const effectiveIconColor = loading ? Colors.light : iconColor;

    // Renderiza o botão
    return (
        <TouchableOpacity
            style={[
                styles.button,
                style,
                shouldReduceOpacity && { opacity: 0.6 },
                loading && styles.buttonLoading,
            ]}
            onPress={onPress}
            activeOpacity={0.8}
            disabled={isDisabled}
            onLayout={(e) => {
                buttonW.value = e.nativeEvent.layout.width;
            }}
        >
            <View style={styles.content}>
                <Sparkles size={20} color={effectiveIconColor} fill={effectiveIconColor} />
                <Text style={styles.text}>{label}</Text>
            </View>

            {showBadge && selectedCount > 0 && (
                <View style={[styles.badgeContainer, badgeContainerStyle]}>
                    <Text style={styles.badgeText}>{selectedCount}</Text>
                </View>
            )}

            {loading && (
                <Animated.View
                    pointerEvents="none"
                    style={[styles.shimmerStripe, shimmerStyle]}
                >
                    <LinearGradient
                        colors={[
                            'transparent',
                            'rgba(255,255,255,0.12)',
                            'rgba(255,255,255,0.45)',
                            'rgba(255,255,255,0.12)',
                            'transparent',
                        ]}
                        locations={[0, 0.28, 0.5, 0.72, 1]}
                        start={{ x: 0, y: 0.5 }}
                        end={{ x: 1, y: 0.5 }}
                        style={StyleSheet.absoluteFill}
                    />
                </Animated.View>
            )}
        </TouchableOpacity>
    );
};

// Estilos do botão
const styles = StyleSheet.create({
    button: {
        backgroundColor: Colors.primary,
        paddingHorizontal: Spacing.lg,
        paddingVertical: Spacing.md,
        borderRadius: Radius.full,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center', 
        ...Shadows.md,
    },
    buttonLoading: {
        overflow: 'hidden',
        opacity: 0.96,
    },
    shimmerStripe: {
        position: 'absolute',
        left: 0,
        top: -10,
        bottom: -10,
        width: SHIMMER_BAND_WIDTH,
        zIndex: 2,
    },
    content: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8
    },
    text: {
        color: Colors.light,
        fontFamily: Fonts.bold,
        fontSize: FontSizes.medium - 1
    },
    // Bolinha limpa mostrando só o número!
    badgeContainer: {
        backgroundColor: Colors.light,
        width: 28,
        height: 28,
        borderRadius: Radius.full,
        alignItems: 'center',
        justifyContent: 'center',
    },
    badgeText: {
        color: Colors.primary,
        fontSize: FontSizes.small,
        fontFamily: Fonts.bold
    }
});