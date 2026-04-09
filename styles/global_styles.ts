import { Platform, StyleSheet, TextStyle } from "react-native";
import {
  Colors,
  Fonts,
  FontSizes,
  Radius,
  Shadows,
  Spacing,
} from "../constants/theme";

// CONTAINERS E LAYOUTS BÁSICOS
export const ITEM_LIST_CONTAINERS = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
});

// CARDS E SEÇÕES - DISPENSA, LISTA
export const ITEM_LIST_CARDS = StyleSheet.create({
  addCard: {
    backgroundColor: Colors.light,
    borderRadius: Radius.lg,
    padding: Spacing.md,
    marginBottom: Spacing.lg,
    ...Shadows.sm,
    borderWidth: 1,
    borderColor: Colors.subtext + "15",
  },
  sectionLabel: {
    fontFamily: Fonts.bold,
    fontSize: FontSizes.small,
    color: Colors.dark,
    marginBottom: Spacing.sm,
  },
  // Cabeçalho com título e badge/contador
  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: Spacing.md,
  },
  sectionTitle: {
    fontFamily: Fonts.bold,
    fontSize: FontSizes.medium,
    color: Colors.dark,
  },
  // Badge redondo para contadores (ex: "5 itens")
  badgeCount: {
    backgroundColor: Colors.primary + "15",
    paddingHorizontal: Spacing.sm,
    paddingVertical: Spacing.xs,
    borderRadius: Radius.full,
  },
  badgeText: {
    fontFamily: Fonts.bold,
    fontSize: FontSizes.small - 2,
    color: Colors.primary,
  },
});

// INPUTS E CAMPOS DE TEXTO - DISPENSA, LISTA
export const ITEM_LIST_INPUTS = StyleSheet.create({
  inputBase: {
    backgroundColor: Colors.background,
    borderRadius: Radius.md,
    height: 38,
    paddingHorizontal: Spacing.md,
    fontFamily: Fonts.regular,
    fontSize: FontSizes.small,
    color: Colors.dark,
    borderWidth: 1.5,
    borderColor: Colors.subtext + "20",
    ...Platform.select({
      web: { outlineStyle: "none" } as any,
      default: {},
    }),
  } as TextStyle,
  inputFocused: {
    borderColor: Colors.secondary,
    backgroundColor: Colors.light,
  },
  inputFull: {
    marginBottom: Spacing.xs,
  },
});

// LAYOUTS FLEX - DISPENSA, LISTA
export const ITEM_LIST_FLEX = StyleSheet.create({
  row: {
    flexDirection: "row",
    gap: Spacing.sm,
    alignItems: "center",
  },
  inputField: {
    flex: 1.5,
  },
});

// PICKERS E SELETORES DE UNIDADES - DISPENSA, LISTA
export const ITEM_LIST_PICKERS = StyleSheet.create({
  pickerMock: {
    backgroundColor: Colors.background,
    borderRadius: Radius.md,
    height: 38,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: Spacing.md,
    flex: 1,
    borderWidth: 1.5,
    borderColor: Colors.subtext + "20",
  },
  pickerText: {
    fontFamily: Fonts.regular,
    fontSize: FontSizes.small,
    color: Colors.dark,
  },
  // Dropdown com unidades (kg, l, ml, etc)
  unitPickerDropdown: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
    marginTop: Spacing.xs,
    padding: Spacing.xs,
    backgroundColor: Colors.background,
    borderRadius: Radius.md,
    borderWidth: 1,
    borderColor: Colors.subtext + "20",
  },
  unitBadge: {
    paddingHorizontal: Spacing.sm,
    paddingVertical: Spacing.xs,
    borderRadius: Radius.md,
    backgroundColor: Colors.light,
    borderWidth: 1,
    borderColor: Colors.subtext + "30",
  },
  unitBadgeActive: {
    backgroundColor: Colors.secondary,
    borderColor: Colors.secondary,
  },
  unitBadgeText: {
    color: Colors.dark + "90",
    fontWeight: "500",
    fontSize: FontSizes.small,
  },
  unitBadgeTextActive: {
    color: Colors.light,
  },
  // Painel inline de unidades dentro dos cards
  inlineUnitPanel: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: Spacing.xs,
    marginTop: Spacing.sm,
    padding: Spacing.sm,
    backgroundColor: Colors.light,
    borderRadius: Radius.md,
    borderWidth: 1,
    borderColor: Colors.subtext + "15",
  },
  inlineUnitChip: {
    paddingHorizontal: Spacing.sm,
    paddingVertical: 6,
    borderRadius: Radius.sm,
    backgroundColor: Colors.background,
    borderWidth: 1,
    borderColor: Colors.subtext + "20",
  },
  inlineUnitChipActive: {
    backgroundColor: Colors.secondary,
    borderColor: Colors.secondary,
  },
  inlineUnitText: {
    fontFamily: Fonts.regular,
    fontSize: FontSizes.small - 2,
    color: Colors.dark,
  },
  inlineUnitTextActive: {
    color: Colors.light,
    fontFamily: Fonts.bold,
  },
});

// BOTÕES AÇÃO E INTERAÇÃO - DISPENSA, LISTA
export const ITEM_LIST_BUTTONS = StyleSheet.create({
  btnAdd: {
    backgroundColor: Colors.secondary,
    width: 38,
    height: 38,
    borderRadius: Radius.md,
    justifyContent: "center",
    alignItems: "center",
    ...Shadows.sm,
  },
});

