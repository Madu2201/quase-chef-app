import { Platform, StyleSheet, TextStyle } from "react-native";
import { Colors, Fonts, FontSizes, Radius, Shadows, Spacing } from "../constants/theme";

export const authStyles = StyleSheet.create({
  // --- ESTRUTURA PRINCIPAL ---
  container: {
    flexGrow: 1,
    backgroundColor: Colors.background,
    paddingHorizontal: Spacing.lg,
    paddingBottom: Spacing.xl,
    paddingTop: 55,
  },

  // --- LOGO E IDENTIDADE ---
  header: {
    alignItems: "center",
    marginBottom: Spacing.xs,
  },
  logo: {
    width: 80,
    height: 80,
    marginBottom: Spacing.xs,
  },
  brandName: {
    fontFamily: Fonts.bold,
    fontSize: FontSizes.medium,
    color: Colors.dark,
  },

  // --- MENSAGENS DE BOAS-VINDAS ---
  welcomeTitle: {
    fontFamily: Fonts.bold,
    fontSize: FontSizes.large,
    color: Colors.dark,
    textAlign: "center",
    marginTop: Spacing.sm,
  },
  welcomeSubtitle: {
    fontFamily: Fonts.regular,
    fontSize: FontSizes.small,
    color: Colors.subtitle,
    textAlign: "center",
    marginTop: Spacing.xs,
    lineHeight: Spacing.lg,
    paddingHorizontal: Spacing.sm,
  },

  // --- FORMULÁRIOS E INPUTS ---
  inputGroup: {
    marginTop: Spacing.lg,
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1.5,
    borderColor: 'transparent',
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
  input: {
    flex: 1,
    fontFamily: Fonts.regular,
    fontSize: FontSizes.small,
    color: Colors.dark,
    marginLeft: Spacing.xs,
    height: "100%",
    ...Platform.select({
      web: { outlineStyle: 'none' } as any,
      default: {},
    }),
  } as TextStyle,

  // --- BOTÕES E LINKS DE AÇÃO ---
  forgotPasswordText: {
    fontFamily: Fonts.medium,
    color: Colors.primary,
    fontSize: FontSizes.small,
    textAlign: "right",
    marginTop: Spacing.sm,
  },
  buttonPrimary: {
    backgroundColor: Colors.primary,
    height: 50,
    borderRadius: Radius.lg,
    justifyContent: "center",
    alignItems: "center",
    marginTop: Spacing.lg,
    ...Shadows.sm,
  },
  buttonPrimaryText: {
    fontFamily: Fonts.bold,
    color: Colors.light,
    fontSize: FontSizes.medium,
  },

  // --- DIVISORES (OU) ---
  dividerContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginVertical: Spacing.lg,
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

  // --- LOGIN SOCIAL ---
  socialContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    gap: Spacing.md,
  },
  socialButton: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    height: 48,
    borderRadius: Radius.lg,
    borderWidth: 1,
    borderColor: Colors.subtext,
    backgroundColor: Colors.light,
    gap: Spacing.sm,
  },
  socialButtonText: {
    fontFamily: Fonts.bold,
    color: Colors.dark,
    fontSize: FontSizes.small,
  },

  // --- RODAPÉ E LINKS LEGAIS ---
  footerText: {
    textAlign: "center",
    marginTop: Spacing.lg,
    fontFamily: Fonts.regular,
    fontSize: FontSizes.small,
    color: Colors.subtitle,
  },
  backToLoginText: {
    textAlign: "center",
    marginTop: Spacing.xl,
    fontFamily: Fonts.regular,
    fontSize: FontSizes.small,
    color: Colors.subtitle,
  },
  legalText: {
    textAlign: "center",
    marginTop: Spacing.xl,
    fontSize: FontSizes.small,
    fontFamily: Fonts.regular,
    color: Colors.subtext,
    lineHeight: Spacing.lg,
    paddingHorizontal: Spacing.sm,
  },
  linkUnderline: {
    textDecorationLine: "underline",
    color: Colors.subtext,
  },
  primaryLink: {
    fontFamily: Fonts.bold,
    color: Colors.primary,
  },
});