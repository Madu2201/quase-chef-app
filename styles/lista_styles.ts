import { StyleSheet } from "react-native";
import { Colors, Fonts, FontSizes, Spacing, Radius, Shadows } from "../constants/theme";

export const listaStyles = StyleSheet.create({
    // --- ESTRUTURA PRINCIPAL ---
    container: {
        flex: 1,
        backgroundColor: Colors.background,
    },
    scrollContent: {
        paddingTop: Spacing.md,
        paddingBottom: Spacing.xl * 2,
    },

    // --- HEADER E EXPORTAÇÃO ---
    titleContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        width: '100%',
        paddingHorizontal: Spacing.lg,
        marginBottom: Spacing.md,
    },
    title: {
        fontFamily: Fonts.bold,
        fontSize: FontSizes.large,
        color: Colors.primary,
        textAlign: 'left',
    },
    exportBtn: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: Colors.secondary,
        paddingHorizontal: Spacing.md,
        paddingVertical: Spacing.xs,
        borderRadius: Radius.full,
        gap: Spacing.xs,
        borderWidth: 1,
        borderColor: Colors.secondary,
    },
    exportText: {
        color: Colors.secondary,
        fontFamily: Fonts.bold,
        fontSize: FontSizes.small,
    },

    // --- FORMULÁRIO DE ADIÇÃO ---
    addFormContainer: {
        marginTop: Spacing.xs,
        paddingHorizontal: Spacing.lg,
    },
    inputLabel: {
        fontFamily: Fonts.medium,
        fontSize: FontSizes.small,
        color: Colors.subtext,
        marginBottom: Spacing.xs / 2,
    },
    inputBase: {
        backgroundColor: Colors.background,
        borderRadius: Radius.md,
        height: 48,
        paddingHorizontal: Spacing.md,
        fontFamily: Fonts.regular,
        color: Colors.dark,
        borderWidth: 1.5,
        borderColor: 'transparent',
        // @ts-ignore
        outlineStyle: 'none' as any,
    },
    inputFocused: {
        borderColor: Colors.secondary,
        backgroundColor: Colors.light,
    },
    inputFull: {
        marginBottom: Spacing.md,
    },
    inputSmall: {
        textAlign: 'center',
    },
    row: {
        flexDirection: 'row',
        gap: Spacing.md,
        alignItems: 'flex-end',
    },
    inputField: {
        flex: 1,
    },
    pickerMock: {
        backgroundColor: Colors.background,
        borderRadius: Radius.md,
        height: 48,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: Spacing.md,
        borderWidth: 1.5,
        borderColor: 'transparent',
    },
    plusBtn: {
        backgroundColor: Colors.secondary,
        width: 48,
        height: 48,
        borderRadius: Radius.md,
        justifyContent: 'center',
        alignItems: 'center',
        ...Shadows.sm,
    },

    // --- AÇÕES E SEÇÕES ---
    actionRow: {
        flexDirection: 'row',
        paddingHorizontal: Spacing.lg,
        marginBottom: Spacing.lg,
    },
    btnAction: {
        flex: 1,
        height: 40,
        borderRadius: Radius.md,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: Spacing.xs,
    },
    btnOutline: {
        backgroundColor: Colors.light,
        borderWidth: 1,
        borderColor: Colors.secondary,
    },
    btnTextOutline: {
        color: Colors.secondary,
        fontFamily: Fonts.bold,
        fontSize: FontSizes.small,
    },
    sectionHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingHorizontal: Spacing.lg,
        marginBottom: Spacing.sm,
        alignItems: 'baseline',
    },
    sectionTitle: {
        fontFamily: Fonts.bold,
        fontSize: FontSizes.medium,
        color: Colors.dark,
    },
    itemCount: {
        fontFamily: Fonts.medium,
        fontSize: FontSizes.small - 2,
        color: Colors.subtext,
        textTransform: 'uppercase',
    },

    // --- CARDS DE ITENS ---
    itemCard: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: Colors.light,
        marginHorizontal: Spacing.lg,
        marginBottom: Spacing.sm,
        padding: Spacing.md,
        borderRadius: Radius.lg,
        ...Shadows.xs,
    },
    checkbox: {
        width: 24,
        height: 24,
        borderRadius: Radius.sm,
        borderWidth: 2,
        borderColor: Colors.secondary,
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: Spacing.sm,
    },
    checkboxChecked: {
        backgroundColor: Colors.secondary,
        borderColor: Colors.secondary,
    },
    itemInfo: {
        flex: 1,
        marginLeft: Spacing.xs,
    },
    itemName: {
        fontFamily: Fonts.bold,
        fontSize: FontSizes.medium,
        color: Colors.dark,
    },
    itemSub: {
        fontFamily: Fonts.regular,
        fontSize: FontSizes.small,
        color: Colors.subtext,
    },

    // --- ESTADOS ESPECIAIS (CONCLUÍDO) ---
    itemCardComprado: {
        opacity: 0.6,
        backgroundColor: Colors.dark + '05',
        ...Shadows.none,
    },
    nameComprado: {
        textDecorationLine: 'line-through',
        color: Colors.subtext,
    },
    removeCompradosText: {
        color: Colors.primary,
        fontFamily: Fonts.bold,
        fontSize: FontSizes.small - 2,
        textTransform: 'uppercase',
    }
});