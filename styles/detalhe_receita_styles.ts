import { Dimensions, Platform, StyleSheet } from 'react-native';
import { Colors, Fonts, Radius, Shadows } from '../constants/theme';

const { width } = Dimensions.get('window');

const FOOTER_HEIGHT = Platform.OS === 'ios' ? 110 : 90;
const HEADER_HEIGHT = Platform.OS === 'ios' ? 88 : 56;

export const detalheReceitaStyles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },

  scrollView: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },

  scrollContent: {
    paddingBottom: 160,
    backgroundColor: '#FFFFFF',
  },

  topBarWrapper: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    zIndex: 9999,
  },

  topBar: {
    height: HEADER_HEIGHT,
    backgroundColor: '#FFFFFF',
    paddingTop: Platform.OS === 'ios' ? 42 : 10,
    paddingHorizontal: 18,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderBottomWidth: 1,
    borderBottomColor: '#EFE7DF',
  },

  topBarIconButton: {
    width: 32,
    height: 32,
    justifyContent: 'center',
    alignItems: 'center',
  },

  topBarTitle: {
    flex: 1,
    textAlign: 'center',
    fontFamily: Fonts.bold,
    fontSize: 15,
    color: Colors.dark,
  },

  imageHeader: {
    width: '100%',
    height: 325,
    position: 'relative',
    marginTop: HEADER_HEIGHT,
  },

  image: {
    width: '100%',
    height: '100%',
  },

  badgePopular: {
    position: 'absolute',
    bottom: 26,
    left: 20,
    backgroundColor: Colors.secondary,
    paddingHorizontal: 12,
    paddingVertical: 7,
    borderRadius: Radius.full,
    zIndex: 5,
  },

  badgeText: {
    color: '#FFF',
    fontFamily: Fonts.bold,
    fontSize: 10,
    textTransform: 'uppercase',
    letterSpacing: 0.4,
  },

  contentCard: {
    flex: 1,
    backgroundColor: '#FDF5ED',
    marginTop: -22,
    borderTopLeftRadius: 34,
    borderTopRightRadius: 34,
    paddingHorizontal: 24,
    paddingTop: 22,
    paddingBottom: FOOTER_HEIGHT + 30,
  },

  title: {
    fontFamily: Fonts.bold,
    fontSize: 20,
    color: Colors.dark,
    lineHeight: 26,
    marginBottom: 8,
  },

  description: {
    fontFamily: Fonts.regular,
    fontSize: 12,
    color: Colors.subtitle,
    lineHeight: 18,
    marginBottom: 20,
  },

  infoContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 24,
  },

  infoCard: {
    width: (width - 68) / 3,
    backgroundColor: '#FFF7F0',
    paddingVertical: 12,
    borderRadius: 18,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#FEE7D6',
    ...Shadows.sm,
  },

  infoLabel: {
    fontFamily: Fonts.bold,
    fontSize: 8,
    color: '#FB923C',
    textTransform: 'uppercase',
    marginTop: 5,
    marginBottom: 2,
  },

  infoValue: {
    fontFamily: Fonts.bold,
    fontSize: 11,
    color: Colors.dark,
  },

  sectionTitleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },

  sectionTitle: {
    fontFamily: Fonts.bold,
    fontSize: 15,
    color: Colors.dark,
  },

  itemsCount: {
    backgroundColor: '#FEE7D6',
    paddingHorizontal: 11,
    paddingVertical: 5,
    borderRadius: 10,
    color: Colors.secondary,
    fontSize: 10,
    fontFamily: Fonts.bold,
  },

  ingredientItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFF',
    padding: 15,
    borderRadius: 17,
    marginBottom: 11,
    ...Shadows.sm,
  },

  ingredientMissing: {
    backgroundColor: '#FFF5F0',
    borderColor: '#FEE7D6',
    borderWidth: 1,
  },

  ingredientText: {
    flex: 1,
    marginLeft: 11,
    fontFamily: Fonts.medium,
    fontSize: 13,
    color: Colors.dark,
  },

  missingLabel: {
    fontFamily: Fonts.bold,
    fontSize: 9,
    color: Colors.secondary,
    textTransform: 'uppercase',
  },

  preparoTitle: {
    fontFamily: Fonts.bold,
    fontSize: 15,
    color: Colors.dark,
    marginTop: 28,
    marginBottom: 18,
  },

  stepItem: {
    flexDirection: 'row',
    marginBottom: 22,
  },

  stepNumber: {
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: Colors.secondary,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 13,
    ...Shadows.sm,
  },

  stepNumberText: {
    color: '#FFF',
    fontFamily: Fonts.bold,
    fontSize: 13,
  },

  stepText: {
    flex: 1,
    fontFamily: Fonts.regular,
    fontSize: 13,
    color: Colors.subtitle,
    lineHeight: 20,
  },

  footer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: FOOTER_HEIGHT,
    flexDirection: 'row',
    paddingHorizontal: 20,
    paddingTop: 15,
    paddingBottom: Platform.OS === 'ios' ? 35 : 15,
    backgroundColor: '#FDF5ED',
    borderTopWidth: 1,
    borderTopColor: '#FEE7D6',
    gap: 15,
    zIndex: 9999,
    elevation: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -3 },
    shadowOpacity: 0.05,
    shadowRadius: 5,
  },

  favButton: {
    width: 58,
    height: 58,
    borderRadius: 18,
    borderWidth: 1,
    borderColor: '#FEE7D6',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#FFF',
    ...Shadows.sm,
  },

  mainButton: {
    flex: 1,
    height: 58,
    backgroundColor: Colors.secondary,
    borderRadius: 18,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 10,
    ...Shadows.md,
  },

  mainButtonText: {
    color: '#FFF',
    fontFamily: Fonts.bold,
    fontSize: 14,
  },
});