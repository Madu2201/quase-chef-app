import { StyleSheet, Dimensions, Platform } from "react-native";
import { Colors, Fonts, FontSizes, Spacing, Radius, Shadows } from "../constants/theme";

const { width } = Dimensions.get('window');

export const detalheReceitaStyles = StyleSheet.create({
  /* --- ESTRUTURA PRINCIPAL --- */
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  mainContentWrapper: {
    flex: 1,
    position: 'relative',
  },
  scrollContent: {
    paddingBottom: Spacing.lg,
  },

  /* --- HEADER E BADGE --- */
  imageHeader: {
    width: '100%',
    height: width * 0.7,
  },
  image: {
    width: '100%',
    height: '100%'
  },
  badgePopular: {
    position: 'absolute',
    bottom: Spacing.lg,
    left: Spacing.lg,
    backgroundColor: Colors.secondary,
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.xs +2,
    borderRadius: Radius.full,
    ...Shadows.sm,
  },
  badgeText: {
    color: Colors.light,
    fontFamily: Fonts.bold,
    fontSize: FontSizes.small - 1,
    textTransform: 'uppercase',
  },

  /* --- CARD DE CONTEÚDO --- */
  contentCard: {
    flex: 1,
    backgroundColor: Colors.background,
    marginTop: -Radius.xl,
    borderTopLeftRadius: Radius.xl,
    borderTopRightRadius: Radius.xl,
    paddingHorizontal: Spacing.md,
    paddingTop: Spacing.lg,
  },
  title: {
    fontFamily: Fonts.bold,
    fontSize: FontSizes.large + 2,
    color: Colors.dark,
    marginBottom: Spacing.xs,
  },
  description: {
    fontFamily: Fonts.regular,
    fontSize: FontSizes.small,
    color: Colors.subtitle,
    lineHeight: 20,
    marginBottom: Spacing.lg,
  },

  /* --- SEÇÃO DE INFO (ESTILO PILL) --- */
  infoContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: Spacing.xl,
    gap: Spacing.sm,
  },
  infoCard: {
    flex: 1,
    flexDirection: 'row',
    backgroundColor: Colors.secondary + '15',
    paddingVertical: Spacing.sm,
    borderRadius: Radius.xl,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: Colors.secondary,
  },
  infoIconContainer: {
    paddingHorizontal: Spacing.xs,
  },
  infoLabel: {
    fontFamily: Fonts.bold,
    fontSize: FontSizes.small - 1,
    color: Colors.primary,
    textTransform: 'uppercase',
  },
  infoValue: {
    fontFamily: Fonts.bold,
    fontSize: FontSizes.small,
    color: Colors.dark,
  },

  /* --- INGREDIENTES --- */
  sectionTitleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Spacing.md,
  },
  sectionTitle: {
    fontFamily: Fonts.bold,
    fontSize: FontSizes.medium,
    color: Colors.dark,
  },
  itemsCount: {
    backgroundColor: Colors.secondary + '20',
    paddingHorizontal: Spacing.sm,
    borderRadius: Radius.sm,
    color: Colors.secondary,
    fontFamily: Fonts.bold,
    fontSize: FontSizes.small - 1,
  },
  ingredientItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.light,
    padding: Spacing.md,
    borderRadius: Radius.md,
    marginBottom: Spacing.sm,
    ...Shadows.sm,
  },
  ingredientMissing: {
    backgroundColor: Colors.errorLight + '90',
    borderColor: Colors.errorDark,
    borderWidth: 1,
  },
  ingredientText: {
    flex: 1,
    marginLeft: Spacing.sm,
    fontFamily: Fonts.medium,
    fontSize: FontSizes.small,
    color: Colors.dark,
  },

  /* --- MODO DE PREPARO (ALINHADO AO TOPO) --- */
  preparoTitle: {
    fontFamily: Fonts.bold,
    fontSize: FontSizes.medium,
    color: Colors.dark,
    marginTop: Spacing.lg,
    marginBottom: Spacing.md,
  },
  stepItem: {
    flexDirection: 'row',
    marginBottom: Spacing.md,
    gap: Spacing.md,
    alignItems: 'flex-start',
  },
  stepNumber: {
    width: 26,
    height: 26,
    borderRadius: Radius.full,
    backgroundColor: Colors.secondary,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 2,
  },
  stepNumberText: {
    color: Colors.light,
    fontFamily: Fonts.bold,
    fontSize: FontSizes.small - 1,
  },
  stepText: {
    flex: 1,
    fontFamily: Fonts.regular,
    fontSize: FontSizes.small,
    color: Colors.subtitle,
    lineHeight: 22,
  },

  /* --- FADE E FOOTER --- */
  fadeGradient: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 55,
    zIndex: 1,
  },
  footer: {
    flexDirection: 'row',
    paddingHorizontal: Spacing.lg,
    paddingTop: Spacing.md,
    paddingBottom: Spacing.md,
    backgroundColor: Colors.light,
    borderTopWidth: 1,
    borderTopColor: Colors.subtext + '10',
    gap: Spacing.md,
    zIndex: 2,
  },
  favButton: {
    width: 56,
    height: 56,
    borderRadius: Radius.full,
    borderColor: Colors.secondary,
    borderWidth: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: Colors.secondary + '1A',
    ...Shadows.sm,
  },
  mainButton: {
    flex: 1,
    height: 56,
    backgroundColor: Colors.primary,
    borderRadius: Radius.full,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: Spacing.sm,
    ...Shadows.md,
  },
  mainButtonText: {
    color: Colors.light,
    fontFamily: Fonts.bold,
    fontSize: FontSizes.medium - 2,
  },
});