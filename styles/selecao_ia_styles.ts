import { Platform, StyleSheet } from "react-native";
import {
  Colors,
  Fonts,
  FontSizes,
  Radius,
  Shadows,
  Spacing,
} from "../constants/theme";
import { GLOBAL_ACTION_BUTTONS, GLOBAL_CHIPS_FILTERS } from "./global_styles";

export const styles = StyleSheet.create({
  ...GLOBAL_ACTION_BUTTONS,
  ...GLOBAL_CHIPS_FILTERS,
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  scrollContent: {
    paddingTop: Spacing.sm,
    paddingBottom: Spacing.xl * 4,
  },

  /* --- BANDEJA DE SELECIONADOS (TRAY) --- */
  trayWrapper: {
    paddingBottom: Spacing.md,
    marginBottom: Spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: Colors.primary + "15",
  },
  trayScrollContent: {
    paddingHorizontal: Spacing.lg,
    gap: 8,
  },
  trayItem: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: Colors.primary,
    paddingHorizontal: Spacing.md,
    paddingVertical: 8,
    borderRadius: Radius.full,
    gap: 6,
    ...Shadows.sm,
  },
  trayItemText: {
    fontFamily: Fonts.bold,
    color: Colors.light,
    fontSize: FontSizes.small,
  },

  /* --- BANNER PRINCIPAL (HERO) --- */
  heroCard: {
    backgroundColor: Colors.light,
    overflow: "hidden",
    marginHorizontal: Spacing.sm,
    marginBottom: Spacing.md,
    borderWidth: 1,
    borderColor: Colors.primary + "10",
    borderEndEndRadius: Radius.xl * 2,
    borderStartStartRadius: Radius.xl * 2,
    ...Shadows.sm,
  },
  heroTextArea: {
    padding: Spacing.md,
  },
  heroTag: {
    ...GLOBAL_CHIPS_FILTERS.chip,
    backgroundColor: Colors.background,
    alignSelf: "flex-start",
    marginBottom: Spacing.sm,
  },
  heroTagText: {
    fontSize: FontSizes.small - 1,
    fontFamily: Fonts.bold,
    color: Colors.primary,
  },
  heroTitle: {
    fontSize: FontSizes.large,
    fontFamily: Fonts.bold,
    color: Colors.dark,
    marginBottom: Spacing.xs,
  },
  heroSubtitle: {
    fontSize: FontSizes.small,
    fontFamily: Fonts.regular,
    color: Colors.subtitle,
  },
  heroImage: {
    width: "100%",
    height: 120,
  },

  /* --- TÍTULO DA SEÇÃO --- */
  sectionTitleContainer: {
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.sm - 8,
    marginBottom: Spacing.xs,
  },
  sectionTitleText: {
    fontFamily: Fonts.bold,
    fontSize: FontSizes.medium,
    color: Colors.dark,
  },

  /* --- LINHA DE AÇÃO (CONTADOR E LIMPAR) --- */
  actionRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.sm - 8,
    marginBottom: Spacing.sm,
  },
  countText: {
    fontFamily: Fonts.bold,
    fontSize: FontSizes.small,
    color: Colors.brown,
  },
  clearButton: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    paddingVertical: Spacing.xs,
    paddingHorizontal: Spacing.md,
    backgroundColor: Colors.primary + "10",
    borderRadius: Radius.md,
  },
  clearButtonText: {
    fontFamily: Fonts.bold,
    color: Colors.primary,
    fontSize: FontSizes.small,
  },

  /* --- SEÇÕES E CATEGORIAS (ACCORDION) --- */
  categoryContainer: {
    paddingHorizontal: Spacing.lg,
    marginBottom: Spacing.md,
  },
  sectionHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: Spacing.sm,
  },
  categoryHeaderContent: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    flex: 1,
  },

  /* --- CABEÇALHOS ALFABÉTICOS ESTILIZADOS --- */
  alphabetBadge: {
    width: 34,
    height: 34,
    borderRadius: Radius.md,
    backgroundColor: Colors.primary + "10",
    justifyContent: "center",
    alignItems: "center",
  },
  alphabetLetter: {
    fontFamily: Fonts.bold,
    fontSize: FontSizes.medium,
    color: Colors.brown,
  },
  quantityPill: {
    paddingHorizontal: Spacing.sm,
    paddingVertical: 2,
    borderRadius: Radius.full,
    backgroundColor: Colors.primary + "05",
    borderWidth: 1,
    borderColor: Colors.primary + "10",
  },
  quantityText: {
    fontFamily: Fonts.bold,
    fontSize: 10,
    color: Colors.brown,
    opacity: 0.7,
  },
  headerDivider: {
    flex: 0.9,
    height: 1.05,
    backgroundColor: Colors.brown + "20",
    marginLeft: Spacing.sm,
  },

  /* --- CHIPS DE INGREDIENTES --- */
  chipsWrapper: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
    marginTop: Spacing.xs,
    paddingBottom: Spacing.sm,
  },
  // O chip de ingrediente mantém seu estilo específico, mas o chip global está disponível via spread
  chipIngredient: {
    flexDirection: "row",
    alignItems: "center",
    minHeight: 36,
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
    borderRadius: Radius.full,
    backgroundColor: Colors.light,
    borderWidth: 1.5,
    borderColor: Colors.primary + "20",
    gap: 6,
    alignSelf: "flex-start",
  },
  chipIngredientActive: {
    backgroundColor: Colors.secondary,
    borderColor: Colors.secondary,
  },
  chipTextBlock: {
    flexShrink: 1,
  },
  chipText: {
    fontFamily: Fonts.bold,
    fontSize: FontSizes.small,
    color: Colors.primary,
  },
  chipTextActive: {
    color: Colors.light,
  },
  chipMeta: {
    fontFamily: Fonts.regular,
    fontSize: FontSizes.small - 2,
    color: Colors.subtitle,
    marginTop: 1,
  },
  chipMetaActive: {
    color: Colors.light + "CC",
  },

  /* --- ESTADOS VAZIOS --- */
  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: Spacing.xl,
    marginTop: Spacing.xl,
  },
  emptyText: {
    fontFamily: Fonts.regular,
    fontSize: FontSizes.medium,
    color: Colors.subtitle,
    textAlign: "center",
    lineHeight: 22,
  },

  /* --- RODAPÉ FIXO --- */
  footer: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    paddingHorizontal: Spacing.lg,
    paddingTop: Spacing.xs,
    backgroundColor: Colors.background,
    ...Platform.select({
      ios: { paddingBottom: 40 },
      default: { paddingBottom: 20 },
    }),
  },
  chevronIcon: {
    color: Colors.brown,
  },
});
