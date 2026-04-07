import { StyleSheet } from "react-native";
import { Colors, Fonts, FontSizes, Spacing, Radius, Shadows } from "../constants/theme";
import {
  GLOBAL_CHIPS_FILTERS,
  ITEM_LIST_CONTAINERS,
  GLOBAL_ACTION_BUTTONS
} from "./global_styles";

// Importando o Toggle do arquivo de Header
import { HEADER_STOCK_TOGGLE } from "./header.styles";

export const receitasStyles = StyleSheet.create({
  // Herda o container básico
  ...ITEM_LIST_CONTAINERS,

  // Herda os filtros (Chips)
  ...GLOBAL_CHIPS_FILTERS,

  // Herda o Stock Toggle do Header (stockToggle, stockText, switchStyle)
  ...HEADER_STOCK_TOGGLE,

  /* --- FILTROS CONTAINER --- */
  filtersContainer: {
    backgroundColor: Colors.background,
    paddingVertical: Spacing.sm,
  },
  chipsScroll: {
    paddingLeft: Spacing.lg,
    marginBottom: Spacing.sm,
  },
  chipsScrollContent: {
    paddingRight: Spacing.xl,
    gap: Spacing.sm,
  },

  /* --- BOTÃO FAVORITO --- */
  heartButton: {
    padding: Spacing.xs,
    justifyContent: 'center',
    alignItems: 'center',
  },

  /* --- BARRA DE INFORMAÇÕES (CONTADOR) --- */
  infoBar: {
    paddingHorizontal: Spacing.lg,
    marginTop: Spacing.xs,
    marginBottom: Spacing.md,
  },
  infoText: {
    fontFamily: Fonts.bold,
    fontSize: FontSizes.small,
    color: Colors.brown,
    opacity: 0.8,
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
});