import { StyleSheet, Platform } from "react-native";
import {
  Colors,
  Fonts,
  FontSizes,
  Spacing,
  Radius,
  Shadows,
} from "../constants/theme";

export const authStyles = StyleSheet.create({
  // Layout principal com scroll
  container: {
    flexGrow: 1,
    backgroundColor: Colors.background,
    paddingHorizontal: Spacing.lg,
    paddingBottom: Spacing.xl,
    paddingTop: 55,
  },
  // Seção da Logo e Identidade
  header: {
    alignItems: "center",
    marginBottom: Spacing.xs,
  },
  logo: {
    width: 95,
    height: 95,
    marginBottom: Spacing.xs,
  },
  brandName: {
    fontFamily: Fonts.bold,
    fontSize: FontSizes.medium + 2,
    color: Colors.dark,
  },
  // Textos de boas-vindas
  welcomeTitle: {
    fontFamily: Fonts.bold,
    fontSize: FontSizes.large + 2,
    color: Colors.dark,
    textAlign: "center",
    marginTop: Spacing.sm + 2,
  },
  welcomeSubtitle: {
    fontFamily: Fonts.regular,
    fontSize: FontSizes.small + 1,
    color: Colors.subtitle,
    textAlign: "center",
    marginTop: Spacing.xs,
    lineHeight: 20,
    paddingHorizontal: Spacing.sm,
  },
  // Grupos de formulário
  inputGroup: {
    marginTop: Spacing.lg,
  },

  /* CONTAINER DO INPUT (PADRÃO) */
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1.5,
    borderColor: 'transparent', // Começa invisível para não dar "pulo" no layout
    borderRadius: Radius.lg,
    backgroundColor: Colors.light,
    paddingHorizontal: Spacing.md,
    marginBottom: Spacing.xs,
    height: 52,
    ...Shadows.sm,
  },
  /*ESTADO FOCADO DO INPUT (PADRÃO) */
  inputContainerFocused: {
    borderColor: Colors.primary,
    backgroundColor: Colors.light,
    borderWidth: 1.5,
  },
  input: {
    flex: 1,
    fontFamily: Fonts.regular,
    fontSize: FontSizes.small + 2,
    color: Colors.dark,
    marginLeft: Spacing.xs,
    height: "100%",
    // @ts-ignore (Remove o contorno padrão no Navegador/Web)
    outlineStyle: 'none' as any,
  },
  // Links e Botões de Ação
  forgotPasswordText: {
    fontFamily: Fonts.medium,
    color: Colors.primary,
    fontSize: FontSizes.small + 2,
    textAlign: "right",
    marginTop: Spacing.sm,
  },
  buttonPrimary: {
    backgroundColor: Colors.primary,
    height: 52,
    borderRadius: Radius.lg,
    justifyContent: "center",
    alignItems: "center",
    marginTop: Spacing.lg,
    ...Shadows.sm,
  },
  buttonPrimaryText: {
    fontFamily: Fonts.bold,
    color: Colors.light,
    fontSize: FontSizes.medium + 1,
  },
  // Divisores ("ou entre com")
  dividerContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginVertical: Spacing.md + 4,
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: Colors.subtext,
    opacity: 0.3,
  },
  dividerText: {
    marginHorizontal: Spacing.md,
    color: Colors.subtext,
    fontFamily: Fonts.regular,
    fontSize: FontSizes.small,
  },
  // Login Social
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
    height: 52,
    borderRadius: Radius.lg,
    borderWidth: 1,
    borderColor: Colors.subtext,
    backgroundColor: Colors.light,
    gap: Spacing.sm,
  },
  socialButtonText: {
    fontFamily: Fonts.bold,
    color: Colors.dark,
    fontSize: FontSizes.small + 2,
  },
  // Rodapé e Links Legais
  footerText: {
    textAlign: "center",
    marginTop: Spacing.lg,
    fontFamily: Fonts.regular,
    color: Colors.subtitle,
  },
  backToLoginText: {
    textAlign: "center",
    marginTop: Spacing.xl,
    fontFamily: Fonts.regular,
    fontSize: FontSizes.small + 1,
    color: Colors.subtitle,
  },
  legalText: {
    textAlign: "center",
    marginTop: Spacing.xl,
    fontSize: FontSizes.small,
    fontFamily: Fonts.regular,
    color: Colors.subtext,
    lineHeight: 16,
    paddingHorizontal: 10,
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