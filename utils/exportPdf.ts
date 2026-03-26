import * as Print from 'expo-print';
import * as Sharing from 'expo-sharing';
import { Platform } from 'react-native';
import { Colors, Spacing } from '../constants/theme';

/**
 * Exporta a lista de itens para PDF (Mobile) ou Impressão/HTML (Web)
 * Utiliza o branding "Quase Chef" e as definições do theme.ts
 */
export const exportarListaPendentes = async (itens: any[]) => {
    const dataAtual = new Date().toLocaleDateString('pt-BR');
    const paddingPx = `${Spacing.lg}px`;

    // Gera as linhas da tabela/lista
    const rows = itens.map(item => `
        <div style="display: flex; justify-content: space-between; padding: ${Spacing.md}px 0; border-bottom: 1px solid #F0F0F0; align-items: center;">
            <div style="display: flex; align-items: center;">
                <span style="color: ${Colors.secondary}; margin-right: ${Spacing.sm}px; font-size: 20px;">•</span>
                <span style="font-size: 16px; font-weight: 600; color: ${Colors.dark};">${item.name}</span>
            </div>
            <span style="font-size: 13px; color: ${Colors.subtext}; font-style: italic;">${item.info || ''}</span>
        </div>
    `).join('');

    // Template HTML Principal
    const htmlContent = `
        <div style="padding: ${paddingPx}; font-family: sans-serif; display: flex; flex-direction: column; min-height: 94vh; background-color: white;">
            
            <div style="border-bottom: 3px solid ${Colors.primary}; padding-bottom: ${Spacing.sm}px; margin-bottom: ${Spacing.lg}px; display: flex; justify-content: space-between; align-items: flex-end;">
                <h1 style="margin: 0; color: ${Colors.primary}; font-size: 24px; text-transform: uppercase;">Lista de Compras</h1>
                <span style="font-size: 12px; color: ${Colors.subtext};">Gerado em ${dataAtual}</span>
            </div>

            <div style="flex: 1;">${rows}</div>

            <div style="margin-top: ${Spacing.xl}px; border-top: 1px solid #EEE; padding-top: ${Spacing.md}px; text-align: center;">
                <p style="margin: 0; font-size: 14px; font-weight: 700; color: ${Colors.primary};">Quase Chef</p>
                <p style="margin: 2px 0; font-size: 10px; color: ${Colors.subtext}; text-transform: uppercase; letter-spacing: 1px;">Organização e Praticidade</p>
                <div style="margin-top: 8px; height: 3px; width: 30px; background-color: ${Colors.secondary}; margin-left: auto; margin-right: auto; border-radius: 2px;"></div>
            </div>
        </div>
    `;

    if (Platform.OS === 'web') {
        handleWebExport(htmlContent);
    } else {
        await handleMobileExport(htmlContent);
    }
};

/**
 * Lógica para Web: Injeta num iframe invisível e dispara a função de imprimir do navegador
 */
const handleWebExport = (html: string) => {
    const iframe = document.createElement('iframe');
    iframe.style.display = 'none';
    document.body.appendChild(iframe);

    const doc = iframe.contentWindow?.document;
    if (doc) {
        doc.open();
        doc.write(`<html><head><title>Lista de Compras</title></head><body>${html}</body></html>`);
        doc.close();

        setTimeout(() => {
            iframe.contentWindow?.focus();
            iframe.contentWindow?.print();
            document.body.removeChild(iframe);
        }, 500);
    }
};

/**
 * Lógica para Mobile: Gera o arquivo PDF e abre o menu de compartilhamento nativo
 */
const handleMobileExport = async (html: string) => {
    try {
        const { uri } = await Print.printToFileAsync({
            html: `<html><body style="margin:0;">${html}</body></html>`,
            base64: false
        });

        await Sharing.shareAsync(uri, {
            mimeType: 'application/pdf',
            dialogTitle: 'Enviar Lista de Compras',
            UTI: 'com.adobe.pdf' // Necessário para melhor suporte no iOS
        });
    } catch (error) {
        console.error('Falha na exportação Mobile:', error);
    }
};