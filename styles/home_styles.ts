import { StyleSheet } from "react-native";
import { Colors, Fonts, FontSizes, Radius, Shadows, Spacing } from "../constants/theme";
import { GLOBAL_ACTION_BUTTONS } from "./global_styles";

export const homeStyles = StyleSheet.create({
    ...GLOBAL_ACTION_BUTTONS,
    //Header
    customHeader: {
        paddingTop: 0,
        paddingBottom: 0,
        marginBottom: 0,
    },
    // Container principal
    container: {
        flex: 1,
        backgroundColor: Colors.background,
    },
    scrollContent: {
        paddingTop: Spacing.md,
        paddingBottom: Spacing.xl,
    },
    // --- PERFIL ---
    userHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: Spacing.sm,
    },
    avatarContainer: {
        width: 42,
        height: 42,
        borderRadius: Radius.full,
        backgroundColor: Colors.light,
        alignItems: 'center',
        justifyContent: 'center',
        borderWidth: 1.5,
        borderColor: Colors.primary,
    },
    userName: {
        fontFamily: Fonts.bold,
        fontSize: FontSizes.small,
        color: Colors.dark,
    },
    greetingText: {
        fontFamily: Fonts.regular,
        fontSize: FontSizes.small - 1,
        color: Colors.subtitle,
    },
    // --- TEXTOS ---
    mainTitle: {
        fontFamily: Fonts.bold,
        fontSize: FontSizes.large,
        color: Colors.dark,
        paddingHorizontal: Spacing.lg,
        marginTop: Spacing.sm,
        marginBottom: Spacing.xs,
    },
    mainSubtitle: {
        fontFamily: Fonts.regular,
        fontSize: FontSizes.small,
        color: Colors.subtitle,
        paddingHorizontal: Spacing.lg,
        marginBottom: Spacing.lg,
    },
    // --- SEÇÕES ---
    sectionHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: Spacing.lg,
        marginBottom: Spacing.sm,
    },
    sectionTitle: {
        fontFamily: Fonts.bold,
        fontSize: FontSizes.medium,
        color: Colors.dark,
    },
    editText: {
        fontFamily: Fonts.bold,
        fontSize: FontSizes.small,
        color: Colors.primary,
    },
    // --- HERO CARD ---
    heroCard: {
        backgroundColor: Colors.light,
        overflow: "hidden",
        marginHorizontal: Spacing.lg,
        marginBottom: Spacing.lg,
        borderWidth: 1,
        borderColor: Colors.primary + "10",
        borderRadius: Radius.lg,
        ...Shadows.sm,
    },
    heroTextArea: {
        padding: Spacing.md,
    },
    heroTag: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 6,
        backgroundColor: Colors.background,
        paddingHorizontal: Spacing.md,
        paddingVertical: Spacing.xs,
        borderRadius: Radius.full,
        alignSelf: "flex-start",
        marginBottom: Spacing.sm,
    },
    heroTagText: {
        fontSize: FontSizes.small - 1,
        fontFamily: Fonts.bold,
        color: Colors.primary,
    },
    heroTitle: {
        fontSize: FontSizes.large,
        fontFamily: Fonts.bold,
        color: Colors.dark,
    },
    heroImage: {
        width: "100%",
        height: 120,
    },
    // --- BOTÃO GERAR ---
    btnContainer: {
        paddingHorizontal: Spacing.lg,
        marginBottom: Spacing.lg,
    },
    generateButton: {
        ...GLOBAL_ACTION_BUTTONS.btn,
        height: 52,
        gap: Spacing.sm,
        ...Shadows.sm,
    },
    generateButtonText: {
        ...GLOBAL_ACTION_BUTTONS.btnText,
        fontSize: FontSizes.small,
    },
    // --- CARDS ---
    recipeCard: {
        backgroundColor: Colors.light,
        borderRadius: Radius.md,
        marginBottom: Spacing.md,
        marginHorizontal: Spacing.lg,
        elevation: 3,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
    },
    recipeTouchable: {
        flexDirection: 'row',
        alignItems: 'center',
        borderRadius: Radius.md,
        overflow: 'hidden',
        backgroundColor: Colors.light,
    },
    recipeImage: {
        width: 100,
        height: 100,
    },
    recipeInfo: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: Spacing.md,
        paddingVertical: Spacing.sm,
        height: 100,
    },
    recipeTextBlock: {
        flex: 1,
        flexShrink: 1,
        justifyContent: 'center',
        marginRight: Spacing.sm,
    },
    recipeArrowBlock: {
        justifyContent: 'center',
        alignItems: 'center',
    },
    recipeTime: {
        fontFamily: Fonts.bold,
        fontSize: FontSizes.small - 3,
        color: Colors.primary,
        textTransform: 'uppercase',
        marginBottom: 2,
    },
    recipeTitle: {
        fontFamily: Fonts.bold,
        fontSize: FontSizes.small,
        color: Colors.dark,
        marginBottom: 1,
    },
    recipeDesc: {
        fontFamily: Fonts.regular,
        fontSize: FontSizes.small - 2,
        color: Colors.subtitle,
        lineHeight: 16,
    },
});