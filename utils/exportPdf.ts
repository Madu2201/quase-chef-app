import * as Print from "expo-print";
import * as Sharing from "expo-sharing";
import { Platform } from "react-native";

// Meu import
import { Colors } from "../constants/theme";

// Gera um PDF com a lista de itens pendentes
export const exportarListaPendentes = async (itens: any[]) => {
    const dataAtual = new Date().toLocaleDateString("pt-BR");

    const rows = itens
        .map(
            (item) => `
        <div class="item-card">
            <div class="item-left">
                <div class="checkbox"></div>
                <div class="item-details">
                    <span class="item-name">${item.nome}</span>
                </div>
            </div>
            <div class="item-right">
                <span class="item-quantity">${item.quantidade_comprar}</span>
                <span class="item-unit">${item.unidade}</span>
            </div>
        </div>
    `,
        )
        .join("");

    // HTML com layout moderno e identidade visual do app
    const htmlContent = `
        <!DOCTYPE html>
        <html>
        <head>
            <meta charset="UTF-8">
            <style>
                @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700&display=swap');
                
                @page { 
                    size: A4; 
                    margin: 0; 
                }
                
                body { 
                    margin: 0; 
                    padding: 0; 
                    font-family: 'Plus Jakarta Sans', sans-serif; 
                    background-color: ${Colors.background};
                    color: ${Colors.dark};
                }
                
                .page {
                    padding: 40px;
                    min-height: 100vh;
                    box-sizing: border-box;
                }
                
                .header {
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    margin-bottom: 40px;
                    padding-bottom: 20px;
                    border-bottom: 2px solid rgba(248, 139, 61, 0.1);
                }
                
                .logo-container {
                    display: flex;
                    align-items: center;
                    gap: 12px;
                }
                
                .logo-icon {
                    width: 40px;
                    height: 40px;
                    background-color: ${Colors.primary};
                    border-radius: 10px;
                    display: flex;
                    justify-content: center;
                    align-items: center;
                    color: white;
                    font-weight: bold;
                    font-size: 24px;
                }
                
                .logo-text {
                    font-size: 24px;
                    font-weight: 700;
                    color: ${Colors.primary};
                    letter-spacing: -0.5px;
                    display: block;
                    line-height: 1;
                }
                
                .logo-details {
                    display: flex;
                    flex-direction: column;
                    gap: 2px;
                }
                
                .header-info {
                    text-align: right;
                }
                
                .title {
                    font-size: 28px;
                    font-weight: 700;
                    margin: 0;
                    color: ${Colors.dark};
                    line-height: 1;
                }
                
                .date {
                    font-size: 12px;
                    color: ${Colors.subtext};
                    font-weight: 500;
                }
                
                .summary {
                    font-size: 14px;
                    color: ${Colors.primary};
                    font-weight: 600;
                    margin-top: 4px;
                    display: block;
                }
                
                .list-container {
                    display: flex;
                    flex-direction: column;
                    gap: 12px;
                }
                
                .item-card {
                    background-color: white;
                    padding: 16px 20px;
                    border-radius: 16px;
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.02);
                    border: 1px solid rgba(0, 0, 0, 0.03);
                }
                
                .item-left {
                    display: flex;
                    align-items: center;
                    gap: 16px;
                }
                
                .checkbox {
                    width: 22px;
                    height: 22px;
                    border: 2px solid ${Colors.primary};
                    border-radius: 6px;
                    background-color: white;
                }
                
                .item-details {
                    display: flex;
                    flex-direction: column;
                }
                
                .item-name {
                    font-size: 16px;
                    font-weight: 600;
                    color: ${Colors.dark};
                }
                
                .item-right {
                    display: flex;
                    align-items: baseline;
                    gap: 4px;
                    background-color: ${Colors.background};
                    padding: 6px 12px;
                    border-radius: 8px;
                }
                
                .item-quantity {
                    font-size: 16px;
                    font-weight: 700;
                    color: ${Colors.primary};
                }
                
                .item-unit {
                    font-size: 12px;
                    font-weight: 500;
                    color: ${Colors.subtitle};
                    text-transform: lowercase;
                }
                
                .footer {
                    margin-top: 60px;
                    text-align: center;
                    padding: 20px;
                }
                
                .footer-text {
                    font-size: 12px;
                    color: ${Colors.subtext};
                    font-weight: 500;
                }
                
                .footer-brand {
                    color: ${Colors.primary};
                    font-weight: 700;
                }
            </style>
        </head>
        <body>
            <div class="page">
                <div class="header">
                    <div class="logo-container">
                        <div class="logo-icon">🍳</div>
                        <div class="logo-details">
                            <span class="logo-text">Quase Chef</span>
                            <span class="date">Gerado em ${dataAtual}</span>
                        </div>
                    </div>
                    <div class="header-info">
                        <h1 class="title">Lista de Compras</h1>
                        <span class="summary">${itens.length} itens para comprar</span>
                    </div>
                </div>
                
                <div class="list-container">
                    ${rows}
                </div>
                
                <div class="footer">
                    <p class="footer-text">
                        Organizado por <span class="footer-brand">Quase Chef App</span><br>
                        Evite o desperdício, aproveite o sabor.
                    </p>
                </div>
            </div>
        </body>
        </html>
    `;

    if (Platform.OS === "web") {
        handleWebExport(htmlContent);
    } else {
        await handleMobileExport(htmlContent);
    }
};

// Funcionalidade de exportação para web usando iframe e print
const handleWebExport = (html: string) => {
    const iframe = document.createElement("iframe");
    iframe.style.position = "fixed";
    iframe.style.right = "0";
    iframe.style.bottom = "0";
    iframe.style.width = "0";
    iframe.style.height = "0";
    iframe.style.border = "0";
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

// Funcionalidade de exportação para mobile
const handleMobileExport = async (html: string) => {
    try {
        const { uri } = await Print.printToFileAsync({ html });

        await Sharing.shareAsync(uri, {
            mimeType: "application/pdf",
            dialogTitle: "Exportar Lista",
            UTI: "com.adobe.pdf",
        });
    } catch {
        // Erro ao gerar PDF no mobile - usuário será notificado pela UX nativa
    }
};
