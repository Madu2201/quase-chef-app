import { Platform, StyleSheet } from "react-native";
import { Colors, Fonts, Radius, Shadows } from "../constants/theme";

export const receitasStyles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FDF5ED',
  },

  // 🔹 HEADER (TOPO BRANCO COM CURVA)
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: Platform.OS === 'ios' ? 60 : 40,
    paddingBottom: 10,
    backgroundColor: '#FFF',
    borderBottomLeftRadius: 28,
    borderBottomRightRadius: 28,
  },

  backButton: {
    padding: 4,
  },

  headerTitle: {
    flex: 1,
    textAlign: 'center',
    fontFamily: Fonts.bold,
    fontSize: 18,
    color: Colors.dark,
    marginRight: 32,
  },

  // 🔹 AREA DOS FILTROS (SEM FUNDO BRANCO!)
  filtersContainer: {
    paddingTop: 10,
    width: '100%',
    marginBottom: 12,
  },

  // 🔹 SEARCH
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F5EBE1',
    borderRadius: Radius.full,
    paddingHorizontal: 16,
    height: 48,
    marginBottom: 10,
  },

  searchInput: {
    flex: 1,
    marginLeft: 10,
    fontFamily: Fonts.regular,
    fontSize: 14,
    color: Colors.dark,
  },

  // 🔹 TOGGLE ESTOQUE
  stockToggle: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#F5EBE1',
    borderRadius: Radius.full,
    paddingLeft: 16,
    paddingRight: 10,
    height: 48,
    marginBottom: 15,
  },

  stockLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },

  stockText: {
    fontFamily: Fonts.medium,
    fontSize: 14,
    color: Colors.subtitle,
    marginLeft: 10,
  },

  switchWrapper: {
    justifyContent: 'center',
    alignItems: 'center',
  },

  // 🔥 CHIPS (RESOLVIDO O CORTE DO POPULARES)
  chipsScroll: {
    marginBottom: 20,
    marginRight: -20,
  },

  chipsScrollContent: {
    paddingLeft: 20,
    paddingRight: 90,
  },

  chip: {
    flexDirection: 'row',
    alignItems: 'center',
    height: 36,
    paddingHorizontal: 16,
    borderRadius: Radius.full,
    backgroundColor: '#F5EBE1',
    marginRight: 10,
    gap: 6,
    flexShrink: 0,
  },

  chipActive: {
    backgroundColor: Colors.primary,
  },

  chipText: {
    fontFamily: Fonts.bold,
    fontSize: 13,
    color: Colors.primary,
  },

  chipTextActive: {
    color: '#FFF',
  },

  // 🔹 LISTA DE RECEITAS
  listContent: {
    paddingHorizontal: 20,
    paddingBottom: 40,
  },

  card: {
    backgroundColor: '#FFF',
    borderRadius: 20,
    marginBottom: 16,
    overflow: 'hidden',
    ...Shadows.sm,
  },

  cardImageContainer: {
    width: '100%',
    height: 140,
  },

  cardImage: {
    width: '100%',
    height: '100%',
  },

  cardBody: {
    padding: 12,
  },

  titleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 4,
  },

  recipeTitle: {
    fontFamily: Fonts.bold,
    fontSize: 16,
    color: Colors.dark,
  },

  metaRow: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 6,
  },

  metaText: {
    fontFamily: Fonts.regular,
    fontSize: 11,
    color: Colors.primary,
  },

  recipeDescription: {
    fontFamily: Fonts.regular,
    fontSize: 12,
    color: Colors.subtitle,
    marginBottom: 12,
  },

  viewButton: {
    backgroundColor: Colors.primary,
    height: 40,
    borderRadius: Radius.lg,
    justifyContent: 'center',
    alignItems: 'center',
  },

  viewButtonText: {
    fontFamily: Fonts.bold,
    fontSize: 14,
    color: '#FFF',
  },
});