import React, { useState } from 'react';
import { View, Text, ScrollView, TextInput, TouchableOpacity } from 'react-native';
import { Plus, Check, Trash2, ChevronDown, CheckSquare } from 'lucide-react-native';

// Importações do Projeto
import { Header } from '../../components/header';
import { listaStyles as styles } from '../../styles/lista_styles';
import { Colors, Spacing } from '../../constants/theme';
import { useListaCompras } from '../../hooks/useListaCompras';

// Dados iniciais para a lista
const DATA_INICIAL = [
    { id: '1', name: 'Leite Integral', info: '2 Litros', comprado: false },
    { id: '2', name: 'Ovos Brancos', info: '12 unidades', comprado: false },
    { id: '3', name: 'Pão de Forma', info: '1 pacote (Integral)', comprado: false },
];

// Tela principal da Lista de Compras
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

    // Função para exportar a lista
    const handleExport = () => {
        console.log("Exportando lista...");
    };

    return (
        <View style={styles.container}>
            <Header
                title="Lista de Compras"
                showExport={true}
                onExport={handleExport}
                showSearch={false}
            >
                {/* Formulário de Adição de Itens (Children) */}
                <View style={styles.addFormContainer}>
                    <Text style={styles.inputLabel}>Adicionar Novo Item</Text>
                    <TextInput
                        placeholder="Ex: Arroz, Feijão..."
                        placeholderTextColor={Colors.subtext}
                        onFocus={() => setActiveInput('nome')}
                        onBlur={() => setActiveInput(null)}
                        style={[
                            styles.inputBase,
                            styles.inputFull,
                            activeInput === 'nome' && styles.inputFocused
                        ]}
                    />

                    <View style={styles.row}>
                        <View style={styles.inputField}>
                            <Text style={styles.inputLabel}>Qtd</Text>
                            <TextInput
                                placeholder="1"
                                style={[
                                    styles.inputBase,
                                    styles.inputSmall,
                                    activeInput === 'qtd' && styles.inputFocused
                                ]}
                                keyboardType="numeric"
                                placeholderTextColor={Colors.subtext}
                                onFocus={() => setActiveInput('qtd')}
                                onBlur={() => setActiveInput(null)}
                            />
                        </View>

                        <View style={[styles.inputField, { flex: 1.5 }]}>
                            <Text style={styles.inputLabel}>Unidade</Text>
                            <TouchableOpacity style={styles.pickerMock} activeOpacity={0.8}>
                                <Text style={{ color: Colors.dark }}>un</Text>
                                <ChevronDown size={18} color={Colors.dark} />
                            </TouchableOpacity>
                        </View>

                        <TouchableOpacity style={styles.plusBtn} activeOpacity={0.7}>
                            <Plus size={28} color={Colors.light} />
                        </TouchableOpacity>
                    </View>
                </View>
            </Header>

            <ScrollView
                showsVerticalScrollIndicator={false}
                contentContainerStyle={styles.scrollContent}
            >
                {/* Ações Rápidas */}
                <View style={styles.actionRow}>
                    <TouchableOpacity style={[styles.btnAction, styles.btnOutline]} onPress={marcarTodos}>
                        <CheckSquare size={18} color={Colors.secondary} />
                        <Text style={styles.btnTextOutline}>Marcar todos como comprados</Text>
                    </TouchableOpacity>
                </View>

                {/* Seção de Pendentes */}
                <View style={styles.sectionHeader}>
                    <Text style={styles.sectionTitle}>Itens pendentes</Text>
                    <Text style={styles.itemCount}>{pendentes.length} ITENS</Text>
                </View>

                {pendentes.map(item => (
                    <View key={item.id} style={styles.itemCard}>
                        <TouchableOpacity onPress={() => toggleItem(item.id)} style={styles.checkbox}>
                            {item.comprado && <Check size={16} color={Colors.secondary} />}
                        </TouchableOpacity>

                        <View style={styles.itemInfo}>
                            <Text style={styles.itemName}>{item.name}</Text>
                            <Text style={styles.itemSub}>{item.info}</Text>
                        </View>

                        <TouchableOpacity onPress={() => removerItem(item.id)} activeOpacity={0.5}>
                            <Trash2 size={18} color={Colors.subtext} opacity={0.5} />
                        </TouchableOpacity>
                    </View>
                ))}

                {/* Seção de Comprados */}
                {comprados.length > 0 && (
                    <>
                        <View style={[styles.sectionHeader, { marginTop: Spacing.xl }]}>
                            <Text style={[styles.sectionTitle, { color: Colors.subtext }]}>Comprados</Text>
                            <TouchableOpacity onPress={removerComprados}>
                                <Text style={styles.removeCompradosText}>LIMPAR TUDO</Text>
                            </TouchableOpacity>
                        </View>

                        {comprados.map(item => (
                            <View key={item.id} style={[styles.itemCard, styles.itemCardComprado]}>
                                <TouchableOpacity
                                    onPress={() => toggleItem(item.id)}
                                    style={[styles.checkbox, styles.checkboxChecked]}
                                >
                                    <Check size={16} color={Colors.light} />
                                </TouchableOpacity>

                                <View style={styles.itemInfo}>
                                    <Text style={[styles.itemName, styles.nameComprado]}>{item.name}</Text>
                                    <Text style={styles.itemSub}>{item.info}</Text>
                                </View>
                            </View>
                        ))}
                    </>
                )}
            </ScrollView>
        </View>
    );
}