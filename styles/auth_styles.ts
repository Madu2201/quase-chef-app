import { Platform, StyleSheet, TextStyle } from "react-native";
import {
  Colors,
  Fonts,
  FontSizes,
  Radius,
  Shadows,
  Spacing,
} from "../constants/theme";

export const authStyles = StyleSheet.create({
  // --- CONTAINER PRINCIPAL ---
  container: {
    flexGrow: 1,
    backgroundColor: Colors.light,
    paddingHorizontal: Spacing.lg,
    paddingBottom: Spacing.xl,
    paddingTop: 55,
  },

  // --- KEYBOARD AVOIDING ---
  keyboardAvoid: {
    flex: 1,
  },

  // --- HEADER ---
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

  // --- ESTILIZAÇÃO DE ALERTAS ---
  successAlert: {
    backgroundColor: Colors.success,
    padding: Spacing.sm,
    borderRadius: Radius.lg,
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.md,
    marginTop: Spacing.xs,
    marginBottom: Spacing.xs,
  },
  successAlertText: {
    fontSize: FontSizes.small,
    color: Colors.light,
    fontFamily: Fonts.bold,
  },
  errorAlert: {
    marginBottom: Spacing.xs,
    backgroundColor: Colors.errorLight,
    padding: Spacing.sm,
    borderRadius: Radius.md,
  },
  errorAlertText: {
    color: Colors.errorDark,
    textAlign: "center",
    fontSize: FontSizes.small,
  },

  // --- ESTILIZAÇÃO DO INPUT ---
  inputGroup: {
    marginTop: Spacing.lg,
  },
  label: {
    fontFamily: Fonts.medium,
    fontSize: FontSizes.small,
    color: Colors.dark,
    marginBottom: Spacing.xs,
    marginTop: Spacing.sm,
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
    height: 48,
    ...Shadows.sm,
  },
  inputContainerFocused: {
    borderColor: Colors.primary,
    backgroundColor: Colors.light,
  },
  inputContainerError: {
    borderColor: Colors.errorDark,
    backgroundColor: Colors.errorLight,
  },
  input: {
    flex: 1,
    fontFamily: Fonts.regular,
    fontSize: FontSizes.small,
    color: Colors.dark,
    marginLeft: Spacing.xs,
    height: "100%",
    ...Platform.select({
      web: { outlineStyle: "none" } as any,
      default: {},
    }),
  } as TextStyle,

  // --- ESTILIZAÇÃO DE ERROS NO INPUT ---
  fieldErrorText: {
    color: Colors.errorDark,
    fontSize: FontSizes.small - 2,
    marginTop: Spacing.xs - 2,
    marginLeft: Spacing.xs,
    marginBottom: Spacing.sm,
  },

  // --- ESTILIZAÇÃO DE ERROS ---
  passwordRequirements: {
    marginTop: Spacing.xs,
    marginLeft: Spacing.xs,
    marginBottom: Spacing.md,
  },
  passwordReqItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginBottom: Spacing.xs,
  },
  passwordReqCircle: {
    width: 14,
    height: 14,
    borderRadius: Radius.md,
    borderWidth: 1,
    borderColor: Colors.subtext,
    opacity: 0.5,
  },
  passwordReqTextMet: {
    fontSize: FontSizes.small - 1,
    color: Colors.success,
    fontFamily: Fonts.medium,
  },
  passwordReqTextUnmet: {
    fontSize: FontSizes.small - 1,
    color: Colors.subtext,
    fontFamily: Fonts.medium,
  },

  // --- ESTILIZAÇÃO DE ACCORDION ---
  accordionSection: {
    marginTop: Spacing.xl,
    borderWidth: 1,
    borderColor: Colors.subtext + "25",
    borderRadius: Radius.lg,
    backgroundColor: Colors.light,
    overflow: "hidden",
  },
  accordionHeader: {
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.md,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: Spacing.md,
  },
  accordionHeaderLeft: {
    flex: 1,
    flexDirection: "row",
    alignItems: "flex-start",
    gap: Spacing.sm,
  },
  accordionTitleWrap: {
    flex: 1,
  },
  accordionTitleRow: {
    flexDirection: "row",
    alignItems: "center",
    flexWrap: "wrap",
    gap: 8,
    marginBottom: Spacing.xs,
  },
  accordionContent: {
    paddingHorizontal: Spacing.md,
    paddingBottom: Spacing.md,
  },

  // --- ESTILIZAÇÃO DE SEÇÃO ---
  sectionIconBadge: {
    width: 32,
    height: 32,
    borderRadius: Radius.full,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: Colors.primary + "12",
    marginTop: 2,
  },
  sectionIconBadgeWarning: {
    backgroundColor: Colors.warning + "12",
  },
  sectionTitle: {
    fontFamily: Fonts.bold,
    fontSize: FontSizes.medium,
    color: Colors.dark,
  },
  sectionDescription: {
    fontFamily: Fonts.regular,
    fontSize: FontSizes.small,
    color: Colors.subtitle,
    lineHeight: Spacing.lg,
  },
  sectionHelper: {
    fontFamily: Fonts.medium,
    fontSize: FontSizes.small - 1,
    color: Colors.subtext,
    marginBottom: Spacing.md,
  },

// --- ESTILIZAÇÃO DE PILL OPCIONAL ---
  optionalPill: {
    paddingHorizontal: Spacing.sm,
    paddingVertical: Spacing.xs,
    borderRadius: 999,
    backgroundColor: Colors.primary + "14",
  },
  optionalPillText: {
    fontFamily: Fonts.bold,
    fontSize: FontSizes.small - 2,
    color: Colors.primary,
  },

  // --- ESTILIZAÇÃO DE PREFERENCE CARDS ---
  cardWrapper: {
    width: "50%",
    paddingHorizontal: Spacing.sm,
    marginBottom: Spacing.md,
  },
  chipButton: {
    minHeight: 82,
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: Spacing.md,
    paddingHorizontal: Spacing.md,
    borderRadius: Radius.lg,
    borderWidth: 1.5,
    borderColor: Colors.subtext + "22",
    backgroundColor: Colors.light,
    ...Shadows.sm,
  },
  chipButtonSelected: {
    borderColor: Colors.primary + "55",
    backgroundColor: Colors.primary + "10",
    ...Shadows.md,
  },
  chipIconWrap: {
    width: 25,
    height: 25,
    borderRadius: Radius.full,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: Colors.subtext + "12",
    marginRight: Spacing.xs,
  },
  chipIconWrapSelected: {
    backgroundColor: Colors.primary,
  },
  chipText: {
    flex: 1,
    fontFamily: Fonts.medium,
    fontSize: FontSizes.small - 1,
    color: Colors.dark,
    lineHeight: Spacing.lg,
  },
  chipTextSelected: {
    color: Colors.primary,
    fontFamily: Fonts.bold,
  },

// --- ESTILIZAÇÃO DE CHIP ---
  chipsGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    marginHorizontal: -6,
  },

  // --- ESTILIZAÇÃO DE TEXT AREA ---
  textAreaContainer: {
    minHeight: 110,
    height: "auto",
    alignItems: "flex-start",
    paddingTop: Spacing.md,
    paddingBottom: Spacing.md,
  },
  textArea: {
    width: "100%",
    minHeight: 80,
    fontFamily: Fonts.regular,
    fontSize: FontSizes.small,
    color: Colors.dark,
    textAlignVertical: "top",
    ...Platform.select({
      web: { outlineStyle: "none" } as any,
      default: {},
    }),
  } as TextStyle,
  textAreaHelper: {
    fontFamily: Fonts.regular,
    fontSize: FontSizes.small - 1,
    color: Colors.subtext,
    marginBottom: Spacing.xs,
    marginLeft: Spacing.xs,
  },

  // --- BUTTON PRIMARY ---
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
  buttonPrimaryDisabled: {
    opacity: 0.8,
  },

  // --- DIVIDER ---
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

  // --- SOCIAL BUTTONS ---
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

  // --- FOOTER TEXT ---
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
    lineHeight: Spacing.lg,
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

  // --- ESTILIZAÇÃO DE ERROS ---
  errorText: {
    color: Colors.errorDark,
    fontSize: FontSizes.small - 1,
    fontFamily: Fonts.medium,
    marginTop: Spacing.xs - 4,
    marginBottom: Spacing.xs,
    marginLeft: Spacing.xs,
  },
  errorGeral: {
    color: Colors.errorDark,
    textAlign: "center",
    marginBottom: Spacing.sm,
    fontSize: FontSizes.small,
    fontFamily: Fonts.medium,
  },
  passwordCriteriaText: {
    fontSize: FontSizes.small,
    fontFamily: Fonts.regular,
    marginBottom: Spacing.xs - 2,
  },
  forgotPasswordText: {
    fontFamily: Fonts.medium,
    color: Colors.primary,
    fontSize: FontSizes.small,
    textAlign: "right",
    marginTop: Spacing.sm,
  },
  subSectionTitle: {
    fontFamily: Fonts.medium,
    fontSize: FontSizes.small,
    color: Colors.subtitle,
    marginTop: Spacing.md,
    marginBottom: Spacing.xs,
    marginLeft: Spacing.xs,
  },
  afterAccordionText: {
    textAlign: "center",
    marginTop: Spacing.lg,
    fontFamily: Fonts.medium,
    fontSize: FontSizes.small,
    color: Colors.subtitle,
  },
});