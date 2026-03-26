import { StyleSheet } from "react-native";
import { Colors, Fonts, FontSizes, Spacing, Radius, Shadows } from "../constants/theme";

export const listaStyles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: Colors.background,
    },
    // --- BOTÃO DE EXPORTAR (Vai no Header) ---
    exportBtn: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#FFF2ED',
        paddingHorizontal: Spacing.md,
        paddingVertical: 6,
        borderRadius: Radius.full,
        gap: 6,
    },
    exportText: {
        color: Colors.secondary,
        fontFamily: Fonts.bold,
        fontSize: FontSizes.small,
    },
    // --- FORMULÁRIO DE ADIÇÃO (Children do Header) ---
    addFormContainer: {
        marginTop: Spacing.xs,
    },
    inputLabel: {
        fontFamily: Fonts.medium,
        fontSize: FontSizes.small,
        color: Colors.subtext,
        marginBottom: 4,
    },
    inputBase: {
        backgroundColor: Colors.background,
        borderRadius: Radius.md,
        height: 48,
        paddingHorizontal: Spacing.md,
        fontFamily: Fonts.regular,
        color: Colors.dark,
        borderWidth: 1.5,
        borderColor: Colors.primary + '30',
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
    // --- LISTAGEM ---
    scrollContent: {
        paddingTop: Spacing.md,
        paddingBottom: 100,
    },
    actionRow: {
        flexDirection: 'row',
        paddingHorizontal: Spacing.lg,
        marginVertical: Spacing.lg,
    },
    btnAction: {
        flex: 1,
        height: 40,
        borderRadius: Radius.md,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 6,
    },
    btnOutline: {
        backgroundColor: Colors.light,
        borderWidth: 1,
        borderColor: Colors.secondary + '30',
    },
    btnTextOutline: {
        color: Colors.secondary,
        fontFamily: Fonts.bold,
        fontSize: FontSizes.small
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
        fontSize: 10,
        color: Colors.subtext,
        textTransform: 'uppercase',
    },
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
        borderRadius: 6,
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
        marginLeft: Spacing.sm,
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
    itemCardComprado: {
        opacity: 0.6,
        backgroundColor: Colors.background,
        ...Shadows.none,
    },
    nameComprado: {
        textDecorationLine: 'line-through',
        color: Colors.subtext,
    },
    removeCompradosText: {
        color: Colors.primary,
        fontFamily: Fonts.bold,
        fontSize: 10,
        textTransform: 'uppercase',
    }
});