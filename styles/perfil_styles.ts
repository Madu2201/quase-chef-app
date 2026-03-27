import { StyleSheet } from 'react-native';
import { Colors, Fonts, Radius, Shadows, Spacing, FontSizes } from '../constants/theme';

export const perfilStyles = StyleSheet.create({
  // --- ESTRUTURA GERAL ---
  keyboardContainer: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  scrollContent: {
    paddingBottom: Spacing.xl,
  },

  // --- AVATAR ---
  avatarSection: {
    alignItems: 'center',
    marginVertical: Spacing.xl,
  },
  avatarCircle: {
    width: 110,
    height: 110,
    borderRadius: Radius.full,
    backgroundColor: Colors.light,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: Colors.light,
    position: 'relative',
    ...Shadows.sm,
  },
  avatarImage: {
    width: 110,
    height: 110,
    borderRadius: Radius.full,
  },
  cameraBadge: {
    position: 'absolute',
    bottom: 2,
    right: 2,
    backgroundColor: Colors.secondary,
    width: 32,
    height: 32,
    borderRadius: Radius.full,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 3,
    borderColor: Colors.background,
  },
  loadingOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.3)',
    borderRadius: Radius.full,
    justifyContent: 'center',
    alignItems: 'center',
  },
  userNameDisplay: {
    marginTop: Spacing.md,
    fontSize: FontSizes.large,
    fontFamily: Fonts.bold,
    color: Colors.primary,
  },
  memberSince: {
    fontSize: 10,
    fontFamily: Fonts.regular,
    color: Colors.subtitle,
    marginTop: Spacing.xs,
  },

  // --- CARDS E INPUTS ---
  sectionCard: {
    backgroundColor: Colors.light,
    marginHorizontal: Spacing.lg,
    marginVertical: Spacing.sm,
    padding: Spacing.lg,
    borderRadius: Radius.lg,
    ...Shadows.sm,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: Spacing.lg,
    gap: Spacing.sm,
  },
  sectionTitle: {
    fontSize: FontSizes.medium,
    fontFamily: Fonts.bold,
    color: Colors.primary,
  },
  inputBlock: {
    marginBottom: Spacing.md,
  },
  inputLabel: {
    fontSize: 12,
    color: Colors.subtitle,
    marginBottom: 6,
    fontFamily: Fonts.medium,
  },
  inputRow: {
    flexDirection: 'row',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: Colors.subtext + '30',
    paddingBottom: Spacing.sm,
  },
  textInput: {
    flex: 1,
    fontSize: FontSizes.small,
    color: Colors.primary,
    fontFamily: Fonts.regular,
  },

  // --- PREFERÊNCIAS (RESPONSIVO) ---
  prefRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: Spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: Colors.background,
    gap: Spacing.sm,
  },
  prefLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
    flex: 1, // Permite que o texto cresça e quebre
  },
  prefRight: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end',
    minWidth: 80, // Mantém o "Configurar" visível
  },
  prefText: {
    fontSize: FontSizes.small,
    color: Colors.primary,
    fontFamily: Fonts.medium,
    flexShrink: 1,
  },
  prefHintText: {
    color: Colors.subtext,
    fontSize: 12,
    marginRight: Spacing.xs,
    fontFamily: Fonts.regular,
  },

  // --- BOTÕES INFERIORES ---
  footerActions: {
    flexDirection: 'row',
    flexWrap: 'wrap', // Quebra linha se necessário
    marginTop: Spacing.xl,
    marginBottom: Spacing.xl * 2,
    paddingHorizontal: Spacing.lg,
    gap: Spacing.md,
    alignItems: 'center',
    justifyContent: 'center',
  },
  logoutButtonInline: {
    flex: 1,
    minWidth: 90,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: Spacing.md,
    borderRadius: Radius.lg,
    borderWidth: 1,
    borderColor: Colors.errorDark + '40',
    backgroundColor: Colors.errorLight,
    gap: Spacing.xs,
  },
  logoutTextInline: {
    color: Colors.errorDark,
    fontFamily: Fonts.bold,
    fontSize: FontSizes.small,
  },
  mainSaveButton: {
    flex: 2,
    minWidth: 140,
    backgroundColor: Colors.primary,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: Spacing.md,
    borderRadius: Radius.lg,
    gap: Spacing.sm,
    ...Shadows.md,
  },
  mainSaveText: {
    color: Colors.light,
    fontFamily: Fonts.bold,
    fontSize: FontSizes.medium,
  },
});