import { StyleSheet, Platform } from "react-native";
import { Colors, Fonts, FontSizes, Spacing, Radius, Shadows } from "../constants/theme";

export const homeStyles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: Colors.background,
    },
    headerFixed: {
        backgroundColor: Colors.background,
        paddingHorizontal: Spacing.lg,
        paddingTop: Spacing.xl + Spacing.lg,
        paddingBottom: Spacing.md,
        zIndex: 10,
        ...Platform.select({
            ios: Shadows.sm,
            android: Shadows.sm,
        }),
    },
    scrollContent: {
        paddingHorizontal: Spacing.lg,
        paddingTop: Spacing.md,
        paddingBottom: Spacing.xl,
    },
    userHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: Spacing.sm,
    },
    avatarContainer: {
        width: 48,
        height: 48,
        borderRadius: 24,
        backgroundColor: Colors.light,
        alignItems: 'center',
        justifyContent: 'center',
        borderWidth: 1.5,
        borderColor: Colors.primary,
    },
    greetingText: {
        fontFamily: Fonts.regular,
        fontSize: FontSizes.small,
        color: Colors.subtitle,
    },
    userNameRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: Spacing.xs,
    },
    userName: {
        fontFamily: Fonts.bold,
        fontSize: FontSizes.medium,
        color: Colors.dark,
    },
    mainTitle: {
        fontFamily: Fonts.bold,
        fontSize: FontSizes.title, 
        color: Colors.dark,
        lineHeight: FontSizes.title + 14,
        marginTop: Spacing.md,
    },
    mainSubtitle: {
        fontFamily: Fonts.regular,
        fontSize: FontSizes.small + 2,
        color: Colors.subtitle,
        marginTop: Spacing.xs,
        marginBottom: Spacing.xl,
    },
    sectionHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: Spacing.md,
    },
    sectionTitle: {
        fontFamily: Fonts.bold,
        fontSize: FontSizes.large,
        color: Colors.dark,
    },
    editText: {
        fontFamily: Fonts.medium,
        color: Colors.primary,
        fontSize: FontSizes.medium,
    },
    ingredientsWrapper: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: Spacing.sm,
        marginBottom: Spacing.xl,
    },
    ingredientTag: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: Colors.light,
        paddingHorizontal: Spacing.md,
        paddingVertical: Spacing.sm,
        borderRadius: Radius.lg,
        gap: Spacing.xs,
        borderWidth: 1,
        borderColor: Colors.primary,
    },
    ingredientText: {
        fontFamily: Fonts.medium,
        fontSize: FontSizes.small,
        color: Colors.dark,
    },
    generateButton: {
        backgroundColor: Colors.primary,
        flexDirection: 'row',
        // Altura baseada em múltiplos de Spacing para manter proporção
        height: Spacing.xl * 2.5,
        borderRadius: Radius.lg,
        justifyContent: 'center',
        alignItems: 'center',
        gap: Spacing.md,
        marginBottom: Spacing.xl,
        ...Platform.select({
            ios: Shadows.md,
            android: Shadows.md,
        }),
    },
    generateButtonText: {
        fontFamily: Fonts.bold,
        color: Colors.light,
        fontSize: FontSizes.medium,
        textAlign: 'center',
        width: '75%',
    },
    recipeCard: {
        flexDirection: 'row',
        backgroundColor: Colors.light,
        borderRadius: Radius.lg,
        marginBottom: Spacing.md,
        overflow: 'hidden',
        ...Platform.select({
            ios: Shadows.sm,
            android: Shadows.sm,
        }),
    },
    recipeImage: {
        width: Spacing.xl * 3,
        height: Spacing.xl * 3,
    },
    recipeInfo: {
        flex: 1,
        padding: Spacing.md,
        justifyContent: 'center',
    },
    recipeTime: {
        fontFamily: Fonts.bold,
        fontSize: FontSizes.small - 2,
        color: Colors.primary,
        textTransform: 'uppercase',
        marginBottom: Spacing.xs,
    },
    recipeTitle: {
        fontFamily: Fonts.bold,
        fontSize: FontSizes.medium,
        color: Colors.dark,
    },
    recipeDesc: {
        fontFamily: Fonts.regular,
        fontSize: FontSizes.small,
        color: Colors.subtitle,
        marginTop: Spacing.xs - 2,
    }
});