import { StyleSheet, Platform } from "react-native";
import { Colors, Fonts, FontSizes, Spacing, Radius, Shadows } from "../constants/theme";

export const dispensaStyles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: Colors.background,
    },
    // Header fixo com sombra e profundidade
    header: {
        backgroundColor: Colors.light,
        paddingTop: Platform.OS === 'ios' ? Spacing.xl * 2 : Spacing.xl,
        ...Shadows.md,
        zIndex: 10,
        borderBottomWidth: 1,
        borderBottomColor: 'rgba(0,0,0,0.05)',
    },
    // Divisor abaixo do título da página
    titleContainer: {
        borderBottomWidth: 1,
        borderBottomColor: 'rgba(0,0,0,0.05)',
        paddingBottom: Spacing.md,
        marginBottom: Spacing.md,
    },
    title: {
        fontFamily: Fonts.bold,
        fontSize: FontSizes.title,
        color: Colors.dark,
        textAlign: "center",
    },
    headerContent: {
        paddingHorizontal: Spacing.lg,
        paddingBottom: Spacing.lg,
    },
    // Barra de busca interna do header
    searchContainer: {
        backgroundColor: Colors.background,
        borderRadius: Radius.full,
        flexDirection: "row",
        alignItems: "center",
        paddingHorizontal: Spacing.md,
        height: 48,
        borderWidth: 1.5,
        borderColor: 'transparent',
        marginBottom: Spacing.md,
    },
    searchContainerFocused: {
        borderColor: Colors.primary,
        backgroundColor: Colors.light,
    },
    searchInput: {
        flex: 1,
        fontFamily: Fonts.regular,
        fontSize: FontSizes.medium,
        color: Colors.primary,
        marginLeft: Spacing.sm,
        height: "100%",
        // @ts-ignore
        outlineStyle: 'none' as any,
    },
    // Card de inserção de novo ingrediente
    addSection: {
        backgroundColor: Colors.background,
        borderRadius: Radius.lg,
        padding: Spacing.md,
        borderWidth: 1,
        borderColor: Colors.errorLight,
    },
    sectionLabel: {
        fontFamily: Fonts.bold,
        fontSize: FontSizes.medium,
        color: Colors.dark,
        marginBottom: Spacing.sm,
        marginTop: Spacing.xs,
    },
    // Input principal do cadastro (nome)
    inputFull: {
        backgroundColor: Colors.light,
        borderRadius: Radius.md,
        height: 44,
        borderWidth: 1,
        borderColor: Colors.errorLight,
        paddingHorizontal: Spacing.md,
        fontFamily: Fonts.regular,
        fontSize: FontSizes.medium,
        marginBottom: Spacing.sm,
        color: Colors.subtitle,
        // @ts-ignore
        outlineStyle: 'none' as any,
    },
    row: {
        flexDirection: "row",
        gap: Spacing.sm,
        alignItems: "center",
        // RESPONSIVIDADE: Permite quebrar se o espaço acabar
        flexWrap: "wrap",
    },
    // Inputs menores (quantidade e unidade)
    inputSmall: {
        flexGrow: 1,
        minWidth: 60, // Evita que fique muito espremido antes de quebrar
        height: 44,
        borderRadius: Radius.md,
        borderWidth: 1,
        borderColor: Colors.errorLight,
        textAlign: "center",
        fontFamily: Fonts.regular,
        color: Colors.subtitle,
        backgroundColor: Colors.light,
        // @ts-ignore
        outlineStyle: 'none' as any,
    },
    pickerContainer: {
        flexGrow: 1.5,
        minWidth: 80,
        height: 44,
        borderRadius: Radius.md,
        borderWidth: 1,
        borderColor: Colors.errorLight,
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        paddingHorizontal: Spacing.sm,
        backgroundColor: Colors.light,
    },
    // Botão de confirmação de adição
    btnAdd: {
        backgroundColor: Colors.secondary,
        width: 50,
        minWidth: 50, // Mantém o tamanho do botão
        height: 44,
        borderRadius: Radius.md,
        justifyContent: "center",
        alignItems: "center",
        // Faz o botão ocupar a linha toda se quebrar em telas micro
        flexGrow: Platform.OS === 'web' ? 0 : 0.2,
    },
    // Configuração da lista de itens
    scrollContent: {
        paddingHorizontal: Spacing.lg,
        paddingTop: Spacing.md,
        paddingBottom: Spacing.xl * 5,
    },
    ingredientItem: {
        flexDirection: "row",
        paddingVertical: Spacing.md,
        borderBottomWidth: 1,
        borderBottomColor: Colors.light,
        alignItems: "center",
    },
    // Checkbox de seleção para receitas
    checkbox: {
        width: 26,
        height: 26,
        borderRadius: Radius.full,
        borderWidth: 2,
        borderColor: Colors.primary,
        justifyContent: "center",
        alignItems: "center",
        marginRight: Spacing.sm,
    },
    checkboxActive: {
        backgroundColor: Colors.primary,
    },
    ingredientInfo: {
        flex: 1,
    },
    ingredientName: {
        fontFamily: Fonts.bold,
        fontSize: FontSizes.medium,
        color: Colors.dark,
        marginBottom: Spacing.xs,
    },
    // Controles de edição rápida na lista
    controlsRow: {
        flexDirection: "row",
        alignItems: "center",
        gap: 6,
        // RESPONSIVIDADE: Quebra a Qtd/Un se o nome do ingrediente for muito grande
        flexWrap: "wrap",
    },
    listInputQty: {
        width: 55,
        minWidth: 45,
        height: 32,
        borderRadius: Radius.full,
        borderWidth: 1,
        borderColor: Colors.errorLight,
        textAlign: "center",
        fontFamily: Fonts.regular,
        fontSize: FontSizes.small,
        color: Colors.subtitle,
        backgroundColor: Colors.light,
        // @ts-ignore
        outlineStyle: 'none' as any,
    },
    listPickerUnit: {
        minWidth: 65,
        height: 32,
        borderRadius: Radius.full,
        borderWidth: 1,
        borderColor: Colors.errorLight,
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center",
        gap: 4,
        paddingHorizontal: 8,
        backgroundColor: Colors.light,
    },
    unitText: {
        fontSize: FontSizes.small,
        fontFamily: Fonts.regular,
        color: Colors.dark,
    },
    rightIcons: {
        marginLeft: Spacing.sm,
    },
    // Botão flutuante de ação principal
    floatingBtn: {
        position: "absolute",
        bottom: Spacing.md,
        left: Spacing.lg,
        right: Spacing.lg,
        backgroundColor: Colors.primary,
        height: 60,
        borderRadius: Radius.full,
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        paddingHorizontal: Spacing.lg,
        ...Shadows.md,
    },
    floatingBtnLeft: {
        flexDirection: "row",
        alignItems: "center",
        gap: Spacing.sm,
    },
    floatingBtnText: {
        color: Colors.light,
        fontFamily: Fonts.bold,
        fontSize: FontSizes.medium,
    },
    // Contador de itens selecionados no botão
    badgeContainer: {
        backgroundColor: "rgba(255,255,255,0.2)",
        paddingHorizontal: 10,
        paddingVertical: 4,
        borderRadius: Radius.full,
    },
    badgeText: {
        color: Colors.light,
        fontSize: FontSizes.small,
        fontFamily: Fonts.bold,
    },
});