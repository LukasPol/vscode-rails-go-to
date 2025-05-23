import { BaseProvider } from './base-provider';
import * as vscode from 'vscode';
import { findFilesVscode } from '../helpers-vscode';

export class ViewLinkProvider extends BaseProvider {
  async provideDocumentLinks(document: vscode.TextDocument, token: vscode.CancellationToken): Promise<vscode.DocumentLink[]> {
    const links: vscode.DocumentLink[] = [];
    if (!document.fileName.includes('app/controllers')) { return links; }
    if (document.fileName.includes('app/controllers/api')) { return links; }

    const text = document.getText().split('private')[0];
    const relationshipRegex = /\b(def)\s+([a-zA-Z_]+)/g;
    let match: RegExpExecArray | null;

    while ((match = relationshipRegex.exec(text)) !== null) {
      const viewName = match[2];
      const controllerName = document.fileName.split('app/controllers/')[1].split('_controller.rb')[0];
      const viewPath = `app/views/${controllerName}/${viewName}*`;
      const viewFiles = await findFilesVscode(viewPath);

      if (!viewFiles.length) {
        continue;
      }

      const start = document.positionAt(match.index + 4);
      const end = document.positionAt(match.index + 4 + viewName.length);
      const range = new vscode.Range(start, end);
      const uri = vscode.Uri.parse(`command:rails.goToView?${encodeURIComponent(JSON.stringify([viewPath]))}`);
      const link = new vscode.DocumentLink(range, uri);
      link.tooltip = `Go to view ${viewName}`;
      links.push(link);
    }

    this.decorateLinks(links);

    return links;
  }
}
