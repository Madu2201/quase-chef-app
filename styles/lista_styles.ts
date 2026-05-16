import { StyleSheet } from "react-native";
import { Colors, Fonts, FontSizes, Radius, Shadows, Spacing } from "../constants/theme";
import { GLOBAL_EDIT_STYLES, ITEM_LIST_ACTIONS, ITEM_LIST_BUTTONS, ITEM_LIST_CARDS, ITEM_LIST_CHECKBOX, ITEM_LIST_CONTAINERS, ITEM_LIST_FLEX, ITEM_LIST_INPUTS, ITEM_LIST_PICKERS } from "./global_styles";

// ESTILOS ESPECÍFICOS PARA: LISTA DE COMPRAS
export const listaStyles = StyleSheet.create({
    ...ITEM_LIST_CONTAINERS,
    ...ITEM_LIST_CARDS,
    ...ITEM_LIST_INPUTS,
    ...ITEM_LIST_FLEX,
    ...ITEM_LIST_PICKERS,
    ...ITEM_LIST_BUTTONS,
    ...ITEM_LIST_CHECKBOX,
    ...ITEM_LIST_ACTIONS,
    ...GLOBAL_EDIT_STYLES,
    scrollContent: {
        paddingHorizontal: Spacing.lg,
        paddingTop: Spacing.md,
        paddingBottom: Spacing.xl * 2,
    },

    // --- AÇÕES EM MASSA ---
    btnActionBulk: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: Colors.light,
        borderWidth: 1,
        borderColor: Colors.secondary + '40',
        height: 40,
        borderRadius: Radius.md,
        gap: 8,
        marginBottom: Spacing.lg,
    },
    btnTextBulk: {
        fontFamily: Fonts.bold,
        fontSize: FontSizes.small,
        color: Colors.secondary,
    },

    // --- SEÇÕES ---
    sectionHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: Spacing.lg,
        marginTop: Spacing.lg,
    },
    sectionTitle: {
        fontFamily: Fonts.bold,
        fontSize: FontSizes.medium + 1,
        color: Colors.dark,
        letterSpacing: 0.3,
    },
    badgeCount: {
        backgroundColor: Colors.primary + '15',
        paddingHorizontal: Spacing.sm,
        paddingVertical: Spacing.xs,
        borderRadius: Radius.full,
    },
    badgeText: {
        fontFamily: Fonts.bold,
        fontSize: FontSizes.small - 2,
        color: Colors.primary,
    },

    // --- ITENS DA LISTA ---
    itemCard: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: Colors.light,
        padding: Spacing.lg,
        borderRadius: Radius.lg,
        marginBottom: Spacing.md,
        elevation: 2,
        shadowColor: "#000",
        shadowOpacity: 0.1,
        shadowRadius: 4,
        shadowOffset: { width: 0, height: 2 },
        borderWidth: 1,
        borderColor: Colors.subtext + '10',
    },


    // --- CARD REFORMATADO (ESTILO DASHBOARD) ---
    itemCardView: {
        backgroundColor: Colors.light,
        borderRadius: 12,
        padding: Spacing.lg,
        marginBottom: Spacing.md,
        elevation: 2,
        shadowColor: "#000",
        shadowOpacity: 0.1,
        shadowRadius: 4,
        shadowOffset: { width: 0, height: 2 },
    },

    itemViewHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: Spacing.md,
    },

    itemViewNameSection: {
        flexDirection: 'row',
        alignItems: 'center',
        flex: 1,
    },

    itemViewNameText: {
        fontFamily: Fonts.bold,
        fontSize: FontSizes.medium,
        color: Colors.dark,
        flex: 1,
    },

    itemViewActions: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 16,
    },

    itemViewStats: {
        fontFamily: Fonts.regular,
        fontSize: FontSizes.small,
        color: Colors.subtext,
    },

    // --- ESTADOS ESPECIAIS ---
    itemCardComprado: {
        opacity: 0.65,
    },
    
    nameComprado: {
        textDecorationLine: 'line-through',
        color: Colors.subtext,
    },
    
    clearText: {
        fontFamily: Fonts.bold,
        fontSize: FontSizes.small - 2,
        color: Colors.primary,
    },

    // --- MAGIC BUTTON ---
    magicButton: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: Colors.primary,
        paddingVertical: Spacing.md,
        paddingHorizontal: Spacing.lg,
        borderRadius: Radius.lg,
        gap: Spacing.sm,
        marginBottom: Spacing.xs,
        marginTop: Spacing.xs,
        elevation: 3,
        shadowColor: "#000",
        shadowOpacity: 0.15,
        shadowRadius: 6,
        shadowOffset: { width: 0, height: 3 },
    },
    magicButtonText: {
        fontFamily: Fonts.bold,
        fontSize: FontSizes.small + 1,
        color: Colors.light,
        letterSpacing: 0.3,
    },

    // --- SECTION TITLE OFF ---
    sectionTitleOff: {
        fontFamily: Fonts.bold,
        fontSize: FontSizes.medium + 1,
        color: Colors.subtext,
        letterSpacing: 0.3,
    },

    // --- GUARDAR NO ESTOQUE BUTTON ---
    btnGuardarEstoque: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: Colors.primary,
        height: 48,
        borderRadius: Radius.lg,
        gap: Spacing.sm,
        marginBottom: Spacing.lg,
        ...Shadows.sm,
    },
    btnGuardarEstoqueText: {
        fontFamily: Fonts.bold,
        fontSize: FontSizes.medium,
        color: Colors.light,
    },

    // --- UNDO TOAST ---
    undoToast: {
        position: 'absolute',
        bottom: Spacing.lg,
        left: Spacing.md,
        right: Spacing.md,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        backgroundColor: Colors.dark,
        paddingHorizontal: Spacing.md,
        paddingVertical: Spacing.sm,
        borderRadius: Radius.md,
        ...Shadows.lg,
    },
    undoText: {
        fontFamily: Fonts.regular,
        fontSize: FontSizes.small,
        color: Colors.light,
        flex: 1,
    },
    undoButton: {
        fontFamily: Fonts.bold,
        fontSize: FontSizes.small - 1,
        color: Colors.primary,
        marginLeft: Spacing.md,
    },

    // --- PAINEL DE ADIÇÃO INTELIGENTE (AddPanel Mode) ---
    addPanel: {
        backgroundColor: Colors.light,
        borderRadius: 16,
        padding: Spacing.lg,
        marginBottom: 24,
        elevation: 2,
        shadowColor: "#000",
        shadowOpacity: 0.1,
        shadowRadius: 4,
        shadowOffset: { width: 0, height: 2 },
    },

    addPanelTitle: {
        fontSize: 16,
        fontWeight: "bold",
        color: Colors.dark,
        marginBottom: Spacing.md,
    },

    addPanelRow: {
        flexDirection: "row",
        gap: Spacing.sm,
        marginBottom: Spacing.md,
    },

    addPanelNameInput: {
        flex: 1,
        backgroundColor: Colors.background,
        borderRadius: Radius.md,
        paddingHorizontal: Spacing.md,
        height: 39,
        color: Colors.dark,
    },

    addPanelUnitButton: {
        backgroundColor: Colors.background,
        borderRadius: Radius.md,
        paddingHorizontal: Spacing.md,
        height: 39,
        justifyContent: "center",
        alignItems: "center",
        flexDirection: "row",
    },

    addPanelUnitText: {
        color: Colors.dark,
        marginRight: Spacing.xs,
    },

    unitPickerContainer: {
        flexDirection: "row",
        flexWrap: "wrap",
        gap: 6,
        marginBottom: Spacing.md,
    },

    unitChip: {
        backgroundColor: Colors.background,
        paddingVertical: 6,
        paddingHorizontal: Spacing.md,
        borderRadius: 12,
    },

    unitChipActive: {
        backgroundColor: Colors.secondary,
    },

    unitChipText: {
        color: Colors.dark,
        fontSize: FontSizes.small,
    },

    unitChipTextActive: {
        color: Colors.light,
    },

    addPanelFieldsRow: {
        flexDirection: "row",
        gap: Spacing.sm,
        alignItems: "center",
    },

    addPanelField: {
        flex: 1,
    },

    addPanelFieldLabel: {
        fontSize: 11,
        color: Colors.subtext,
        marginBottom: 4,
        fontWeight: "bold",
    },

    addPanelFieldInput: {
        backgroundColor: Colors.background,
        borderRadius: Radius.md,
        paddingHorizontal: Spacing.md,
        height: 39,
        color: Colors.dark,
    },

    addPanelButton: {
        backgroundColor: Colors.secondary,
        height: 39,
        width: 39,
        borderRadius: Radius.md,
        justifyContent: "center",
        alignItems: "center",
        marginTop: 25,
    },

    // --- CONTAINER PRINCIPAL ---
    containerFlex: {
        flex: 1,
        backgroundColor: Colors.background,
    },

    // --- HEADER ACTIONS ---
    headerRightContainer: {
        flexDirection: 'row',
        gap: 15,
    },

    // --- HISTÓRICO ---
    historicoCompradoContainer: {
        marginTop: Spacing.xl,
    },

    // --- ACTIVITY INDICATOR ---
    activityIndicatorContainer: {
        marginTop: Spacing.lg,
    },

    // --- ITEM NAME STRIKETHROUGH ---
    itemNameStrikethrough: {
        textDecorationLine: 'line-through',
        color: Colors.subtext,
    },

    // === ESTADOS DE INTERFACE ===
    checkboxDisabled: {
        opacity: 0.5,
        borderColor: Colors.subtext,
    },
    
    checkboxMargin: {
        marginRight: 12,
    },

    
    magicButtonDisabled: {
        opacity: 0.5,
    },
    emptyText: {
        textAlign: "center",
        color: Colors.subtext,
        marginTop: Spacing.md,
        fontFamily: Fonts.regular,
    },
});