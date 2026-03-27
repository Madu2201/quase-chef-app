import { StyleSheet } from "react-native";
import { Colors, Fonts, FontSizes, Spacing, Radius, Shadows } from "../constants/theme";

export const receitasStyles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },

  heartButton: {
    padding: Spacing.xs,
    justifyContent: 'center',
    alignItems: 'center',
  },

  /* --- SEÇÃO DE ESTOQUE NO HEADER --- */
  stockToggle: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.background,
    borderRadius: Radius.full,
    paddingHorizontal: Spacing.md,
    height: 42,
    borderWidth: 1,
    borderColor: Colors.subtext + '20',
    marginTop: Spacing.xs,
  },
  stockText: {
    flex: 1,
    fontFamily: Fonts.medium,
    fontSize: FontSizes.small - 1,
    color: Colors.primary,
    marginLeft: Spacing.sm,
  },
  switchStyle: {
    transform: [{ scaleX: 0.75 }, { scaleY: 0.75 }],
  },

  /* --- FILTROS (CHIPS) --- */
  filtersContainer: {
    paddingTop: Spacing.md,
    width: '100%',
  },
  chipsScroll: {
    marginBottom: Spacing.sm,
  },
  chipsScrollContent: {
    paddingHorizontal: Spacing.lg,
    gap: Spacing.sm,
    flexDirection: 'row',
    paddingBottom: Spacing.xs,
  },
  chip: {
    flexDirection: 'row',
    alignItems: 'center',
    height: 36,
    paddingHorizontal: Spacing.md,
    borderRadius: Radius.full,
    backgroundColor: Colors.light,
    borderWidth: 1.5,
    borderColor: Colors.primary + '30', // Borda sutil quando inativo
    gap: 6,
  },
  chipActive: {
    backgroundColor: Colors.secondary,
    borderColor: Colors.secondary,
  },
  chipText: {
    fontFamily: Fonts.bold,
    fontSize: FontSizes.small - 1,
    color: Colors.primary,
  },
  chipTextActive: {
    color: Colors.light,
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
    color: Colors.subtitle,
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
    ...Shadows.md, // Sombra um pouco mais profunda para destaque
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

  /* --- DESCRIÇÃO E HIGHLIGHT --- */
  recipeDescription: {
    fontFamily: Fonts.regular,
    fontSize: FontSizes.small,
    color: Colors.subtitle,
    marginBottom: Spacing.lg,
    lineHeight: 20,
  },
  highlightText: {
    fontFamily: Fonts.bold,
    color: Colors.secondary,
  },

  /* --- BOTÃO DE AÇÃO --- */
  viewButton: {
    backgroundColor: Colors.primary,
    height: 48,
    borderRadius: Radius.lg,
    justifyContent: 'center',
    alignItems: 'center',
    ...Shadows.sm,
  },
  viewButtonText: {
    fontFamily: Fonts.bold,
    fontSize: FontSizes.medium - 1,
    color: Colors.light,
  },
});