import React, { useState } from "react";
import { View, Text, TextInput, TouchableOpacity } from "react-native";
import { Search, FileText, Share2 } from "lucide-react-native";

// Importações de Estilo e Branding
import { Colors, Spacing } from "../constants/theme";
import { headerStyles as styles } from "../styles/header.styles";

interface HeaderProps {
  title?: string;
  centerTitle?: boolean;
  showSearch?: boolean;
  searchText?: string;
  setSearchText?: (text: string) => void;
  searchPlaceholder?: string;
  showExport?: boolean;
  onExport?: () => void;
  children?: React.ReactNode;
}

/**
 * Componente de Cabeçalho Adaptável
 * Suporta título, botão de exportação branding "Quase Chef", 
 * barra de busca e injeção de formulários (children).
 */
export const Header = ({
  title = "",
  centerTitle = false,
  showSearch = true,
  searchText,
  setSearchText,
  searchPlaceholder = "Buscar...",
  showExport = false,
  onExport,
  children
}: HeaderProps) => {
  const [isSearchFocused, setIsSearchFocused] = useState(false);

  return (
    <View style={styles.header}>

      {/* SEÇÃO SUPERIOR: Título e Ação de Exportar */}
      {(title !== "" || showExport) && (
        <View style={styles.titleContainer}>
          <Text
            style={[styles.title, centerTitle && styles.titleCenter]}
            numberOfLines={1}
          >
            {title}
          </Text>

          {showExport && (
            <TouchableOpacity
              style={styles.exportBtn}
              onPress={onExport}
              activeOpacity={0.7}
            >
              {/* Ícone de Documento (Branding PDF) */}
              <FileText size={14} color={Colors.secondary} />
            <Text style={styles.exportText}>Exportar PDF</Text>
            </TouchableOpacity>
          )}
        </View>
      )}

      {/* SEÇÃO DE CONTEÚDO: Busca e Formulários Dinâmicos */}
      <View style={styles.headerContent}>

        {/* Barra de Pesquisa Opcional */}
        {showSearch && (
          <View style={[
            styles.searchContainer,
            isSearchFocused && styles.searchContainerFocused,
            { marginBottom: children ? Spacing.sm : 0 } // Espaçamento dinâmico se houver children
          ]}>
            <Search size={15} color={Colors.primary} />
            <TextInput
              placeholder={searchPlaceholder}
              style={styles.searchInput}
              onFocus={() => setIsSearchFocused(true)}
              onBlur={() => setIsSearchFocused(false)}
              onChangeText={setSearchText}
              value={searchText}
              placeholderTextColor={Colors.primary + "80"}
              selectionColor={Colors.primary}
            />
          </View>
        )}

        {/* Espaço para o Formulário de Adição (AddFormContainer) */}
        {children}
      </View>
    </View>
  );
};