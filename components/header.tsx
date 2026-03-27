import React, { useState } from "react";
import { View, Text, TextInput, TouchableOpacity } from "react-native";
import { Search, FileText, ArrowLeft } from "lucide-react-native";

// Estilos Próprios
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
  onBack?: () => void;        // Função para o botão voltar
  rightElement?: React.ReactNode; // Elemento extra (ex: botão Salvar)
  children?: React.ReactNode; // Inputs ou filtros extras
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
  onBack,
  rightElement,
  children
}: HeaderProps) => {
  const [isSearchFocused, setIsSearchFocused] = useState(false);

  return (
    <View style={styles.header}>

      {/* --- LINHA SUPERIOR: Voltar, Título e Ações --- */}
      <View style={styles.titleContainer}>
        <View style={{ flexDirection: 'row', alignItems: 'center', flex: 1, gap: Spacing.sm }}>
          {onBack && (
            <TouchableOpacity onPress={onBack} style={{ padding: 4 }} activeOpacity={0.6}>
              <ArrowLeft size={22} color={Colors.primary} />
            </TouchableOpacity>
          )}

          <Text
            style={[styles.title, centerTitle && styles.titleCenter]}
            numberOfLines={1}
          >
            {title}
          </Text>
        </View>

        {/* Botão Exportar (PDF) */}
        {showExport && (
          <TouchableOpacity style={styles.exportBtn} onPress={onExport} activeOpacity={0.7}>
            <FileText size={14} color={Colors.secondary} />
            <Text style={styles.exportText}>Exportar PDF</Text>
          </TouchableOpacity>
        )}

        {/* Slot para outros elementos (ex: "Salvar" no Perfil) */}
        {rightElement && rightElement}
      </View>

      {/* --- SEÇÃO INFERIOR: Busca e Conteúdo Dinâmico --- */}
      {(showSearch || children) && (
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
                autoCorrect={false}
              />
            </View>
          )}

          {/* Renderiza componentes extras como formulários ou filtros */}
          {children}
        </View>
      )}
    </View>
  );
};