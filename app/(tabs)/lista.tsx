import {
    Check,
    CheckSquare,
    Trash2
} from "lucide-react-native";
import React, { useState } from "react";
import {
    Alert,
    Platform,
    Pressable,
    ScrollView,
    Text,
    TouchableOpacity,
    View,
} from "react-native";

// Meus imports
import { AddItemCard } from "../../components/AddItemCard";
import { Header } from "../../components/header";
import { Colors, Spacing } from "../../constants/theme";
import { useListaCompras } from "../../hooks/useListaCompras";
import { listaStyles as styles } from "../../styles/lista_styles";
import { exportarListaPendentes } from "../../utils/exportPdf";

// Dados Iniciais
const DATA_INICIAL = [
    { id: "1", name: "Leite Integral", info: "2 Litros", comprado: false },
    { id: "2", name: "Ovos Brancos", info: "12 unidades", comprado: false },
    { id: "3", name: "Tomate", info: "4 unidades", comprado: false },
    { id: "4", name: "Cebola", info: "2 unidades", comprado: false },
    { id: "5", name: "Alface", info: "1 unidade", comprado: false },
];

// Componente Principal
export default function ListaScreen() {
    const {
        pendentes,
        comprados,
        toggleItem,
        removerItem,
        removerComprados,
        marcarTodos,
    } = useListaCompras(DATA_INICIAL);

    const [activeInput, setActiveInput] = useState<string | null>(null);
    const [nomeItem, setNomeItem] = useState("");
    const [quantidade, setQuantidade] = useState("");
    const [unidade, setUnidade] = useState("un");
    const [showUnitPicker, setShowUnitPicker] = useState(false);

    // Funções
    const handleExportPDF = async () => {
        if (pendentes.length === 0) {
            const msg = "A lista está vazia!";
            Platform.OS === "web" ? window.alert(msg) : Alert.alert("Aviso", msg);
            return;
        }
        await exportarListaPendentes(pendentes);
    };

    // Renderização
    return (
        <View style={styles.container}>
            <Header
                title="Lista de Compras"
                centerTitle={false}
                showExport={true}
                onExport={handleExportPDF}
                showSearch={false}
            />

            <ScrollView
                showsVerticalScrollIndicator={false}
                contentContainerStyle={styles.scrollContent}
            >
                {/* CARD DE ADIÇÃO */}
                <AddItemCard
                  label="Novo Item"
                  placeholder="Ex: Arroz, Feijão..."
                  nameValue={nomeItem}
                  onNameChange={setNomeItem}
                  qtyValue={quantidade}
                  onQtyChange={setQuantidade}
                  unitValue={unidade}
                  onUnitChange={setUnidade}
                  onAddPress={() => {
                    if (nomeItem.trim() && quantidade.trim()) {
                      setNomeItem("");
                      setQuantidade("");
                      setUnidade("un");
                      setShowUnitPicker(false);
                    }
                  }}
                  showUnitPicker={showUnitPicker}
                  onToggleUnitPicker={() => setShowUnitPicker(!showUnitPicker)}
                  activeInput={activeInput}
                  onNameFocus={() => setActiveInput("nome")}
                  onNameBlur={() => setActiveInput(null)}
                  onQtyFocus={() => setActiveInput("qtd")}
                  onQtyBlur={() => setActiveInput(null)}
                  styles={styles}
                  iconSize={16}
                />

                {/* SEÇÃO DE ITENS PENDENTES */}
                <TouchableOpacity style={styles.btnActionBulk} onPress={marcarTodos}>
                    <CheckSquare size={18} color={Colors.secondary} />
                    <Text style={styles.btnTextBulk}>Marcar todos como comprados</Text>
                </TouchableOpacity>

                <View style={styles.sectionHeader}>
                    <Text style={styles.sectionTitle}>Itens pendentes</Text>
                    <View style={styles.badgeCount}>
                        <Text style={styles.badgeText}>{pendentes.length}</Text>
                    </View>
                </View>

                {pendentes.map((item) => (
                    <View key={item.id} style={styles.itemCard}>
                        <Pressable
                            onPress={() => toggleItem(item.id)}
                            style={[styles.checkbox, item.comprado && styles.checkboxActive]}
                        >
                            {item.comprado && (
                                <Check size={14} color={Colors.light} strokeWidth={4} />
                            )}
                        </Pressable>

                        <View style={styles.itemInfo}>
                            <Text style={styles.itemName}>{item.name}</Text>
                            <Text style={styles.itemSub}>{item.info}</Text>
                        </View>

                        <TouchableOpacity
                            onPress={() => removerItem(item.id)}
                            style={styles.btnDelete}
                        >
                            <Trash2 size={18} color={Colors.errorDark} />
                        </TouchableOpacity>
                    </View>
                ))}

                {/* SEÇÃO DE ITENS COMPRADOS */}
                {comprados.length > 0 && (
                    <View style={{ marginTop: Spacing.lg }}>
                        <View style={styles.sectionHeader}>
                            <Text style={[styles.sectionTitle, { color: Colors.subtext }]}>
                                Comprados
                            </Text>
                            <TouchableOpacity onPress={removerComprados}>
                                <Text style={styles.clearText}>LIMPAR TUDO</Text>
                            </TouchableOpacity>
                        </View>

                        {comprados.map((item) => (
                            <View
                                key={item.id}
                                style={[styles.itemCard, styles.itemCardComprado]}
                            >
                                <TouchableOpacity
                                    onPress={() => toggleItem(item.id)}
                                    style={[
                                        styles.checkbox,
                                        styles.checkboxActive,
                                        { opacity: 0.5 },
                                    ]}
                                >
                                    <Check size={14} color={Colors.light} strokeWidth={4} />
                                </TouchableOpacity>
                                <View style={styles.itemInfo}>
                                    <Text style={[styles.itemName, styles.nameComprado]}>
                                        {item.name}
                                    </Text>
                                    <Text style={styles.itemSub}>{item.info}</Text>
                                </View>
                            </View>
                        ))}
                    </View>
                )}
            </ScrollView>
        </View>
    );
}
