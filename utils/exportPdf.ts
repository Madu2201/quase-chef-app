import * as Print from 'expo-print';
import { Platform } from 'react-native';
import { Colors, Spacing } from '../constants/theme';

/**
 * Exporta a lista de itens para Impressão/PDF
 * No Mobile: Abre a tela de impressão nativa.
 * No Web: Dispara o print do navegador.
 */
export const exportarListaPendentes = async (itens: any[]) => {
    const dataAtual = new Date().toLocaleDateString('pt-BR');
    const paddingPx = `${Spacing.lg}px`;

    // Gera as linhas da lista
    const rows = itens.map(item => `
        <div style="display: flex; justify-content: space-between; padding: ${Spacing.md}px 0; border-bottom: 1px solid #F0F0F0; align-items: center;">
            <div style="display: flex; align-items: center;">
                <span style="color: ${Colors.secondary}; margin-right: ${Spacing.sm}px; font-size: 20px;">•</span>
                <span style="font-size: 16px; font-weight: 500; color: ${Colors.dark};">${item.name}</span>
            </div>
            <span style="font-size: 13px; color: ${Colors.subtext}; font-style: italic;">${item.info || ''}</span>
        </div>
    `).join('');

    // Template HTML Principal
    const htmlContent = `
        <html>
        <body style="margin:0; padding: ${paddingPx}; font-family: sans-serif; background-color: white;">
            <div style="border-bottom: 3px solid ${Colors.primary}; padding-bottom: ${Spacing.sm}px; margin-bottom: ${Spacing.lg}px; display: flex; justify-content: space-between; align-items: flex-end;">
                <h1 style="margin: 0; color: ${Colors.dark}; font-size: 24px; text-transform: uppercase;">Lista de Compras</h1>
                <span style="font-size: 12px; color: ${Colors.subtext};">Gerado em ${dataAtual}</span>
            </div>

            <div style="min-height: 70vh;">${rows}</div>

            <div style="margin-top: ${Spacing.xl}px; border-top: 1px solid #EEE; padding-top: ${Spacing.md}px; text-align: center;">
                <p style="margin: 0; font-size: 14px; font-weight: 700; color: ${Colors.primary};">Quase Chef</p>
                <p style="margin: 2px 0; font-size: 10px; color: ${Colors.subtext}; text-transform: uppercase; letter-spacing: 1px;">Organização e Praticidade</p>
                <div style="margin-top: 8px; height: 3px; width: 30px; background-color: ${Colors.secondary}; margin-left: auto; margin-right: auto; border-radius: 2px;"></div>
            </div>
        </body>
        </html>
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
        doc.write(html);
        doc.close();

        setTimeout(() => {
            iframe.contentWindow?.focus();
            iframe.contentWindow?.print();
            document.body.removeChild(iframe);
        }, 500);
    }
};

/**
 * Lógica para Mobile: Abre a tela de impressão nativa diretamente
 */
const handleMobileExport = async (html: string) => {
    try {
        // printAsync abre a interface de impressão do iOS/Android diretamente
        await Print.printAsync({
            html: html,
        });
    } catch (error) {
        console.error('Falha na impressão Mobile:', error);
    }
};