// CHECKBOX - LISTA
export const ITEM_LIST_CHECKBOX = StyleSheet.create({
  checkbox: {
    width: 22,
    height: 22,
    borderRadius: Radius.md,
    borderWidth: 2,
    borderColor: Colors.secondary,
    justifyContent: "center",
    alignItems: "center",
  },
  checkboxActive: {
    backgroundColor: Colors.secondary,
    borderColor: Colors.secondary,
  },
});

// AÇÕES - DELETAR/REMOVER - DISPENSA, LISTA
export const ITEM_LIST_ACTIONS = StyleSheet.create({
  btnDelete: {
    padding: Spacing.xs,
    marginLeft: Spacing.xs,
  },
  deleteButton: {
    padding: Spacing.xs,
    justifyContent: "center",
    alignItems: "center",
  },
});

// CHIPS/FILTROS - RECEITAS, FAVORITOS
export const GLOBAL_CHIPS_FILTERS = StyleSheet.create({
  chip: {
    flexDirection: "row",
    alignItems: "center",
    height: 36,
    paddingHorizontal: Spacing.md,
    borderRadius: Radius.full,
    backgroundColor: Colors.light,
    borderWidth: 1.5,
    borderColor: Colors.primary + "30",
    gap: 6,
    ...Shadows.sm,
  },
  chipActive: {
    backgroundColor: Colors.secondary,
    borderColor: Colors.secondary,
  },
  chipText: {
    fontFamily: Fonts.bold,
    color: Colors.primary,
  },
  chipTextActive: {
    color: Colors.light,
  },
  chipSelected: {
    backgroundColor: Colors.secondary,
    borderColor: Colors.secondary,
  },
  chipTextSelected: {
    color: Colors.light,
    fontFamily: Fonts.bold,
  },
});

// LAYOUT FILTROS - RECEITAS, FAVORITOS

// Container dos filtros, scroll de chips, barra de info/contador
export const FILTERS_LAYOUT = StyleSheet.create({
  filtersContainer: {
    backgroundColor: Colors.background,
    paddingTop: Spacing.md,
  },
  chipsScroll: {
    marginBottom: Spacing.sm,
  },
  chipsScrollContent: {
    paddingHorizontal: Spacing.lg,
    gap: Spacing.sm,
  },
  infoBar: {
    paddingHorizontal: Spacing.lg,
    marginVertical: Spacing.sm,
  },
  infoText: {
    fontFamily: Fonts.bold,
    fontSize: FontSizes.small,
    color: Colors.brown,
  },
});

// AUTH INPUTS - LOGIN, CADASTRO, ESQUECI SENHA
export const AUTH_INPUTS = StyleSheet.create({
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1.5,
    borderColor: Colors.subtext + "80",
    borderRadius: Radius.lg,
    backgroundColor: Colors.light,
    paddingHorizontal: Spacing.md,
    marginBottom: Spacing.xs,
    height: 48,
    ...Shadows.sm,
  },
  inputContainerFocused: {
    borderColor: Colors.primary,
    backgroundColor: Colors.light,
  },
  inputContainerError: {
    borderColor: Colors.errorDark,
    backgroundColor: Colors.errorLight,
  },
  input: {
    flex: 1,
    fontFamily: Fonts.regular,
    fontSize: FontSizes.small,
    color: Colors.dark,
    marginLeft: Spacing.xs,
    height: "100%",
    ...Platform.select({
      web: { outlineStyle: "none" } as any,
      default: {},
    }),
  } as TextStyle,
  fieldErrorText: {
    color: Colors.errorDark,
    fontSize: FontSizes.small - 2,
    marginTop: Spacing.xs - 2,
    marginLeft: Spacing.xs,
    marginBottom: Spacing.sm,
  },
});

// AUTH TEXTAREA - CADASTRO, PERFIL
export const AUTH_TEXTAREA = StyleSheet.create({
  textAreaContainer: {
    minHeight: 110,
    height: "auto",
    alignItems: "flex-start",
    paddingTop: Spacing.md,
    paddingBottom: Spacing.md,
  },
  textArea: {
    width: "100%",
    minHeight: 80,
    fontFamily: Fonts.regular,
    fontSize: FontSizes.small,
    color: Colors.dark,
    textAlignVertical: "top",
    ...Platform.select({
      web: { outlineStyle: "none" } as any,
      default: {},
    }),
  } as TextStyle,
  textAreaHelper: {
    fontFamily: Fonts.regular,
    fontSize: FontSizes.small - 1,
    color: Colors.subtext,
    marginBottom: Spacing.xs,
    marginLeft: Spacing.xs,
  },
});

// PERFIL INPUTS - PERFIL
export const PERFIL_INPUTS = StyleSheet.create({
  inputLabel: {
    fontSize: FontSizes.small,
    color: Colors.subtitle,
    marginBottom: Spacing.xs,
    fontFamily: Fonts.medium,
  },
  inputRow: {
    flexDirection: "row",
    alignItems: "center",
    borderBottomWidth: 1,
    borderBottomColor: Colors.subtext + "30",
    paddingBottom: Spacing.sm,
  },
  textInput: {
    flex: 1,
    fontSize: FontSizes.small,
    color: Colors.primary,
    fontFamily: Fonts.regular,
  },
});

// ACTION BUTTONS - HOME, DISPENSA, LISTA, SELECAO_IA
export const GLOBAL_ACTION_BUTTONS = StyleSheet.create({
  btn: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    borderRadius: Radius.full,
    backgroundColor: Colors.primary,
  },
  btnText: {
    fontFamily: Fonts.bold,
    color: Colors.light,
  },
});