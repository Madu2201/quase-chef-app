import React, { useState } from "react";
import { View, Text, TextInput, TouchableOpacity } from "react-native";
import { Search, Upload, Share2 } from "lucide-react-native";
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
      {/* 1. Linha do Título (Favoritos, Dispensa, etc) */}
      {(title !== "" || showExport) && (
        <View style={styles.titleContainer}>
          <Text
            style={[styles.title, centerTitle && styles.titleCenter]}
            numberOfLines={1}
          >
            {title}
          </Text>

          {showExport && (
            <TouchableOpacity style={styles.exportBtn} onPress={onExport} activeOpacity={0.7}>
              <Upload size={14} color={Colors.secondary} />
              <Text style={styles.exportText}>Exportar</Text>
              <Share2 size={14} color={Colors.secondary} />
            </TouchableOpacity>
          )}
        </View>
      )}

      <View style={styles.headerContent}>
        {/* 2. Barra de Busca (Agora SEMPRE em cima do formulário/perfil) */}
        {showSearch && (
          <View style={[
            styles.searchContainer,
            isSearchFocused && styles.searchContainerFocused,
            { marginBottom: children ? Spacing.sm : 0 }
          ]}>
            <Search size={20} color={Colors.primary} />
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

        {/* 3. Conteúdo Adicional (Perfil na Home, Forms na Dispensa/Lista) */}
        {children}
      </View>
    </View>
  );
};