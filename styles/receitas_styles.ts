import { StyleSheet } from "react-native";
import { Colors, Fonts, FontSizes, Spacing, Radius, Shadows } from "../constants/theme";

export const receitasStyles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },

  // --- ESTOQUE (ESTILO FAVORITOS NO HEADER) ---
  stockToggle: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.background,
    borderRadius: Radius.full,
    paddingHorizontal: Spacing.md,
    height: 38,
    borderWidth: 1,
    borderColor: Colors.subtext + '20',
  },
  stockText: {
    flex: 1,
    fontFamily: Fonts.regular,
    fontSize: FontSizes.small - 1,
    color: Colors.primary,
    marginLeft: Spacing.sm,
  },
  switchStyle: {
    transform: [{ scaleX: 0.8 }, { scaleY: 0.8 }],
  },

  // --- FILTROS (CHIPS HORIZONTAIS COM VISUAL DE FAVORITOS) ---
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
  },
  chip: {
    flexDirection: 'row',
    alignItems: 'center',
    height: 36,
    paddingHorizontal: Spacing.md,
    borderRadius: Radius.full,
    backgroundColor: Colors.light,
    borderWidth: 1.5,
    borderColor: Colors.primary,
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

  // --- CONTADOR DE RECEITAS (IGUAL FAVORITOS) ---
  infoBar: {
    paddingHorizontal: Spacing.lg,
    marginTop: Spacing.sm,
    marginBottom: Spacing.sm,
  },
  infoText: {
    fontFamily: Fonts.bold,
    fontSize: FontSizes.small,
    color: Colors.brown,
  },

  // --- CORPO DO CARD (RECEITAS) ---
  listContent: {
    paddingBottom: Spacing.xl,
  },
  card: {
    backgroundColor: Colors.light,
    borderRadius: Radius.xl,
    marginHorizontal: Spacing.lg,
    marginBottom: Spacing.md,
    overflow: 'hidden',
    ...Shadows.sm,
  },
  cardImageContainer: {
    width: '100%',
    height: 140,
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
    marginBottom: Spacing.xs,
  },
  recipeTitle: {
    fontFamily: Fonts.bold,
    fontSize: FontSizes.medium,
    color: Colors.dark,
  },
  heartButton: {
    padding: 2,
  },
  metaRow: {
    flexDirection: 'row',
    gap: Spacing.md,
    marginBottom: Spacing.sm,
  },
  metaItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.xs,
  },
  metaText: {
    fontFamily: Fonts.regular,
    fontSize: FontSizes.small - 1,
    color: Colors.primary,
  },
  recipeDescription: {
    fontFamily: Fonts.regular,
    fontSize: FontSizes.small,
    color: Colors.subtitle,
    marginBottom: Spacing.md,
    lineHeight: 18,
  },
  highlightText: {
    fontFamily: Fonts.bold,
    color: Colors.secondary,
  },
  viewButton: {
    backgroundColor: Colors.primary,
    height: 40,
    borderRadius: Radius.lg,
    justifyContent: 'center',
    alignItems: 'center',
  },
  viewButtonText: {
    fontFamily: Fonts.bold,
    fontSize: FontSizes.medium - 2,
    color: Colors.light,
  },
});