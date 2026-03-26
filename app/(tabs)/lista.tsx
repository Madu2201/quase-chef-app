import React, { useState } from 'react';
import { View, Text, ScrollView, TextInput, TouchableOpacity, Alert, Platform } from 'react-native';
import { Plus, Check, Trash2, ChevronDown, CheckSquare } from 'lucide-react-native';

// Importações de Estilo e Componentes
import { Header } from '../../components/header';
import { listaStyles as styles } from '../../styles/lista_styles';
import { Colors, Spacing } from '../../constants/theme';

// Hooks e Utilitários
import { useListaCompras } from '../../hooks/useListaCompras';
import { exportarListaPendentes } from '../../utils/exportPdf';

const DATA_INICIAL = [
    { id: '1', name: 'Leite Integral', info: '2 Litros', comprado: false },
    { id: '2', name: 'Ovos Brancos', info: '12 unidades', comprado: false },
    { id: '3', name: 'Pão de Forma', info: '1 pacote', comprado: false },
];

// Função Principal
export default function ListaScreen() {
    const {
        pendentes,
        comprados,
        toggleItem,
        removerItem,
        removerComprados,
        marcarTodos
    } = useListaCompras(DATA_INICIAL);

    // Estados de Controle
    const [activeInput, setActiveInput] = useState<string | null>(null);
    const [nomeItem, setNomeItem] = useState('');
    const [quantidade, setQuantidade] = useState('');

    // Função para Exportação de PDF/Compartilhamento
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
            >
                {/* FORMULÁRIO DE ENTRADA */}
                <View style={styles.addFormContainer}>
                    <Text style={styles.inputLabel}>Adicionar Novo Item</Text>

                    <TextInput
                        placeholder="Ex: Arroz, Feijão..."
                        placeholderTextColor={Colors.subtext + '80'}
                        value={nomeItem}
                        onChangeText={setNomeItem}
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
                                value={quantidade}
                                onChangeText={setQuantidade}
                                keyboardType="numeric"
                                onFocus={() => setActiveInput('qtd')}
                                onBlur={() => setActiveInput(null)}
                                style={[
                                    styles.inputBase,
                                    styles.inputSmall,
                                    activeInput === 'qtd' && styles.inputFocused
                                ]}
                            />
                        </View>

                        <View style={[styles.inputField, { flex: 1.5 }]}>
                            <Text style={styles.inputLabel}>Unidade</Text>
                            <TouchableOpacity style={styles.pickerMock} activeOpacity={0.8}>
                                <Text style={{ color: Colors.dark }}>un</Text>
                                <ChevronDown size={18} color={Colors.dark} />
                            </TouchableOpacity>
                        </View>

                        <TouchableOpacity
                            style={styles.plusBtn}
                            activeOpacity={0.7}
                            onPress={() => {
                                console.log('Adicionar:', nomeItem, quantidade);
                                setNomeItem(''); setQuantidade('');
                            }}
                        >
                            <Plus size={28} color={Colors.light} />
                        </TouchableOpacity>
                    </View>
                </View>
            </Header>

            <ScrollView
                showsVerticalScrollIndicator={false}
                contentContainerStyle={styles.scrollContent}
            >
                {/* AÇÕES EM MASSA */}
                <View style={styles.actionRow}>
                    <TouchableOpacity style={[styles.btnAction, styles.btnOutline]} onPress={marcarTodos}>
                        <CheckSquare size={18} color={Colors.secondary} />
                        <Text style={styles.btnTextOutline}>Marcar todos como comprados</Text>
                    </TouchableOpacity>
                </View>

                {/* SEÇÃO: PENDENTES */}
                <View style={styles.sectionHeader}>
                    <Text style={styles.sectionTitle}>Itens pendentes</Text>
                    <Text style={styles.itemCount}>{pendentes.length} ITENS</Text>
                </View>

                {pendentes.length === 0 ? (
                    <View style={{ padding: 40, alignItems: 'center' }}>
                        <Text style={{ color: Colors.subtext, textAlign: 'center', fontStyle: 'italic' }}>
                            Sua lista de pendentes está vazia.{"\n"}Adicione algo novo acima!
                        </Text>
                    </View>
                ) : (
                    pendentes.map(item => (
                        <View key={item.id} style={styles.itemCard}>
                            <TouchableOpacity onPress={() => toggleItem(item.id)} style={styles.checkbox}>
                                {item.comprado && <Check size={16} color={Colors.secondary} />}
                            </TouchableOpacity>

                            <View style={styles.itemInfo}>
                                <Text style={styles.itemName}>{item.name}</Text>
                                <Text style={styles.itemSub}>{item.info}</Text>
                            </View>

                            <TouchableOpacity onPress={() => removerItem(item.id)}>
                                <Trash2 size={18} color={Colors.subtext} opacity={0.5} />
                            </TouchableOpacity>
                        </View>
                    ))
                )}

                {/* SEÇÃO: COMPRADOS */}
                {comprados.length > 0 && (
                    <View style={{ marginTop: Spacing.xl }}>
                        {/* Agora usando View com o estilo de cabeçalho padronizado */}
                        <View style={styles.sectionHeader}>
                            <Text style={[styles.sectionTitle, { color: Colors.subtext }]}>
                                Comprados
                            </Text>

                            <TouchableOpacity onPress={removerComprados} activeOpacity={0.6}>
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