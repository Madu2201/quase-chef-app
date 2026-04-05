import { Sparkles } from 'lucide-react-native';
import React from 'react';
import { StyleProp, StyleSheet, Text, TouchableOpacity, View, ViewStyle } from 'react-native';
import { Colors, Fonts, FontSizes, Radius, Shadows, Spacing } from '../constants/theme';

interface GenerateButtonProps {
    onPress: () => void;
    selectedCount: number;
    label?: string;
    style?: StyleProp<ViewStyle>;
    showBadge?: boolean;
    alwaysVisible?: boolean;
    iconColor?: string;
    disabled?: boolean;
}

export const GenerateButton = ({
    onPress,
    selectedCount,
    label = "Gerar receitas",
    style,
    showBadge = true,        
    alwaysVisible = false,   
    iconColor = Colors.light,
    disabled = false
}: GenerateButtonProps) => {

    if (!alwaysVisible && selectedCount === 0) return null;

    return (
        <TouchableOpacity
            style={[
                styles.button,
                style,
                alwaysVisible && selectedCount === 0 && { opacity: 0.6 } 
            ]}
            onPress={onPress}
            activeOpacity={0.8}
            disabled={disabled || (alwaysVisible && selectedCount === 0)} 
        >
            <View style={styles.content}>
                <Sparkles size={20} color={iconColor} fill={iconColor} />
                <Text style={styles.text}>{label}</Text>
            </View>

            {showBadge && selectedCount > 0 && (
                <View style={styles.badgeContainer}>
                    <Text style={styles.badgeText}>{selectedCount}</Text>
                </View>
            )}
        </TouchableOpacity>
    );
};

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