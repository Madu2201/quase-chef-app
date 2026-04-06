import { Platform, StyleSheet, TextStyle } from "react-native";
import { Colors, Fonts, FontSizes, Radius, Shadows, Spacing } from "../constants/theme";

export const authStyles = StyleSheet.create({
  // --- ESTRUTURA PRINCIPAL ---
  container: {
    flexGrow: 1,
    backgroundColor: Colors.light,
    paddingHorizontal: Spacing.lg,
    paddingBottom: Spacing.xl,
    paddingTop: 55,
  },

  // -- VALIDAÇÕES ERROS --
  inputContainerError: {
    borderColor: Colors.errorDark,
    backgroundColor: Colors.errorLight,
  },
  errorText: {
    color: Colors.errorDark,
    fontSize: FontSizes.small,
    fontFamily: Fonts.medium,
    marginTop: Spacing.xs,
    marginLeft: Spacing.xs,
  },
  passwordCriteriaText: {
    fontSize: FontSizes.small,
    fontFamily: Fonts.regular,
    marginBottom: Spacing.xs - 2,
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
    ...Shadows.md,
  },
  brandName: {
    fontFamily: Fonts.bold,
    fontSize: FontSizes.medium,
    color: Colors.dark,
  },

  // --- MENSAGENS DE TEXTO ---
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
    color: Colors.subtitle + "99",
    textAlign: "center",
    marginTop: Spacing.xs,
    lineHeight: Spacing.lg,
    paddingHorizontal: Spacing.sm,
  },

  // --- FORMULÁRIOS E INPUTS ---
  inputGroup: {
    marginTop: Spacing.lg,
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
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1.5,
    borderColor: Colors.subtext + "80",
    borderRadius: Radius.lg,
    backgroundColor: Colors.light,
    paddingHorizontal: Spacing.md,
    marginBottom: Spacing.xs,
    height: 48, // Altura padronizada
    ...Shadows.md,
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

  // --- BOTÕES E AÇÕES ---
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
  forgotPasswordText: {
    fontFamily: Fonts.medium,
    color: Colors.primary,
    fontSize: FontSizes.small,
    textAlign: "right",
    marginTop: Spacing.sm,
  },

  // --- DIVISORES E SOCIAL ---
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

  // --- RODAPÉ E LINKS ---
  footerText: {
    textAlign: "center",
    marginTop: Spacing.lg,
    fontFamily: Fonts.regular,
    fontSize: FontSizes.small,
    color: Colors.subtitle,
  },
  legalText: {
    textAlign: "center",
    marginTop: Spacing.xl,
    fontSize: FontSizes.small - 1,
    fontFamily: Fonts.regular,
    color: Colors.subtext,
    lineHeight: 18,
    paddingHorizontal: Spacing.sm,
  },
  primaryLink: {
    fontFamily: Fonts.bold,
    color: Colors.primary,
  },
  linkUnderline: {
    textDecorationLine: "underline",
    color: Colors.primary,
  },
});