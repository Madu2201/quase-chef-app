import * as Print from 'expo-print';
import * as Sharing from 'expo-sharing';
import { Platform } from 'react-native';
import { Colors, Spacing } from '../constants/theme';

export const exportarListaPendentes = async (itens: any[]) => {
    const dataAtual = new Date().toLocaleDateString('pt-BR');

    // Gera as linhas da lista
    const rows = itens.map(item => `
        <div style="display: flex; justify-content: space-between; padding: 12px 0; border-bottom: 1px solid #F0F0F0; align-items: center;">
            <div style="display: flex; align-items: center;">
                <span style="color: ${Colors.secondary}; margin-right: 10px; font-size: 20px;">•</span>
                <span style="font-size: 16px; font-weight: 500; color: ${Colors.dark};">${item.name}</span>
            </div>
            <span style="font-size: 13px; color: ${Colors.subtext}; font-style: italic;">${item.info || ''}</span>
        </div>
    `).join('');

    // HTML isolado com CSS específico para impressão (@media print)
    const htmlContent = `
        <html>
        <head>
            <style>
                @page { size: auto; margin: 0mm; }
                body { margin: 0; padding: 40px; font-family: sans-serif; background-color: white; }
                .header {padding-bottom: 15px; margin-bottom: 20px; display: flex; justify-content: space-between; align-items: flex-end; }
                h1 { margin: 0; color: ${Colors.dark}; font-size: 24px; text-transform: uppercase; }
                .footer { margin-top: 40px; border-top: 1px solid #EEE; padding-top: 20px; text-align: center; }
            </style>
        </head>
        <body>
            <div class="header">
                <h1>Lista de Compras</h1>
                <span style="font-size: 12px; color: ${Colors.subtext};">Gerado em ${dataAtual}</span>
            </div>
            <div style="min-height: 70vh;">${rows}</div>
        </body>
        </html>
    `;

    if (Platform.OS === 'web') {
        handleWebExport(htmlContent);
    } else {
        await handleMobileExport(htmlContent);
    }
};

const handleWebExport = (html: string) => {
    const iframe = document.createElement('iframe');
    iframe.style.position = 'fixed';
    iframe.style.right = '0';
    iframe.style.bottom = '0';
    iframe.style.width = '0';
    iframe.style.height = '0';
    iframe.style.border = '0';
    document.body.appendChild(iframe);

    const doc = iframe.contentWindow?.document;
    if (doc) {
        doc.open();
        // O segredo está em escrever o HTML completo e garantir que o foco seja apenas no iframe
        doc.write(html);
        doc.close();

        // Aguarda carregar os estilos e dispara
        iframe.onload = () => {
            iframe.contentWindow?.focus();
            iframe.contentWindow?.print();
            setTimeout(() => document.body.removeChild(iframe), 1000);
        };
    }
};

const handleMobileExport = async (html: string) => {
    try {
        // Gera o arquivo PDF temporário
        const { uri } = await Print.printToFileAsync({ html });

        // Abre o menu "Compartilhar / Enviar / Salvar em Arquivos" nativo
        await Sharing.shareAsync(uri, {
            mimeType: 'application/pdf',
            dialogTitle: 'Exportar Lista',
            UTI: 'com.adobe.pdf'
        });
    } catch (error) {
        console.error('Erro no Mobile:', error);
    }
};