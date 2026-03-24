import React, { useState } from 'react';
import { View, Text, ScrollView, TextInput, TouchableOpacity } from 'react-native';
import { Share2, Upload, Plus, Check, Trash2, ChevronDown, CheckSquare } from 'lucide-react-native';
import { listaStyles as styles } from '../../styles/lista_styles';
import { Colors, Spacing } from '../../constants/theme';
import { useListaCompras } from '../../hooks/useListaCompras';

const DATA_INICIAL = [
    { id: '1', name: 'Leite Integral', info: '2 Litros', comprado: false },
    { id: '2', name: 'Ovos Brancos', info: '12 unidades', comprado: false },
    { id: '3', name: 'Pão de Forma', info: '1 pacote (Integral)', comprado: false },
];

export default function ListaScreen() {
    const {
        pendentes,
        comprados,
        toggleItem,
        removerItem,
        removerComprados,
        marcarTodos
    } = useListaCompras(DATA_INICIAL);

    // Controle de Foco dos Inputs
    const [activeInput, setActiveInput] = useState<string | null>(null);

    return (
        <View style={styles.container}>

            {/* Header com Formulário Integrado */}
            <View style={styles.header}>
                <View style={styles.headerTop}>
                    <Text style={styles.title}>Lista de Compras</Text>
                    <TouchableOpacity style={styles.exportBtn} activeOpacity={0.7}>
                        <Upload size={16} color={Colors.secondary} />
                        <Text style={styles.exportText}>Exportar</Text>
                        <Share2 size={16} color={Colors.secondary} />
                    </TouchableOpacity>
                </View>

                {/* Formulário de Adição */}
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
                        {/* Campo Quantidade */}
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

                        {/* Campo Unidade */}
                        <View style={[styles.inputField, { flex: 1.5 }]}>
                            <Text style={styles.inputLabel}>Unidade</Text>
                            <TouchableOpacity style={styles.pickerMock} activeOpacity={0.8}>
                                <Text style={{ color: Colors.dark }}>un</Text>
                                <ChevronDown size={18} color={Colors.dark} />
                            </TouchableOpacity>
                        </View>

                        {/* Botão Plus */}
                        <TouchableOpacity style={styles.plusBtn} activeOpacity={0.7}>
                            <Plus size={28} color={Colors.light} />
                        </TouchableOpacity>
                    </View>
                </View>
            </View>

            {/* Listagem principal */}
            <ScrollView
                showsVerticalScrollIndicator={false}
                contentContainerStyle={{ paddingTop: Spacing.md, paddingBottom: 100 }}
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