import { router } from "expo-router";
import { Check, ChevronDown, Trash2 } from "lucide-react-native";
import React, { useState } from "react";
import {
  ActivityIndicator,
  Alert,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

import { AddItemCard } from "../../components/AddItemCard";
import { GenerateButton } from "../../components/generate_button";
import { Header } from "../../components/header";
import { UNIDADES_ACEITAS } from "../../constants/ingredients";
import { Colors } from "../../constants/theme";
import { useDispensa } from "../../hooks/useDispensa";
import { dispensaStyles as styles } from "../../styles/dispensa_styles";
import { validarQuantidade } from "../../utils/validation";

export default function DispensaScreen() {
  const {
    filteredIngredients,
    searchText,
    setSearchText,
    addIngredient,
    toggleIngredient,
    removeIngredient,
    editIngredient,
    selectedCount,
    isLoading,
  } = useDispensa();

  // Estados locais para criação e UI de edição
  const [nomeNovo, setNomeNovo] = useState("");
  const [qtdNova, setQtdNova] = useState("");
  const [unidadeNova, setUnidadeNova] = useState("un");
  const [showUnitPicker, setShowUnitPicker] = useState(false);
  const [activeInput, setActiveInput] = useState<string | null>(null);
  const [editValue, setEditValue] = useState("");

  // Adicionar ingrediente
  const handleAdd = async () => {
    if (!nomeNovo.trim() || !qtdNova.trim()) {
      return Alert.alert("Atenção", "Preencha o nome e a quantidade.");
    }

    const valid = validarQuantidade(qtdNova);
    if (!valid.valido) return Alert.alert("Atenção", valid.erro);

    try {
      await addIngredient(nomeNovo, qtdNova, unidadeNova);
      setNomeNovo("");
      setQtdNova("");
      setUnidadeNova("un");
      setShowUnitPicker(false);
    } catch (e) {
      Alert.alert("Erro", "Falha ao adicionar ingrediente.");
    }
  };

  // Salvar edição de quantidade
  const handleSaveQty = (id: string) => {
    if (editValue.trim() === "") return setActiveInput(null);
    const valid = validarQuantidade(editValue);
    if (!valid.valido) return Alert.alert("Atenção", valid.erro);

    editIngredient(id, "quantidade", editValue);
    setActiveInput(null);
  };

  return (
    <View style={styles.container}>
      <Header
        title="Sua Dispensa"
        centerTitle
        searchText={searchText}
        setSearchText={setSearchText}
        searchPlaceholder="Buscar na dispensa..."
      />

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* --- Card de Adição --- */}
        <AddItemCard
          label="Novo Ingrediente"
          placeholder="Ex: Tomate, Arroz..."
          nameValue={nomeNovo}
          onNameChange={setNomeNovo}
          qtyValue={qtdNova}
          onQtyChange={setQtdNova}
          unitValue={unidadeNova}
          onUnitChange={setUnidadeNova}
          onAddPress={handleAdd}
          showUnitPicker={showUnitPicker}
          onToggleUnitPicker={() => setShowUnitPicker(!showUnitPicker)}
          activeInput={activeInput}
          onNameFocus={() => setActiveInput("nome")}
          onNameBlur={() => setActiveInput(null)}
          onQtyFocus={() => setActiveInput("qtd")}
          onQtyBlur={() => setActiveInput(null)}
          styles={styles}
          iconSize={18}
        />

        {/* --- Título da Seção de Itens Disponíveis --- */}
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Ingredientes Disponíveis</Text>
        </View>

        {/* --- Lista de Ingredientes --- */}
        {isLoading ? (
          <ActivityIndicator
            size="large"
            color={Colors.secondary}
            style={{ marginTop: 20 }}
          />
        ) : filteredIngredients.length === 0 ? (
          <Text style={styles.emptyText}>
            {searchText
              ? "Nenhum resultado para a busca."
              : "Sua dispensa está vazia."}
          </Text>
        ) : (
          filteredIngredients.map((item) => (
            <View key={item.id} style={{ marginBottom: 8 }}>
              <View
                style={[
                  styles.ingredientItem,
                  !item.selected && { opacity: 0.6 },
                ]}
              >
                <TouchableOpacity
                  onPress={() => toggleIngredient(item.id)}
                  style={[
                    styles.checkbox,
                    item.selected && styles.checkboxActive,
                  ]}
                >
                  {item.selected && (
                    <Check size={14} color={Colors.light} strokeWidth={3} />
                  )}
                </TouchableOpacity>

                <View style={styles.ingredientInfo}>
                  <Text style={styles.ingredientName}>{item.name}</Text>
                  <View style={styles.controlsRow}>
                    {activeInput === `${item.id}-qty` ? (
                      <TextInput
                        style={styles.inlineInput}
                        value={editValue}
                        onChangeText={setEditValue}
                        keyboardType="numeric"
                        autoFocus
                        onBlur={() => handleSaveQty(item.id)}
                        onSubmitEditing={() => handleSaveQty(item.id)}
                      />
                    ) : (
                      <TouchableOpacity
                        style={styles.listInputQtyWrap}
                        onPress={() => {
                          setEditValue(item.qty);
                          setActiveInput(`${item.id}-qty`);
                        }}
                      >
                        <Text style={styles.listInputQtyText}>{item.qty}</Text>
                      </TouchableOpacity>
                    )}

                    <TouchableOpacity
                      style={styles.listPickerUnit}
                      onPress={() =>
                        setActiveInput(
                          activeInput === `${item.id}-unit`
                            ? null
                            : `${item.id}-unit`,
                        )
                      }
                    >
                      <Text style={styles.unitText}>{item.unit}</Text>
                      <ChevronDown size={12} color={Colors.subtext} />
                    </TouchableOpacity>
                  </View>

                  {/* Seletor de Unidade Inline - Dentro do Card */}
                  {activeInput === `${item.id}-unit` && (
                    <View style={styles.inlineUnitPanel}>
                      {UNIDADES_ACEITAS.map((u) => (
                        <TouchableOpacity
                          key={u}
                          style={[
                            styles.inlineUnitChip,
                            item.unit === u && styles.inlineUnitChipActive,
                          ]}
                          onPress={() => {
                            editIngredient(item.id, "unidade", u);
                            setActiveInput(null);
                          }}
                        >
                          <Text
                            style={[
                              styles.inlineUnitText,
                              item.unit === u && styles.inlineUnitTextActive,
                            ]}
                          >
                            {u}
                          </Text>
                        </TouchableOpacity>
                      ))}
                    </View>
                  )}
                </View>

                <TouchableOpacity
                  onPress={() => removeIngredient(item.id)}
                  style={styles.deleteButton}
                >
                  <Trash2 size={20} color={"#E53E3E"} />
                </TouchableOpacity>
              </View>
            </View>
          ))
        )}
      </ScrollView>

      <GenerateButton
        selectedCount={selectedCount}
        onPress={() =>
          selectedCount > 0
            ? router.push("/selecao_ia")
            : Alert.alert("Atenção", "Selecione ingredientes!")
        }
        style={styles.floatingBtn}
      />
    </View>
  );
}
