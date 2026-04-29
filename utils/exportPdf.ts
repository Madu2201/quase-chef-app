import * as Print from 'expo-print';
import * as Sharing from 'expo-sharing';
import { Platform } from 'react-native';
import { Colors } from '../constants/theme';

export const exportarListaPendentes = async (itens: any[]) => {
    const dataAtual = new Date().toLocaleDateString('pt-BR');

    // Gera as linhas da lista - CORRIGIDO: usar nome, quantidade_comprar, unidade
    const rows = itens.map(item => `
        <div style="display: flex; justify-content: space-between; padding: 12px 0; border-bottom: 1px solid #F0F0F0; align-items: center;">
            <div style="display: flex; align-items: center;">
                <div style="
                    width: 16px; 
                    height: 16px; 
                    border: 2px solid ${Colors.secondary}; 
                    border-radius: 4px; 
                    margin-right: 12px;
                    background-color: white;
                "></div>
                
                <span style="font-size: 16px; font-weight: 500; color: ${Colors.dark};">${item.nome}</span>
            </div>
            <span style="font-size: 13px; color: ${Colors.subtext}; font-style: italic;">${item.quantidade_comprar} ${item.unidade}</span>
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
        doc.write(html);
        doc.close();

        iframe.onload = () => {
            iframe.contentWindow?.focus();
            iframe.contentWindow?.print();
            setTimeout(() => document.body.removeChild(iframe), 1000);
        };
    }
};

const handleMobileExport = async (html: string) => {
    try {
        const { uri } = await Print.printToFileAsync({ html });

        await Sharing.shareAsync(uri, {
            mimeType: 'application/pdf',
            dialogTitle: 'Exportar Lista',
            UTI: 'com.adobe.pdf'
        });
    } catch (error) {
        // Erro ao gerar PDF no mobile - usuário será notificado pela UX nativa
    }
};