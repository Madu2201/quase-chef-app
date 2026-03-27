import { Platform, StyleSheet, TextStyle } from 'react-native';
import { Colors, Fonts, FontSizes, Radius, Shadows, Spacing } from '../constants/theme';

export const cadastroStyles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: Colors.background,
  },

  container: {
    flexGrow: 1,
    backgroundColor: Colors.background,
    paddingHorizontal: Spacing.lg,
    paddingTop: 72,
    paddingBottom: Spacing.xl,
  },

  header: {
    alignItems: 'center',
    marginBottom: Spacing.md,
  },

  logoBadge: {
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: Spacing.md,
  },

  logo: {
    width: 82,
    height: 82,
  },

  brandName: {
    fontFamily: Fonts.bold,
    fontSize: 20,
    color: Colors.dark,
    marginBottom: Spacing.sm,
  },

  welcomeTitle: {
    fontFamily: Fonts.bold,
    fontSize: 26,
    color: Colors.dark,
    textAlign: 'center',
    marginTop: 2,
  },

  welcomeSubtitle: {
    fontFamily: Fonts.regular,
    fontSize: FontSizes.small - 1,
    color: Colors.subtitle,
    textAlign: 'center',
    marginTop: Spacing.xs,
    lineHeight: 20,
    paddingHorizontal: Spacing.lg,
  },

  formCard: {
    marginTop: Spacing.xs,
  },

  inputGroup: {
    marginTop: 0,
  },

  label: {
    fontFamily: Fonts.medium,
    fontSize: FontSizes.small,
    color: Colors.dark,
    marginBottom: 6,
    marginTop: 10,
    marginLeft: Spacing.xs,
  },

  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1.5,
    borderColor: 'transparent',
    borderRadius: Radius.lg,
    backgroundColor: Colors.light,
    paddingHorizontal: Spacing.md,
    marginBottom: 4,
    height: 46,
    ...Shadows.sm,
  },

  inputContainerFocused: {
    borderColor: Colors.primary,
    backgroundColor: Colors.light,
  },

  input: {
    flex: 1,
    fontFamily: Fonts.regular,
    fontSize: FontSizes.small,
    color: Colors.dark,
    marginLeft: Spacing.xs,
    height: '100%',
    ...Platform.select({
      web: { outlineStyle: 'none' } as any,
      default: {},
    }),
  } as TextStyle,

  buttonPrimary: {
    backgroundColor: Colors.primary,
    height: 50,
    borderRadius: Radius.lg,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: Spacing.lg,
    ...Shadows.sm,
  },

  buttonPrimaryText: {
    fontFamily: Fonts.bold,
    color: Colors.light,
    fontSize: FontSizes.medium,
  },

  footerBlock: {
    marginTop: Spacing.xl,
  },

  dividerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: Spacing.sm,
    marginBottom: Spacing.sm,
  },

  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: Colors.subtext,
    opacity: 0.2,
  },

  dividerText: {
    marginHorizontal: Spacing.md,
    color: Colors.subtext,
    fontFamily: Fonts.regular,
    fontSize: FontSizes.small,
  },

  backToLoginText: {
    textAlign: 'center',
    marginTop: Spacing.sm,
    fontFamily: Fonts.regular,
    fontSize: FontSizes.small,
    color: Colors.subtitle,
    lineHeight: 20,
  },

  legalText: {
    textAlign: 'center',
    marginTop: Spacing.lg,
    fontSize: FontSizes.small - 2,
    fontFamily: Fonts.regular,
    color: Colors.subtext,
    lineHeight: 17,
    paddingHorizontal: Spacing.md,
    marginBottom: Spacing.md,
  },

  primaryLink: {
    fontFamily: Fonts.bold,
    color: Colors.primary,
  },
});