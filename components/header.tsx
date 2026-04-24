import { router, useSegments } from "expo-router";
import { ArrowLeft, FileText, Search } from "lucide-react-native";
import React, { useEffect, useRef, useState } from "react";
import { StyleProp, Text, TextInput, TouchableOpacity, View, ViewStyle } from "react-native";

// Meus imports
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
  onBack?: () => void;
  rightElement?: React.ReactNode;
  children?: React.ReactNode;
  showBackButton?: boolean;
  style?: StyleProp<ViewStyle>;
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
  children,
  style, // Recebendo a prop de estilo
  showBackButton = false,
}: HeaderProps) => {
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const searchInputRef = useRef<TextInput | null>(null);
  const segments = useSegments();

  // Limpar foco de busca quando rotas mudam
  useEffect(() => {
    setIsSearchFocused(false);
    searchInputRef.current?.blur();
  }, [segments]);

  const handleBack = () => {
    if (onBack) onBack();
    else if (router.canGoBack()) router.back();
  };

  return (
    /* APLICAÇÃO DO ESTILO: Aqui combinamos o padrão com o que vier por prop */
    <View style={[styles.header, style]}>
      <View style={styles.titleContainer}>

        {/* Botão Voltar */}
        {(showBackButton || onBack) && (
          <TouchableOpacity
            onPress={handleBack}
            style={{
              position: centerTitle ? 'absolute' : 'relative',
              left: centerTitle ? Spacing.lg : 0,
              zIndex: 20,
              padding: 4
            }}
            activeOpacity={0.6}
          >
            <ArrowLeft size={24} color={Colors.primary} />
          </TouchableOpacity>
        )}

        <Text
          style={[
            styles.title,
            centerTitle && styles.titleCenter,
            (showBackButton || onBack) && centerTitle && { paddingHorizontal: 40 }
          ]}
          numberOfLines={1}
        >
          {title}
        </Text>

        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
          {showExport && (
            <TouchableOpacity style={styles.exportBtn} onPress={onExport} activeOpacity={0.7}>
              <FileText size={14} color={Colors.secondary} />
              <Text style={styles.exportText}>PDF</Text>
            </TouchableOpacity>
          )}
          {rightElement}
        </View>
      </View>

      {(showSearch || children) && (
        <View style={styles.headerContent}>
          {showSearch && (
            <View style={[
              styles.searchContainer,
              isSearchFocused && styles.searchContainerFocused,
              { marginBottom: children ? Spacing.sm : 0 }
            ]}>
              <Search size={18} color={Colors.primary} />
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
                underlineColorAndroid="transparent"
              />
            </View>
          )}
          {children}
        </View>
      )}
    </View>
  );
};