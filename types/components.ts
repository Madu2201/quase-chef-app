import type { ReactNode } from "react";
import type { StyleProp, ViewStyle } from "react-native";

// Meu import
import type { EditForm } from "./lista";

// Tipos para o componente AddItemCard
export interface AddItemCardProps {
    label: string;
    placeholder: string;
    nameValue: string;
    onNameChange: (text: string) => void;
    qtyValue: string;
    onQtyChange: (text: string) => void;
    unitValue: string;
    onUnitChange: (unit: string) => void;
    onAddPress: () => void;
    showUnitPicker: boolean;
    onToggleUnitPicker: () => void;
    activeInput: string | null;
    onNameFocus: () => void;
    onNameBlur: () => void;
    onQtyFocus: () => void;
    onQtyBlur: () => void;
    styles: any;
    iconSize?: number;
    useAddPanelStyle?: boolean;
    metaValue?: string;
    onMetaChange?: (text: string) => void;
    onMetaFocus?: () => void;
    onMetaBlur?: () => void;
    qtyLabel?: string;
    metaLabel?: string;
    onMetaHelp?: () => void;
}

// Tipos para o componente AuthHeader
export interface AuthHeaderProps {
    title: string;
    subtitle: string;
    email?: string;
}

// Tipos para o componente AuthLegalNotice
export type AuthLegalNoticeProps = {
    prefixText?: string;
};

// Tipos para o componente ChipsFilter
export interface ChipsFilterProps {
    filtro: string;
    setFiltro: (filtro: string) => void;
    receitasExibidas: { id: string }[];
    totalReceitasEncontradas: number;
    hasMounted: boolean;
}

// Tipos para o componente EditItemCard
export interface EditItemCardProps {
    isListMode?: boolean;
    onSave: (form: EditForm) => void;
    onClose: () => void;
    styles: any;
    renderUnitPicker: (
        units: string[],
        activeUnit: string,
        onSelect: (unit: string) => void,
        onClose: () => void,
    ) => ReactNode;
    showUnitPicker: boolean;
    setShowUnitPicker: (show: boolean) => void;
    editForm: EditForm;
    setEditForm: (form: EditForm) => void;
}

// Tipos para o componente GenerateButton
export interface GenerateButtonProps {
    onPress: () => void;
    selectedCount: number;
    label?: string;
    style?: StyleProp<ViewStyle>;
    badgeContainerStyle?: StyleProp<ViewStyle>;
    showBadge?: boolean;
    alwaysVisible?: boolean;
    iconColor?: string;
    disabled?: boolean;
    forceEnabled?: boolean;
    loading?: boolean;
}

// Tipos para o componente Header
export interface HeaderProps {
    title?: string;
    centerTitle?: boolean;
    showSearch?: boolean;
    searchText?: string;
    setSearchText?: (text: string) => void;
    searchPlaceholder?: string;
    showExport?: boolean;
    onExport?: () => void;
    onBack?: () => void;
    rightElement?: ReactNode;
    children?: ReactNode;
    showBackButton?: boolean;
    style?: StyleProp<ViewStyle>;
}
