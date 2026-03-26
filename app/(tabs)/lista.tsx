import React, { useState } from 'react';
import { View, Text, ScrollView, TextInput, TouchableOpacity, Alert, Platform, Pressable } from 'react-native';
import { Plus, Check, Trash2, ChevronDown, CheckSquare } from 'lucide-react-native';

// Importações de Estilo e Componentes
import { Header } from '../../components/header';
import { listaStyles as styles } from '../../styles/lista_styles';
import { Colors, Spacing } from '../../constants/theme';
import { useListaCompras } from '../../hooks/useListaCompras';
import { exportarListaPendentes } from '../../utils/exportPdf';

// Dados Iniciais
const DATA_INICIAL = [
    { id: '1', name: 'Leite Integral', info: '2 Litros', comprado: false },
    { id: '2', name: 'Ovos Brancos', info: '12 unidades', comprado: false },
    { id: '3', name: 'Tomate', info: '4 unidades', comprado: false },
    { id: '4', name: 'Cebola', info: '2 unidades', comprado: false },
    { id: '5', name: 'Alface', info: '1 unidade', comprado: false },
];

// Componente Principal
export default function ListaScreen() {
    const {
        pendentes,
        comprados,
        toggleItem,
        removerItem,
        removerComprados,
        marcarTodos
    } = useListaCompras(DATA_INICIAL);

    const [activeInput, setActiveInput] = useState<string | null>(null);
    const [nomeItem, setNomeItem] = useState('');
    const [quantidade, setQuantidade] = useState('');

    // Funções
    const handleExportPDF = async () => {
        if (pendentes.length === 0) {
            const msg = "A lista está vazia!";
            Platform.OS === 'web' ? window.alert(msg) : Alert.alert("Aviso", msg);
            return;
        }
        await exportarListaPendentes(pendentes);
    };

    return (
        <View style={styles.container}>
            <Header
                title="Lista de Compras"
                centerTitle={false}
                showExport={true}
                onExport={handleExportPDF}
                showSearch={false}
            />

            <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
                {/* CARD DE ADIÇÃO */}
                <View style={styles.addCard}>
                    <Text style={styles.sectionLabel}>Novo Item</Text>
                    <TextInput
                        placeholder="Ex: Arroz, Feijão..."
                        placeholderTextColor={Colors.subtext + '80'}
                        value={nomeItem}
                        onChangeText={setNomeItem}
                        onFocus={() => setActiveInput('nome')}
                        onBlur={() => setActiveInput(null)}
                        style={[styles.inputBase, styles.inputFull, activeInput === 'nome' && styles.inputFocused]}
                    />

                    <View style={styles.row}>
                        <View style={styles.inputField}>
                            <TextInput
                                placeholder="Qtd"
                                value={quantidade}
                                onChangeText={setQuantidade}
                                keyboardType="numeric"
                                onFocus={() => setActiveInput('qtd')}
                                onBlur={() => setActiveInput(null)}
                                style={[styles.inputBase, activeInput === 'qtd' && styles.inputFocused]}
                            />
                        </View>

                        <TouchableOpacity style={styles.pickerMock} activeOpacity={0.8}>
                            <Text style={styles.pickerText}>un</Text>
                            <ChevronDown size={16} color={Colors.dark} />
                        </TouchableOpacity>

                        <TouchableOpacity
                            style={styles.btnAdd}
                            activeOpacity={0.7}
                            onPress={() => { setNomeItem(''); setQuantidade(''); }}
                        >
                            <Plus size={22} color={Colors.light} />
                        </TouchableOpacity>
                    </View>
                </View>

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

                {pendentes.map(item => (
                    <View key={item.id} style={styles.itemCard}>
                        <Pressable onPress={() => toggleItem(item.id)} style={[styles.checkbox, item.comprado && styles.checkboxActive]}>
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

                {/* SEÇÃO DE ITENS COMPRADOS */}
                {comprados.length > 0 && (
                    <View style={{ marginTop: Spacing.lg }}>
                        <View style={styles.sectionHeader}>
                            <Text style={[styles.sectionTitle, { color: Colors.subtext }]}>Comprados</Text>
                            <TouchableOpacity onPress={removerComprados}>
                                <Text style={styles.clearText}>LIMPAR TUDO</Text>
                            </TouchableOpacity>
                        </View>

                        {comprados.map(item => (
                            <View key={item.id} style={[styles.itemCard, styles.itemCardComprado]}>
                                <TouchableOpacity onPress={() => toggleItem(item.id)} style={[styles.checkbox, styles.checkboxActive, { opacity: 0.5 }]}>
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