import React, { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, Platform } from "react-native";
import { Search, FileText } from "lucide-react-native";

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
            numberOfLines={2} // Permite até 2 linhas para o título
          >
            {title}
          </Text>

          {showExport && (
            <TouchableOpacity
              style={styles.exportBtn}
              onPress={onExport}
              activeOpacity={0.7}
            >
              <FileText size={14} color={Colors.secondary} />
              <Text style={styles.exportText}>Exportar PDF</Text>
            </TouchableOpacity>
          )}
        </View>
      )}

      {/* SEÇÃO DE CONTEÚDO: Busca e Formulários Dinâmicos */}
      <View style={styles.headerContent}>
        {showSearch && (
          <View style={[
            styles.searchContainer,
            isSearchFocused && styles.searchContainerFocused,
            { marginBottom: children ? Spacing.sm : 0 }
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

        {/* Espaço para children (AddFormContainer, etc) */}
        {children}
      </View>
    </View>
  );
};