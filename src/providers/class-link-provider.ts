import * as vscode from 'vscode';
import { BaseProvider } from "./base-provider";

export class ClassLinkProvider extends BaseProvider {
  provideDocumentLinks(document: vscode.TextDocument, token: vscode.CancellationToken): vscode.ProviderResult<vscode.DocumentLink[]> {
    const links: vscode.DocumentLink[] = [];
    const text = document.getText();
    const regex = /\b[A-Z][a-zA-Z0-9_:]*\b/g;
    let match: RegExpExecArray | null;
    const currentClassName = this.getCurrentClassName(text);

    while ((match = regex.exec(text)) !== null) {
      const className = match[0];
      if (className !== currentClassName && this.classExists(className)) {
        const start = document.positionAt(match.index);
        const end = document.positionAt(match.index + match[0].length);
        const range = new vscode.Range(start, end);
        const uri = vscode.Uri.parse(`command:rails.goToClassFile?${encodeURIComponent(JSON.stringify([className]))}`);
        const link = new vscode.DocumentLink(range, uri);
        link.tooltip = `Go to ${className} class`;
        links.push(link);
      }
    }

    this.decorateLinks(links);

    return links;
  }
}
