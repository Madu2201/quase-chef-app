import { Platform, StyleSheet } from 'react-native';
import { Colors, Fonts, Shadows, Spacing } from '../constants/theme';

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },

  scrollContent: {
    paddingBottom: 28,
  },

  topBar: {
    paddingHorizontal: Spacing.lg,
    paddingTop: Platform.OS === 'android' ? 42 : 10,
    marginBottom: 10,
  },

  backButton: {
    alignSelf: 'flex-start',
    backgroundColor: '#FEE7D6',
    padding: 11,
    borderRadius: 18,
  },

  heroCard: {
    marginHorizontal: Spacing.lg,
    backgroundColor: Colors.light,
    borderRadius: 28,
    overflow: 'hidden',
    marginBottom: 20,
    ...Shadows.md,
  },

  heroTextArea: {
    paddingHorizontal: 22,
    paddingTop: 22,
    paddingBottom: 18,
  },

  heroTag: {
    alignSelf: 'flex-start',
    backgroundColor: '#FFF3E8',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 999,
    marginBottom: 16,
  },

  heroTagText: {
    fontSize: 11,
    fontFamily: Fonts.bold,
    color: Colors.primary,
    letterSpacing: 0.8,
  },

  heroTitle: {
    fontSize: 22,
    lineHeight: 30,
    fontFamily: Fonts.bold,
    color: Colors.dark,
    marginBottom: 8,
    maxWidth: '85%',
  },

  heroSubtitle: {
    fontSize: 15,
    lineHeight: 22,
    fontFamily: Fonts.regular,
    color: Colors.subtitle,
    marginBottom: 4,
    maxWidth: '88%',
  },

  heroImage: {
    width: '100%',
    height: 220,
  },

  searchWrapper: {
    paddingHorizontal: Spacing.lg,
    marginBottom: 18,
  },

  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.light,
    borderRadius: 18,
    paddingHorizontal: 15,
    height: 54,
    borderWidth: 1,
    borderColor: '#F1E5D9',
    ...Shadows.sm,
  },

  searchInput: {
    flex: 1,
    fontSize: 15,
    fontFamily: Fonts.regular,
    color: Colors.primary,
    marginLeft: 10,
  },

  quickFiltersScroll: {
    paddingHorizontal: Spacing.lg,
    marginBottom: 24,
  },

  quickFiltersScrollContent: {
    flexDirection: 'row',
    gap: 12,
    paddingRight: 20,
  },

  quickFilterItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: Colors.light,
    borderWidth: 1,
    borderColor: '#E8DCCF',
    paddingVertical: 11,
    paddingHorizontal: 18,
    borderRadius: 20,
    ...Shadows.sm,
  },

  quickFilterItemActive: {
    backgroundColor: Colors.secondary,
    borderColor: Colors.secondary,
    shadowColor: Colors.secondary,
    shadowOpacity: 0.24,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 4 },
    elevation: 5,
  },

  quickFilterPressed: {
    transform: [{ scale: 0.97 }],
  },

  quickFilterText: {
    fontSize: 14,
    fontFamily: Fonts.medium,
    color: Colors.dark,
  },

  quickFilterTextActive: {
    color: '#FFF',
    fontFamily: Fonts.bold,
  },

  categoryContainer: {
    marginBottom: 24,
    paddingHorizontal: Spacing.lg,
  },

  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 14,
    gap: 12,
  },

  categoryTitle: {
    fontSize: 13,
    fontFamily: Fonts.bold,
    color: Colors.subtitle,
    letterSpacing: 1.5,
  },

  sectionLine: {
    flex: 1,
    height: 1,
    backgroundColor: '#E8DCCF',
    opacity: 0.8,
  },

  chipsWrapper: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },

  chip: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 22,
    borderWidth: 1.2,
    borderColor: '#E8DCCF',
    backgroundColor: '#FFF',
    ...Shadows.sm,
  },

  chipSelected: {
    backgroundColor: Colors.secondary,
    borderColor: Colors.secondary,
    shadowColor: Colors.secondary,
    shadowOpacity: 0.26,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 4 },
    elevation: 5,
  },

  chipPressed: {
    transform: [{ scale: 0.96 }],
  },

  chipPressedUnselected: {
    backgroundColor: '#FFF8F3',
  },

  chipText: {
    fontSize: 14,
    fontFamily: Fonts.medium,
    color: Colors.dark,
  },

  chipTextSelected: {
    color: '#FFF',
    fontFamily: Fonts.bold,
  },

  footer: {
    position: 'absolute',
    bottom: Platform.OS === 'ios' ? 24 : 18,
    left: 20,
    right: 20,
    zIndex: 10,
  },

  generateButton: {
    backgroundColor: Colors.secondary,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    height: 62,
    borderRadius: 24,
    gap: 10,
    ...Shadows.lg,
  },

  generateButtonPressed: {
    transform: [{ scale: 0.985 }],
  },

  generateButtonDisabled: {
    backgroundColor: '#F4B27E',
    shadowOpacity: 0.08,
    elevation: 1,
  },

  generateButtonText: {
    color: '#FFF',
    fontSize: 17,
    fontFamily: Fonts.bold,
  },

  generateButtonTextDisabled: {
    color: 'rgba(255,255,255,0.78)',
  },

  badge: {
    backgroundColor: 'rgba(255,255,255,0.22)',
    paddingHorizontal: 11,
    paddingVertical: 4,
    borderRadius: 11,
    marginLeft: 6,
    minWidth: 70,
    alignItems: 'center',
  },

  badgeDisabled: {
    backgroundColor: 'rgba(255,255,255,0.16)',
  },

  badgeText: {
    color: '#FFF',
    fontFamily: Fonts.bold,
    fontSize: 14,
  },

  badgeTextDisabled: {
    color: 'rgba(255,255,255,0.78)',
  },
});