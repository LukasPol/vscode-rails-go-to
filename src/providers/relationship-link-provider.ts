import * as vscode from 'vscode';
import { BaseProvider } from "./base-provider";

export class RelationshipLinkProvider extends BaseProvider {
  provideDocumentLinks(document: vscode.TextDocument, token: vscode.CancellationToken): vscode.ProviderResult<vscode.DocumentLink[]> {
    const links: vscode.DocumentLink[] = [];
    if (!document.uri.path.includes('app/models')) return links;

    const text = document.getText();
    const relationshipRegex = /\b(has_many|belongs_to|has_one|has_and_belongs_to_many)\s+:([a-zA-Z_]+)/g;
    let match: RegExpExecArray | null;

    while ((match = relationshipRegex.exec(text)) !== null) {
      const relationshipType = match[1];
      const relationName = match[2];
      const className = this.relationNameToClassName(relationName);

      const start = document.positionAt(match.index + relationshipType.length + 1);
      const end = document.positionAt(match.index + relationshipType.length + 1 + relationName.length);
      const range = new vscode.Range(start, end);
      const uri = vscode.Uri.parse(`command:rails.goToRelationship?${encodeURIComponent(JSON.stringify([className]))}`);
      const link = new vscode.DocumentLink(range, uri);
      link.tooltip = `Go to ${className} class`;
      links.push(link);
    }

    this.decorateLinks(links);

    return links;
  }

  private relationNameToClassName(relationName: string): string {
    return relationName.split('_').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join('').replace(/[e]?s$/, '');
  }
}