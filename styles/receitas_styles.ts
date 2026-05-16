import { StyleSheet } from "react-native";
import { Colors, Fonts, FontSizes, Radius, Shadows, Spacing } from "../constants/theme";
import {
    FILTERS_LAYOUT,
    GLOBAL_ACTION_BUTTONS,
    GLOBAL_CHIPS_FILTERS,
    ITEM_LIST_CONTAINERS
} from "./global_styles";

// Importando o Toggle do arquivo de Header
import { HEADER_STOCK_TOGGLE } from "./header.styles";

export const receitasStyles = StyleSheet.create({
  // Herda o container básico
  ...ITEM_LIST_CONTAINERS,

  // Herda os filtros (Chips)
  ...GLOBAL_CHIPS_FILTERS,

  // Herda layout dos filtros
  ...FILTERS_LAYOUT,

  // Herda o Stock Toggle do Header (stockToggle, stockText, switchStyle)
  ...HEADER_STOCK_TOGGLE,

  /* --- BOTÃO FAVORITO --- */
  heartButton: {
    padding: Spacing.xs,
    justifyContent: 'center',
    alignItems: 'center',
  },

  /* --- LISTA E CARDS --- */
  listContent: {
    paddingBottom: Spacing.xl * 2,
  },
  card: {
    backgroundColor: Colors.light,
    borderRadius: Radius.xl,
    marginHorizontal: Spacing.lg,
    marginBottom: Spacing.lg,
    overflow: 'hidden',
    ...Shadows.md,
  },
  cardImageContainer: {
    width: '100%',
    height: 160,
    backgroundColor: Colors.subtext + '10',
  },
  cardImage: {
    width: '100%',
    height: '100%',
  },
  cardBody: {
    padding: Spacing.md,
  },
  titleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: Spacing.xs,
  },
  recipeTitle: {
    flex: 1,
    fontFamily: Fonts.bold,
    fontSize: FontSizes.medium + 2,
    color: Colors.dark,
    marginRight: Spacing.sm,
  },

  /* --- META INFO (TEMPO/DIFICULDADE) --- */
  metaRow: {
    flexDirection: 'row',
    gap: Spacing.md,
    marginBottom: Spacing.md,
  },
  metaItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.xs,
  },
  metaText: {
    fontFamily: Fonts.medium,
    fontSize: FontSizes.small - 1,
    color: Colors.primary,
  },

  /* --- DESCRIÇÃO --- */
  recipeDescription: {
    fontFamily: Fonts.regular,
    fontSize: FontSizes.small,
    color: Colors.subtitle,
    marginBottom: Spacing.lg,
    lineHeight: 20,
  },

  /* --- BOTÃO DE AÇÃO --- */
  viewButton: {
    ...GLOBAL_ACTION_BUTTONS.btn,
    height: 48,
    borderRadius: Radius.lg,
    ...Shadows.sm,
  },
  viewButtonText: {
    ...GLOBAL_ACTION_BUTTONS.btnText,
    fontSize: FontSizes.medium - 1,
  },
  emptyCentered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyCenteredPadding: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  emptyIcon: {
    opacity: 0.5,
    marginBottom: 10,
  },
  emptyTextCenter: {
    textAlign: 'center',
    color: Colors.subtext,
    fontSize: 16,
  },
  emptySmallText: {
    marginTop: Spacing.sm,
    color: Colors.subtext,
  },
});