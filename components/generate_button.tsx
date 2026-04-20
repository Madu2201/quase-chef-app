import { Sparkles } from 'lucide-react-native';
import React from 'react';
import { StyleProp, StyleSheet, Text, TouchableOpacity, View, ViewStyle } from 'react-native';

// Meus imports
import { Colors, Fonts, FontSizes, Radius, Shadows, Spacing } from '../constants/theme';

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
    forceEnabled = false
}: GenerateButtonProps) => {

    if (!alwaysVisible && selectedCount === 0) return null;

    // Verifica se o botão deve estar desabilitado
    const isDisabled = forceEnabled ? disabled : (disabled || (alwaysVisible && selectedCount === 0));
    const shouldReduceOpacity = forceEnabled ? false : (alwaysVisible && selectedCount === 0);

    // Renderiza o botão
    return (
        <TouchableOpacity
            style={[
                styles.button,
                style,
                shouldReduceOpacity && { opacity: 0.6 } 
            ]}
            onPress={onPress}
            activeOpacity={0.8}
            disabled={isDisabled} 
        >
            <View style={styles.content}>
                <Sparkles size={20} color={iconColor} fill={iconColor} />
                <Text style={styles.text}>{label}</Text>
            </View>

            {showBadge && selectedCount > 0 && (
                <View style={[styles.badgeContainer, badgeContainerStyle]}>
                    <Text style={styles.badgeText}>{selectedCount}</Text>
                </View>
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