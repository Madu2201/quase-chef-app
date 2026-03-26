import { StyleSheet } from "react-native";
import { Colors, Fonts, FontSizes, Spacing, Radius, Shadows } from "../constants/theme";

export const dispensaStyles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: Colors.background,
    },
    // Seção de formulário (vai dentro do header como children)
    addSection: {
        marginTop: Spacing.xs,
    },
    sectionLabel: {
        fontFamily: Fonts.bold,
        fontSize: FontSizes.small,
        color: Colors.subtext,
        marginBottom: 8,
    },
    // Inputs do formulário de adição
    inputBase: {
        backgroundColor: Colors.background,
        borderRadius: Radius.md,
        height: 45,
        paddingHorizontal: Spacing.md,
        fontFamily: Fonts.regular,
        fontSize: FontSizes.medium,
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
        marginBottom: Spacing.sm,
    },
    row: {
        flexDirection: "row",
        gap: Spacing.sm,
        alignItems: "center",
    },
    inputField: {
        flex: 1,
    },
    inputSmall: {
        textAlign: "center",
    },
    pickerMock: {
        backgroundColor: Colors.background,
        borderRadius: Radius.md,
        height: 45,
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        paddingHorizontal: Spacing.sm,
        flex: 1.2,
    },
    btnAdd: {
        backgroundColor: Colors.secondary,
        width: 45,
        height: 45,
        borderRadius: Radius.md,
        justifyContent: "center",
        alignItems: "center",
        ...Shadows.sm,
    },
    // Listagem
    scrollContent: {
        paddingHorizontal: Spacing.lg,
        paddingTop: Spacing.xl,
        paddingBottom: 120,
    },
    ingredientItem: {
        flexDirection: "row",
        paddingVertical: Spacing.md,
        borderBottomWidth: 1,
        borderBottomColor: Colors.light,
        alignItems: "center",
    },
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
    controlsRow: {
        flexDirection: "row",
        alignItems: "center",
        gap: 6,
    },
    listInputQty: {
        width: 55,
        height: 32,
        borderRadius: Radius.full,
        borderWidth: 1,
        borderColor: Colors.primary + '30',
        textAlign: "center",
        fontFamily: Fonts.regular,
        fontSize: FontSizes.small,
        color: Colors.dark,
        backgroundColor: Colors.light,
    },
    listPickerUnit: {
        minWidth: 65,
        height: 32,
        borderRadius: Radius.full,
        borderWidth: 1,
        borderColor: Colors.primary + '30',
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
    // Floating Button
    floatingBtn: {
        position: "absolute",
        bottom: 30,
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
    floatingBtnText: {
        color: Colors.light,
        fontFamily: Fonts.bold,
        fontSize: FontSizes.medium,
    },
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