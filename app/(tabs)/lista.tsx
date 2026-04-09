import { Check, CheckSquare, Trash2 } from "lucide-react-native";
import React, { useState } from "react";
import { Alert, Pressable, ScrollView, Text, TouchableOpacity, View } from "react-native";

// Componentes e Hooks
import { AddItemCard } from "../../components/AddItemCard";
import { Header } from "../../components/header";
import { Colors, Spacing } from "../../constants/theme";
import { useListaCompras } from "../../hooks/useListaCompras";
import { listaStyles as styles } from "../../styles/lista_styles";
import { exportarListaPendentes } from "../../utils/exportPdf";

export default function ListaScreen() {
    // Inicializamos o hook com um array vazio
    const {
        pendentes,
        comprados,
        addItem,
        toggleItem,
        removerItem,
        removerComprados,
        marcarTodos,
    } = useListaCompras([]);

    // Estados locais para controle do formulário de adição
    const [activeInput, setActiveInput] = useState<string | null>(null);
    const [nomeItem, setNomeItem] = useState("");
    const [quantidade, setQuantidade] = useState("");
    const [unidade, setUnidade] = useState("un");
    const [showUnitPicker, setShowUnitPicker] = useState(false);

    // Lógica para adicionar item e limpar campos
    const handleAdd = () => {
        if (!nomeItem.trim() || !quantidade.trim()) {
            return Alert.alert("Atenção", "Preencha o nome e a quantidade do item.");
        }

        addItem(nomeItem, quantidade, unidade);

        // Reset da UI
        setNomeItem("");
        setQuantidade("");
        setUnidade("un");
        setShowUnitPicker(false);
        setActiveInput(null);
    };

    // Exportação da lista atual para PDF
    const handleExportPDF = async () => {
        if (pendentes.length === 0) {
            return Alert.alert("Aviso", "A lista de pendentes está vazia.");
        }
        await exportarListaPendentes(pendentes);
    };

    return (
        <View style={styles.container}>
            <Header
                title="Lista de Compras"
                showExport
                onExport={handleExportPDF}
            />

            <ScrollView
                showsVerticalScrollIndicator={false}
                contentContainerStyle={styles.scrollContent}
            >
                {/* Componente de Input de novo item */}
                <AddItemCard
                    label="Novo Item"
                    placeholder="Ex: Arroz, Feijão..."
                    nameValue={nomeItem}
                    onNameChange={setNomeItem}
                    qtyValue={quantidade}
                    onQtyChange={setQuantidade}
                    unitValue={unidade}
                    onUnitChange={setUnidade}
                    onAddPress={handleAdd}
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

                {/* Ações em Massa */}
                {pendentes.length > 0 && (
                    <TouchableOpacity style={styles.btnActionBulk} onPress={marcarTodos}>
                        <CheckSquare size={18} color={Colors.secondary} />
                        <Text style={styles.btnTextBulk}>Marcar todos como comprados</Text>
                    </TouchableOpacity>
                )}

                {/* Listagem: Pendentes */}
                <View style={styles.sectionHeader}>
                    <Text style={styles.sectionTitle}>Itens pendentes</Text>
                    <View style={styles.badgeCount}>
                        <Text style={styles.badgeText}>{pendentes.length}</Text>
                    </View>
                </View>

                {pendentes.length === 0 && !comprados.length && (
                    <Text style={{ color: Colors.subtext, textAlign: 'center', marginTop: 20 }}>
                        Sua lista está vazia. Adicione itens acima!
                    </Text>
                )}

                {pendentes.map((item) => (
                    <View key={item.id} style={styles.itemCard}>
                        <Pressable
                            onPress={() => toggleItem(item.id)}
                            style={[styles.checkbox, item.comprado && styles.checkboxActive]}
                        >
                            {item.comprado && <Check size={14} color={Colors.light} strokeWidth={4} />}
                        </Pressable>

                        <View style={styles.itemInfo}>
                            <Text style={styles.itemName}>{item.name}</Text>
                            <Text style={styles.itemSub}>{item.info}</Text>
                        </View>

                        <TouchableOpacity onPress={() => removerItem(item.id)} style={styles.btnDelete}>
                            <Trash2 size={18} color={Colors.errorDark} />
                        </TouchableOpacity>
                    </View>
                ))}

                {/* Listagem: Comprados */}
                {comprados.length > 0 && (
                    <View style={{ marginTop: Spacing.lg }}>
                        <View style={styles.sectionHeader}>
                            <Text style={[styles.sectionTitle, { color: Colors.subtext }]}>Comprados</Text>
                            <TouchableOpacity onPress={removerComprados}>
                                <Text style={styles.clearText}>LIMPAR TUDO</Text>
                            </TouchableOpacity>
                        </View>

                        {comprados.map((item) => (
                            <View key={item.id} style={[styles.itemCard, styles.itemCardComprado]}>
                                <TouchableOpacity
                                    onPress={() => toggleItem(item.id)}
                                    style={[styles.checkbox, styles.checkboxActive, { opacity: 0.5 }]}
                                >
                                    <Check size={14} color={Colors.light} strokeWidth={4} />
                                </TouchableOpacity>

                                <View style={styles.itemInfo}>
                                    <Text style={[styles.itemName, styles.nameComprado]}>{item.name}</Text>
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