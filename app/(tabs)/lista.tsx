import { Check, FileDown, Share2, Trash2, Wand2 } from "lucide-react-native";
import React, { useState } from "react";
import {
    ActivityIndicator, Alert, ScrollView, Text, TouchableOpacity, View
} from "react-native";

import { AddItemCard } from "../../components/AddItemCard";
import { Header } from "../../components/header";
import { Colors } from "../../constants/theme";
import { useListaCompras } from "../../hooks/useListaCompras";
import { listaStyles as styles } from "../../styles/lista_styles";
import { exportarListaPendentes } from "../../utils/exportPdf";

export default function ListaScreen() {
    const {
        pendentes, comprados, isLoading,
        addItem, gerarListaDaDispensa, toggleItem, removerItem, limparComprados
    } = useListaCompras();

    // Estados locais controlados
    const [nomeItem, setNomeItem] = useState("");
    const [quantidade, setQuantidade] = useState("");
    const [unidade, setUnidade] = useState("un");
    const [showUnitPicker, setShowUnitPicker] = useState(false);
    const [activeInput, setActiveInput] = useState<string | null>(null);

    const handleAddManual = () => {
        if (!nomeItem.trim() || !quantidade.trim()) {
            return Alert.alert("Atenção", "Preencha nome e quantidade.");
        }
        addItem(nomeItem, quantidade, unidade);
        setNomeItem(""); setQuantidade(""); setUnidade("un");
        setActiveInput(null);
    };

    return (
        <View style={{ flex: 1, backgroundColor: Colors.background }}>
            <Header 
                title="Lista de Compras" 
                centerTitle 
                // Alterado de rightIcons para rightElement conforme o padrão do projeto
                rightElement={
                    <View style={{ flexDirection: 'row', gap: 15 }}>
                        <TouchableOpacity onPress={() => exportarListaPendentes(pendentes)}>
                            <FileDown size={24} color={Colors.primary} />
                        </TouchableOpacity>
                        <TouchableOpacity onPress={() => {/* lógica de share */}}>
                            <Share2 size={24} color={Colors.primary} />
                        </TouchableOpacity>
                    </View>
                }
            />

            <ScrollView contentContainerStyle={styles.scrollContent} keyboardShouldPersistTaps="handled">
                
                <AddItemCard 
                    label="Adicionar item"
                    placeholder="Ex: Tomate"
                    nameValue={nomeItem}
                    onNameChange={setNomeItem}
                    qtyValue={quantidade}
                    onQtyChange={setQuantidade}
                    unitValue={unidade}
                    onUnitChange={setUnidade}
                    onAddPress={handleAddManual}
                    showUnitPicker={showUnitPicker}
                    onToggleUnitPicker={() => setShowUnitPicker(!showUnitPicker)}
                    activeInput={activeInput}
                    onNameFocus={() => setActiveInput("nome")}
                    onNameBlur={() => setActiveInput(null)}
                    onQtyFocus={() => setActiveInput("qtd")}
                    onQtyBlur={() => setActiveInput(null)}
                    styles={styles}
                />

                <TouchableOpacity 
                    onPress={gerarListaDaDispensa}
                    style={styles.magicButton}
                >
                    <Wand2 size={20} color={Colors.light} />
                    <Text style={styles.magicButtonText}>Completar via Dispensa</Text>
                </TouchableOpacity>

                {isLoading ? (
                    <ActivityIndicator color={Colors.primary} style={{ marginTop: 20 }} />
                ) : (
                    <>
                        <Text style={styles.sectionTitle}>Para Comprar ({pendentes.length})</Text>
                        
                        {pendentes.map((item) => (
                            <View key={item.id} style={styles.itemCard}>
                                <TouchableOpacity onPress={() => toggleItem(item.id)} style={styles.checkbox} />
                                <View style={styles.itemInfo}>
                                    <Text style={styles.itemName}>{item.nome}</Text>
                                    <Text style={styles.itemSub}>{item.quantidade_comprar} {item.unidade}</Text>
                                </View>
                                <TouchableOpacity onPress={() => removerItem(item.id)}>
                                    <Trash2 size={18} color={Colors.primary} />
                                </TouchableOpacity>
                            </View>
                        ))}

                        {comprados.length > 0 && (
                            <View style={{ marginTop: 30 }}>
                                <View style={styles.sectionHeader}>
                                    <Text style={styles.sectionTitleOff}>Histórico Comprado</Text>
                                    <TouchableOpacity onPress={limparComprados}>
                                        <Text style={styles.clearText}>LIMPAR TUDO</Text>
                                    </TouchableOpacity>
                                </View>
                                {comprados.map((item) => (
                                    <View key={item.id} style={[styles.itemCard, { opacity: 0.5 }]}>
                                        <TouchableOpacity onPress={() => toggleItem(item.id)} style={styles.checkboxActive}>
                                            <Check size={12} color={Colors.light} />
                                        </TouchableOpacity>
                                        <Text style={[styles.itemName, { textDecorationLine: 'line-through' }]}>{item.nome}</Text>
                                    </View>
                                ))}
                            </View>
                        )}
                    </>
                )}
            </ScrollView>
        </View>
    );
}