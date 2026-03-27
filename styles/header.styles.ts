import { StyleSheet, Platform, TextStyle } from "react-native";
import { Colors, Fonts, FontSizes, Spacing, Radius, Shadows } from "../constants/theme";

export const headerStyles = StyleSheet.create({
    header: {
        backgroundColor: Colors.light,
        paddingTop: Platform.OS === 'ios' ? 60 : 40,
        zIndex: 10,
        borderBottomLeftRadius: Radius.xl,
        borderBottomRightRadius: Radius.xl,
        ...Shadows.md,
    },
    titleContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: Spacing.lg,
        paddingBottom: Spacing.sm,
        marginBottom: Spacing.sm,
        minHeight: 40,
        position: 'relative', // Importante para o botão voltar absoluto
    },
    title: {
        fontFamily: Fonts.bold,
        fontSize: FontSizes.large,
        color: Colors.dark,
    },
    titleCenter: {
        textAlign: 'center',
        flex: 1,
    },
    exportBtn: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: Colors.secondary + '12',
        paddingHorizontal: Spacing.md,
        paddingVertical: Spacing.xs,
        borderRadius: Radius.full,
        gap: 6,
        borderWidth: 1,
        borderColor: Colors.secondary + '20',
    },
    exportText: {
        color: Colors.secondary,
        fontFamily: Fonts.bold,
        fontSize: FontSizes.small,
    },
    headerContent: {
        paddingHorizontal: Spacing.lg,
        paddingBottom: Spacing.md,
    },
    searchContainer: {
        backgroundColor: Colors.background,
        borderRadius: Radius.full,
        flexDirection: "row",
        alignItems: "center",
        paddingHorizontal: Spacing.md,
        height: 44,
        borderWidth: 1.5,
        borderColor: 'transparent',
    },
    searchContainerFocused: {
        borderColor: Colors.primary,
        backgroundColor: Colors.light,
    },
    searchInput: {
        flex: 1,
        fontFamily: Fonts.regular,
        fontSize: FontSizes.small + 2,
        color: Colors.dark,
        marginLeft: Spacing.sm,
        height: "100%",
    } as TextStyle,
});