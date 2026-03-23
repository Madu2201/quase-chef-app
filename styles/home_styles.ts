import { StyleSheet } from "react-native";
import { Colors, Fonts, FontSizes, Spacing, Radius, Shadows } from "../constants/theme";

export const homeStyles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: Colors.background,
    },
    headerFixed: {
        backgroundColor: Colors.background,
        paddingHorizontal: Spacing.lg,
        paddingTop: 60,
        paddingBottom: Spacing.md,
        zIndex: 10,
        ...Shadows.sm,
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
        gap: 4,
    },
    userName: {
        fontFamily: Fonts.bold,
        fontSize: FontSizes.medium + 2,
        color: Colors.dark,
    },
    mainTitle: {
        fontFamily: Fonts.bold,
        fontSize: 32,
        color: Colors.dark,
        lineHeight: 38,
    },
    mainSubtitle: {
        fontFamily: Fonts.regular,
        fontSize: FontSizes.medium,
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
        fontSize: FontSizes.medium + 2,
        color: Colors.dark,
    },
    editText: {
        fontFamily: Fonts.medium,
        color: Colors.primary,
        fontSize: FontSizes.medium,
    },
    // NOVO: Wrapper para os ingredientes quebrarem linha
    ingredientsWrapper: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 8,
        marginBottom: Spacing.xl,
    },
    ingredientTag: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#FFE5D1',
        paddingHorizontal: Spacing.md,
        paddingVertical: Spacing.sm,
        borderRadius: Radius.lg,
        gap: 6,
    },
    ingredientText: {
        fontFamily: Fonts.medium,
        fontSize: FontSizes.small + 1,
        color: Colors.dark,
    },
    generateButton: {
        backgroundColor: Colors.primary,
        flexDirection: 'row',
        height: 90,
        borderRadius: Radius.lg,
        justifyContent: 'center',
        alignItems: 'center',
        gap: Spacing.sm,
        marginBottom: Spacing.xl,
        ...Shadows.md,
    },
    generateButtonText: {
        fontFamily: Fonts.bold,
        color: Colors.light,
        fontSize: 18,
        textAlign: 'center',
        width: '70%',
    },
    recipeCard: {
        flexDirection: 'row',
        backgroundColor: Colors.light,
        borderRadius: Radius.lg,
        marginBottom: Spacing.md,
        overflow: 'hidden',
        ...Shadows.sm,
    },
    recipeImage: {
        width: 110,
        height: 110,
    },
    recipeInfo: {
        flex: 1,
        padding: Spacing.md,
        justifyContent: 'center',
    },
    recipeTime: {
        fontFamily: Fonts.bold,
        fontSize: 10,
        color: Colors.primary,
        textTransform: 'uppercase',
        marginBottom: 4,
    },
    recipeTitle: {
        fontFamily: Fonts.bold,
        fontSize: FontSizes.medium,
        color: Colors.dark,
    },
    recipeDesc: {
        fontFamily: Fonts.regular,
        fontSize: 12,
        color: Colors.subtitle,
        marginTop: 2,
    }
});