import { StyleSheet } from "react-native";
import {
  Colors,
  Fonts,
  FontSizes,
  Radius,
  Shadows,
  Spacing,
} from "../constants/theme";

export const perfilStyles = StyleSheet.create({
  // --- ESTRUTURA GERAL ---
  keyboardContainer: {
    flex: 1,
    backgroundColor: Colors.light,
  },
  scrollContent: {
    paddingBottom: Spacing.xl,
  },

  // --- AVATAR ---
  avatarSection: {
    alignItems: "center",
    marginVertical: Spacing.xl,
  },
  avatarCircle: {
    width: 110,
    height: 110,
    borderRadius: Radius.full,
    backgroundColor: Colors.light,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 2,
    borderColor: Colors.secondary + "99",
    position: "relative",
    ...Shadows.sm,
  },
  avatarImage: {
    width: 110,
    height: 110,
    borderRadius: Radius.full,
  },
  cameraBadge: {
    position: "absolute",
    bottom: 2,
    right: 2,
    backgroundColor: Colors.secondary,
    width: 32,
    height: 32,
    borderRadius: Radius.full,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 3,
    borderColor: Colors.background,
  },
  loadingOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(0,0,0,0.3)",
    borderRadius: Radius.full,
    justifyContent: "center",
    alignItems: "center",
  },
  userNameDisplay: {
    marginTop: Spacing.md,
    fontSize: FontSizes.large,
    fontFamily: Fonts.bold,
    color: Colors.primary,
  },
  memberSince: {
    fontSize: FontSizes.small - 1,
    fontFamily: Fonts.regular,
    color: Colors.subtitle,
    marginTop: Spacing.xs,
  },

  // --- CARDS E INPUTS ---
  sectionCard: {
    backgroundColor: Colors.subtext + "5",
    marginHorizontal: Spacing.lg,
    marginVertical: Spacing.sm,
    padding: Spacing.lg,
    borderWidth: 1,
    borderColor: Colors.subtext + "50",
    borderRadius: Radius.lg,
  },
  sectionHeader: {
    flexDirection: "row",
    alignItems: "center",
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
    fontSize: FontSizes.small,
    color: Colors.subtitle,
    marginBottom: 6,
    fontFamily: Fonts.medium,
  },
  inputRow: {
    flexDirection: "row",
    alignItems: "center",
    borderBottomWidth: 1,
    borderBottomColor: Colors.subtext + "30",
    paddingBottom: Spacing.sm,
  },
  textInput: {
    flex: 1,
    fontSize: FontSizes.small,
    color: Colors.primary,
    fontFamily: Fonts.regular,
  },

  // --- PREFERÊNCIAS ALIMENTARES ---
  prefDescription: {
    fontSize: FontSizes.small - 1,
    color: Colors.subtitle,
    fontFamily: Fonts.regular,
    marginBottom: Spacing.lg,
    lineHeight: 20,
  },

  preferenceBlock: {
    marginBottom: Spacing.lg,
  },

  preferenceLabel: {
    fontSize: FontSizes.small,
    color: Colors.subtitle,
    fontFamily: Fonts.bold,
    marginBottom: Spacing.sm,
  },

  chipsContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: Spacing.sm,
  },

  chip: {
    paddingVertical: 8,
    paddingHorizontal: 14,
    borderRadius: Radius.full,
    borderWidth: 1,
    borderColor: Colors.primary + "40",
    backgroundColor: Colors.secondary + "10",
  },

  chipText: {
    fontSize: FontSizes.small,
    color: Colors.primary,
    fontFamily: Fonts.medium,
  },

  preferenceRow: {
    paddingVertical: Spacing.md,
    borderTopWidth: 1,
    borderTopColor: Colors.subtext + "20",
  },

  preferenceRowLeft: {
    flex: 1,
  },

  preferenceValue: {
    fontSize: FontSizes.small,
    color: Colors.primary,
    fontFamily: Fonts.regular,
    lineHeight: 20,
  },

  preferenceValueMuted: {
    fontSize: FontSizes.small,
    color: Colors.subtext,
    fontFamily: Fonts.regular,
    lineHeight: 20,
  },

  // --- MODO TEMPORÁRIO ---
  temporaryModeCard: {
    marginTop: Spacing.lg,
    borderWidth: 1,
    borderColor: Colors.subtext + "20",
    borderRadius: Radius.lg,
    padding: Spacing.lg,
    backgroundColor: Colors.light,
  },

  temporaryModeHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: Spacing.lg,
  },

  temporaryModeIconWrap: {
    width: 48,
    height: 48,
    borderRadius: 14,
    backgroundColor: Colors.background,
    alignItems: "center",
    justifyContent: "center",
    marginRight: Spacing.md,
  },

  temporaryModeHeaderText: {
    flex: 1,
  },

  temporaryModeTitle: {
    fontSize: FontSizes.medium + 1,
    color: Colors.primary,
    fontFamily: Fonts.bold,
    marginBottom: 2,
  },

  temporaryModeSubtitle: {
    fontSize: FontSizes.small,
    color: Colors.subtitle,
    fontFamily: Fonts.regular,
    lineHeight: 20,
  },

  segmentedControl: {
    flexDirection: "row",
    backgroundColor: Colors.background,
    borderRadius: Radius.full,
    overflow: "hidden",
    marginBottom: Spacing.lg,
    borderWidth: 1,
    borderColor: Colors.subtext + "18",
  },

  segmentButton: {
    flex: 1,
    minHeight: 48,
    paddingHorizontal: 10,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "transparent",
  },

  segmentButtonActive: {
    backgroundColor: Colors.primary,
  },

  segmentButtonText: {
    fontSize: FontSizes.small,
    fontFamily: Fonts.bold,
    color: Colors.subtitle,
    textAlign: "center",
  },

  segmentButtonTextActive: {
    color: Colors.light,
  },

  modeHintBox: {
    flexDirection: "row",
    alignItems: "flex-start",
    backgroundColor: Colors.background,
    borderRadius: Radius.lg,
    padding: Spacing.md,
    gap: Spacing.sm,
  },

  modeHintText: {
    flex: 1,
    fontSize: FontSizes.small,
    color: Colors.primary,
    fontFamily: Fonts.regular,
    lineHeight: 22,
  },

  lastUpdatedRow: {
    marginTop: Spacing.lg,
    paddingTop: Spacing.lg,
    borderTopWidth: 1,
    borderTopColor: Colors.subtext + "20",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },

  lastUpdatedLabel: {
    fontSize: FontSizes.medium,
    color: Colors.primary,
    fontFamily: Fonts.medium,
  },

  lastUpdatedValue: {
    fontSize: FontSizes.medium,
    color: Colors.subtitle,
    fontFamily: Fonts.regular,
  },

  // --- BOTÃO EDITAR / EDITOR ---
  editPreferencesButton: {
    marginTop: Spacing.lg,
    borderTopWidth: 1,
    borderTopColor: Colors.subtext + "20",
    paddingTop: Spacing.md,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: Spacing.xs,
  },

  editPreferencesText: {
    fontSize: FontSizes.medium,
    color: Colors.primary,
    fontFamily: Fonts.bold,
  },

  chevronExpanded: {
    transform: [{ rotate: "90deg" }],
  },

  editorContainer: {
    marginTop: Spacing.lg,
    paddingTop: Spacing.lg,
    borderTopWidth: 1,
    borderTopColor: Colors.subtext + "20",
  },

  editorSection: {
    marginBottom: Spacing.xl,
  },

  editorSectionHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.xs,
    marginBottom: Spacing.sm,
  },

  editorSectionTitle: {
    fontSize: FontSizes.medium,
    color: Colors.primary,
    fontFamily: Fonts.bold,
    marginBottom: Spacing.sm,
  },

  editorHelperText: {
    fontSize: FontSizes.small - 1,
    color: Colors.subtitle,
    fontFamily: Fonts.regular,
    marginBottom: Spacing.sm,
    lineHeight: 20,
  },

  selectableChip: {
    paddingVertical: 10,
    paddingHorizontal: 14,
    borderRadius: Radius.full,
    borderWidth: 1,
    borderColor: Colors.subtext + "35",
    backgroundColor: Colors.light,
  },

  selectableChipActive: {
    borderColor: Colors.primary,
    backgroundColor: Colors.primary,
  },

  selectableChipText: {
    fontSize: FontSizes.small,
    color: Colors.primary,
    fontFamily: Fonts.medium,
  },

  selectableChipTextActive: {
    color: Colors.light,
    fontFamily: Fonts.bold,
  },

  restrictionsInput: {
    minHeight: 110,
    borderWidth: 1,
    borderColor: Colors.subtext + "30",
    borderRadius: Radius.lg,
    backgroundColor: Colors.light,
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.md,
    fontSize: FontSizes.small,
    color: Colors.primary,
    fontFamily: Fonts.regular,
  },

  preferencesSaveButton: {
    backgroundColor: Colors.primary,
    borderRadius: Radius.lg,
    paddingVertical: Spacing.md,
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "row",
    gap: Spacing.sm,
    ...Shadows.sm,
  },

  preferencesSaveButtonText: {
    color: Colors.light,
    fontSize: FontSizes.small,
    fontFamily: Fonts.bold,
  },

  // --- BOTÕES INFERIORES ---
  footerActions: {
    flexDirection: "row",
    flexWrap: "wrap",
    marginTop: Spacing.xl,
    marginBottom: Spacing.xl * 2,
    paddingHorizontal: Spacing.lg,
    gap: Spacing.md,
    alignItems: "center",
    justifyContent: "center",
  },

  logoutButtonInline: {
    flex: 1,
    minWidth: 90,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: Spacing.md,
    borderRadius: Radius.lg,
    borderWidth: 1,
    borderColor: Colors.errorDark + "40",
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
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: Spacing.md,
    borderRadius: Radius.lg,
    gap: Spacing.sm,
    ...Shadows.sm,
  },

  mainSaveText: {
    color: Colors.light,
    fontFamily: Fonts.bold,
    fontSize: FontSizes.medium,
  },
});
