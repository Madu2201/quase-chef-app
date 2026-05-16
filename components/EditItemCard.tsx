import { X } from "lucide-react-native";
import React from "react";
import {
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from "react-native";
import { UNIDADES_ACEITAS } from "../constants/ingredients";
import { Colors } from "../constants/theme";

interface EditItemCardProps {
  isListMode?: boolean;
  onSave: (form: { name: string; qty: string; ideal_qty: string; unit: string }) => void;
  onClose: () => void;
  styles: any;
  renderUnitPicker: (
    units: string[],
    activeUnit: string,
    onSelect: (unit: string) => void,
    onClose: () => void,
  ) => React.ReactNode;
  showUnitPicker: boolean;
  setShowUnitPicker: (show: boolean) => void;
  editForm: {
    name: string;
    qty: string;
    ideal_qty: string;
    unit: string;
  };
  setEditForm: (form: any) => void;
}

export const EditItemCard: React.FC<EditItemCardProps> = ({
  isListMode = false,
  onSave,
  onClose,
  styles,
  renderUnitPicker,
  showUnitPicker,
  setShowUnitPicker,
  editForm,
  setEditForm,
}) => {
  return (
    <View style={styles.editingContainer}>
      <View style={styles.editingHeader}>
        <Text style={styles.editingTitle}>
          {isListMode ? "Editar Quantidade" : "Editar Ingrediente"}
        </Text>
        <TouchableOpacity
          onPress={onClose}
          style={styles.editingCloseButton}
        >
          <X size={20} color={Colors.subtext} />
        </TouchableOpacity>
      </View>

      {!isListMode && (
        <TextInput
          style={[
            styles.editingNameInput,
            styles.fontSystem,
          ]}
          value={editForm.name}
          onChangeText={(t) =>
            setEditForm({ ...editForm, name: t })
          }
        />
      )}

      <View style={styles.editingFieldsRow}>
        <View style={styles.editingField}>
          <Text style={styles.editingFieldLabel}>
            {isListMode ? "Qtd" : "Atual"}
          </Text>
          <TextInput
            style={[
              styles.editingFieldInput,
              styles.fontSystem,
            ]}
            keyboardType="numeric"
            value={editForm.qty}
            onChangeText={(t) =>
              setEditForm({ ...editForm, qty: t })
            }
          />
        </View>
        
        {!isListMode && (
          <View style={styles.editingField}>
            <Text style={styles.editingFieldLabel}>Meta</Text>
            <TextInput
              style={[
                styles.editingFieldInput,
                styles.fontSystem,
              ]}
              keyboardType="numeric"
              value={editForm.ideal_qty}
              onChangeText={(t) =>
                setEditForm({ ...editForm, ideal_qty: t })
              }
            />
          </View>
        )}

        <View style={styles.editingField}>
          <Text style={styles.editingFieldLabel}>Unid.</Text>
          <TouchableOpacity
            style={[
              styles.editingFieldInput,
              styles.editingUnitButton,
            ]}
            onPress={() => setShowUnitPicker(!showUnitPicker)}
          >
            <Text style={[styles.editingUnitText, styles.fontSystem]}>
              {editForm.unit}
            </Text>
          </TouchableOpacity>
        </View>
      </View>

      {showUnitPicker &&
        renderUnitPicker(
          UNIDADES_ACEITAS,
          editForm.unit,
          (unit) => setEditForm({ ...editForm, unit }),
          () => setShowUnitPicker(false),
        )}

      <TouchableOpacity
        onPress={() => onSave(editForm)}
        style={styles.editingSaveButton}
      >
        <Text style={styles.editingSaveButtonText}>
          Salvar Alterações
        </Text>
      </TouchableOpacity>
    </View>
  );
};
