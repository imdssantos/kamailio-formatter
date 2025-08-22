"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.activate = activate;
const vscode = require("vscode");
function activate(context) {
    const provider = {
        provideDocumentFormattingEdits(document) {
            const edits = [];
            let indentLevel = 0;
            let inBlockComment = false;
            for (let i = 0; i < document.lineCount; i++) {
                const line = document.lineAt(i);
                let text = line.text.trim();
                // Verifica se está dentro de comentário de bloco
                if (inBlockComment) {
                    if (text.includes('*/'))
                        inBlockComment = false;
                    continue;
                }
                // Ignora comentários de linha e início de comentário de bloco
                if (text.startsWith('//') ||
                    text.startsWith('#') ||
                    text.startsWith('/*')) {
                    if (text.includes('/*') && !text.includes('*/'))
                        inBlockComment = true;
                    continue;
                }
                // Diminui indentação se linha for fechamento de bloco
                if (text.startsWith('}') ||
                    text.startsWith('#!endif') ||
                    text.startsWith('#!else')) {
                    indentLevel = Math.max(indentLevel - 1, 0);
                }
                // Aplica nova indentação
                const newText = '    '.repeat(indentLevel) + text;
                edits.push(vscode.TextEdit.replace(line.range, newText));
                // Aumenta indentação se linha for abertura de bloco
                if (text.endsWith('{') ||
                    text.startsWith('#!ifdef') ||
                    text.startsWith('#!else')) {
                    indentLevel++;
                }
            }
            return edits;
        }
    };
    context.subscriptions.push(vscode.languages.registerDocumentFormattingEditProvider('kamailio', provider));
}
//# sourceMappingURL=extension.js.map