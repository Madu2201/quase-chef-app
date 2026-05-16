import { Platform, StyleSheet, TextStyle } from "react-native";
import {
    Colors,
    Fonts,
    FontSizes,
    Radius,
    Shadows,
    Spacing,
} from "../constants/theme";
import {
    GLOBAL_ACTION_BUTTONS,
    GLOBAL_EDIT_STYLES,
    ITEM_LIST_ACTIONS,
    ITEM_LIST_BUTTONS,
    ITEM_LIST_CARDS,
    ITEM_LIST_CHECKBOX,
    ITEM_LIST_CONTAINERS,
    ITEM_LIST_FLEX,
    ITEM_LIST_INPUTS,
    ITEM_LIST_PICKERS,
} from "./global_styles";

// ESTILOS ESPECÍFICOS PARA: DESPENSA
export const despensaStyles = StyleSheet.create({
  ...ITEM_LIST_CONTAINERS,
  ...ITEM_LIST_CARDS,
  ...ITEM_LIST_INPUTS,
  ...ITEM_LIST_FLEX,
  ...ITEM_LIST_PICKERS,
  ...ITEM_LIST_BUTTONS,
  ...ITEM_LIST_CHECKBOX,
  ...ITEM_LIST_ACTIONS,
  ...GLOBAL_ACTION_BUTTONS,
  ...GLOBAL_EDIT_STYLES,
  scrollContent: {
    paddingHorizontal: Spacing.lg,
    paddingTop: Spacing.md,
    paddingBottom: Spacing.xl * 4,
  },

  // --- DROPDOWN DE UNIDADES (ADIÇÃO) ---
  ingredientItem: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: Colors.light,
    padding: Spacing.md,
    borderRadius: Radius.lg,
    marginBottom: Spacing.sm,
    ...Shadows.xs,
  },

  ingredientInfo: {
    flex: 1,
    marginLeft: Spacing.md,
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
    gap: 8,
  },
  emptyText: {
    textAlign: "center",
    color: Colors.subtext,
    marginTop: Spacing.md,
    fontFamily: Fonts.regular,
  },

  activityIndicatorContainer: {
    marginTop: Spacing.lg,
  },

  // --- BOTÃO FLUTUANTE ---
  floatingBtn: {
    ...GLOBAL_ACTION_BUTTONS.btn,
    position: "absolute",
    left: Spacing.lg,
    right: Spacing.lg,
    height: 55,
    paddingHorizontal: Spacing.lg,
    justifyContent: "space-between",
    ...Shadows.lg,
    ...Platform.select({
      ios: { bottom: 40 },
      default: { bottom: 20 },
    }),
  },
  floatingBtnText: {
    ...GLOBAL_ACTION_BUTTONS.btnText,
    fontSize: FontSizes.small + 1,
  },
  badgeContainer: {
    backgroundColor: Colors.light + "99",
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
    borderRadius: Radius.full,
    minWidth: 32,
    alignItems: "center",
    justifyContent: "center",
  },
  badgeText: {
    color: Colors.light,
    fontSize: FontSizes.small - 1,
    fontFamily: Fonts.bold,
  },
  inlineInput: {
    minWidth: 45,
    height: 30,
    backgroundColor: Colors.light,
    borderRadius: Radius.full,
    borderWidth: 1.5,
    borderColor: Colors.secondary,
    textAlign: "center",
    fontFamily: Fonts.bold,
    fontSize: FontSizes.small,
    color: Colors.dark,
    paddingHorizontal: Spacing.sm,
    ...Platform.select({
      web: { outlineStyle: "none" } as any,
      default: {},
    }),
  } as TextStyle,

  // === PAINEL DE ADIÇÃO INTELIGENTE ===
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

  addPanelFieldHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 4,
    gap: Spacing.xs,
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

  // === CARD DE INGREDIENTE ===
  ingredientCard: {
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

  ingredientCardEmpty: {
    opacity: 0.6,
  },

  // === MODO VISUALIZAÇÃO (DASHBOARD) ===
  viewContainer: {
    marginTop: 0,
  },

  viewHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: Spacing.lg,
  },

  viewNameSection: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },

  viewNameText: {
    fontSize: 16,
    fontWeight: "bold",
    color: Colors.dark,
    flex: 1,
  },

  viewNameTextDisabled: {
    color: Colors.subtext + 5,
    opacity: 0.45,
  },

  viewActions: {
    flexDirection: "row",
    alignItems: "center",
    gap: 16,
  },

  viewStatsRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 6,
  },

  viewStatsLeft: {
    fontSize: 13,
    color: Colors.dark,
    fontWeight: "600",
  },

  viewStatsRight: {
    fontSize: 12,
    color: Colors.subtext,
  },

  progressBarContainer: {
    height: 8,
    backgroundColor: Colors.background,
    borderRadius: Radius.sm,
    overflow: "hidden",
  },

  progressBar: {
    height: "100%",
    borderRadius: Radius.sm,
  },

  // === ESTADOS DE INTERFACE ===
  checkboxDisabled: {
    opacity: 0.5,
    borderColor: Colors.subtext,
  },
  
  checkboxMargin: {
    marginRight: 12,
  },

  // === CORES PARA BARRA DE PROGRESSO ===
  progressBarGreen: {
    backgroundColor: "#38A169",
  },

  progressBarOrange: {
    backgroundColor: "#ffba0a",
  },

  progressBarRed: {
    backgroundColor: "#C53030",
  },
});
