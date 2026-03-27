import { Platform, StyleSheet } from 'react-native';
import { Colors, Fonts, Radius, Shadows, Spacing } from '../constants/theme';

export const perfilStyles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },

  keyboardContainer: {
    flex: 1,
    backgroundColor: Colors.background,
  },

  topHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: Spacing.lg,
    paddingTop: Platform.OS === 'ios' ? 60 : 40,
    paddingBottom: Spacing.md,
    backgroundColor: Colors.background,
  },

  backButton: {
    padding: 5,
  },

  topHeaderTitle: {
    fontSize: 20,
    fontFamily: Fonts.bold,
    color: Colors.primary,
  },

  saveText: {
    color: Colors.primary,
    fontFamily: Fonts.bold,
    fontSize: 14,
  },

  scrollContent: {
    paddingBottom: 40,
  },

  avatarSection: {
    alignItems: 'center',
    marginVertical: 25,
  },

  avatarCircle: {
    width: 110,
    height: 110,
    borderRadius: 55,
    backgroundColor: Colors.light,
    justifyContent: 'center',
    alignItems: 'center',
    ...Shadows.sm,
    borderWidth: 2,
    borderColor: Colors.light,
    position: 'relative',
  },

  avatarImage: {
    width: 110,
    height: 110,
    borderRadius: 55,
  },

  cameraBadge: {
    position: 'absolute',
    bottom: 2,
    right: 2,
    backgroundColor: Colors.secondary,
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 3,
    borderColor: Colors.background,
  },

  loadingOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.3)',
    borderRadius: 55,
    justifyContent: 'center',
    alignItems: 'center',
  },

  userNameDisplay: {
    marginTop: 15,
    fontSize: 22,
    fontFamily: Fonts.bold,
    color: Colors.primary,
  },

  memberSince: {
    fontSize: 11,
    fontFamily: Fonts.regular,
    color: Colors.subtitle,
    marginTop: 4,
  },

  sectionCard: {
    backgroundColor: Colors.light,
    marginHorizontal: Spacing.lg,
    marginVertical: 12,
    padding: 20,
    borderRadius: Radius.lg,
    ...Shadows.sm,
  },

  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
    gap: 10,
  },

  sectionTitle: {
    fontSize: 16,
    fontFamily: Fonts.bold,
    color: Colors.primary,
  },

  inputBlock: {
    marginBottom: 18,
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
    borderBottomColor: Colors.subtitle + '20',
    paddingBottom: 8,
  },

  textInput: {
    flex: 1,
    fontSize: 14,
    color: Colors.primary,
    fontFamily: Fonts.regular,
  },

  prefRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#F9F9F9',
  },

  prefLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },

  prefRight: {
    flexDirection: 'row',
    alignItems: 'center',
  },

  prefText: {
    marginLeft: 12,
    fontSize: 14,
    color: Colors.primary,
    fontFamily: Fonts.medium,
  },

  prefHintText: {
    color: '#999',
    fontSize: 12,
    marginRight: 5,
    fontFamily: Fonts.regular,
  },

  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 30,
    marginBottom: 50,
    gap: 10,
  },

  logoutText: {
    color: Colors.secondary,
    fontFamily: Fonts.bold,
    fontSize: 16,
  },
});