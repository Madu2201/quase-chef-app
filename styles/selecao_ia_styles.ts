import { Platform, StyleSheet } from 'react-native';
import { Colors, Fonts, FontSizes, Radius, Shadows, Spacing } from '../constants/theme';

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  scrollContent: {
    paddingTop: Spacing.md,
    paddingBottom: Spacing.xl * 3,
  },

  /* --- CABEÇALHO DE AÇÕES --- */
  actionRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: Spacing.lg,
    marginBottom: Spacing.md,
  },
  countText: {
    fontFamily: Fonts.bold,
    fontSize: FontSizes.small,
    color: Colors.brown,
  },
  clearButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingVertical: Spacing.xs,
    paddingHorizontal: Spacing.md,
    backgroundColor: Colors.primary + '10',
    borderRadius: Radius.md,
  },
  clearButtonText: {
    fontFamily: Fonts.bold,
    color: Colors.primary,
    fontSize: FontSizes.small,
  },

  /* --- BANNER PRINCIPAL (HERO) --- */
  heroCard: {
    backgroundColor: Colors.light,
    overflow: 'hidden',
    marginHorizontal: Spacing.sm,
    marginBottom: Spacing.lg,
    borderWidth: 1,
    borderColor: Colors.primary + '10',
    borderEndEndRadius: Radius.xl * 2,
    borderStartStartRadius: Radius.xl * 2,
    ...Shadows.sm,
  },
  heroTextArea: {
    padding: Spacing.md,
  },
  heroTag: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: Colors.background,
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.xs,
    borderRadius: Radius.full,
    alignSelf: 'flex-start',
    marginBottom: Spacing.sm
  },
  heroTagText: {
    fontSize: FontSizes.small - 1,
    fontFamily: Fonts.bold,
    color: Colors.primary
  },
  heroTitle: {
    fontSize: FontSizes.large,
    fontFamily: Fonts.bold,
    color: Colors.dark,
    marginBottom: Spacing.xs
  },
  heroSubtitle: {
    fontSize: FontSizes.small,
    fontFamily: Fonts.regular,
    color: Colors.subtitle
  },
  heroImage: {
    width: '100%',
    height: 120
  },

  /* --- TÍTULO DA SEÇÃO --- */
  sectionTitleContainer: {
    paddingHorizontal: Spacing.lg,
    marginBottom: Spacing.md,
    marginTop: Spacing.md,
  },
  sectionTitleText: {
    fontFamily: Fonts.bold,
    fontSize: FontSizes.medium,
    color: Colors.dark,
  },

  /* --- SEÇÕES E CATEGORIAS --- */
  categoryContainer: {
    paddingHorizontal: Spacing.lg,
    marginBottom: Spacing.xl
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginBottom: Spacing.sm
  },
  categoryTitle: {
    fontFamily: Fonts.bold,
    fontSize: FontSizes.small,
    color: Colors.dark,
    letterSpacing: 2
  },

  /* --- CHIPS DE INGREDIENTES --- */
  chipsWrapper: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8
  },
  chip: {
    backgroundColor: Colors.light,
    paddingVertical: Spacing.sm,
    paddingHorizontal: Spacing.md,
    borderRadius: Radius.full,
    borderWidth: 1.5,
    borderColor: Colors.primary,
    ...Shadows.sm,
  },
  chipSelected: {
    backgroundColor: Colors.secondary,
    borderColor: Colors.secondary,
  },
  chipText: {
    fontFamily: Fonts.medium,
    fontSize: FontSizes.small,
    color: Colors.primary
  },
  chipTextSelected: {
    color: Colors.light,
    fontFamily: Fonts.bold,
  },

  /* --- RODAPÉ FIXO --- */
  footer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    paddingHorizontal: Spacing.lg,
    paddingBottom: Platform.OS === 'ios' ? 40 : 20,
    paddingTop: Spacing.xs,
    backgroundColor: Colors.background,
  },
  generateButton: {
    backgroundColor: Colors.primary,
    height: 58,
    borderRadius: Radius.full,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 12,
    ...Shadows.md,
  },
  generateButtonText: {
    fontFamily: Fonts.bold,
    fontSize: 16,
    color: Colors.light
  },
  btnDisabled: {
    backgroundColor: Colors.subtitle,
    opacity: 0.5
  },
});