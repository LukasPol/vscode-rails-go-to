import * as vscode from 'vscode';
import { BaseProvider } from "./base-provider";

export class MethodDefinitionLinkProvider extends BaseProvider {
  async provideDocumentLinks(document: vscode.TextDocument, token: vscode.CancellationToken): Promise<vscode.DocumentLink[]> {
    const links: vscode.DocumentLink[] = [];

    const text = document.getText();
    const methodDefs = this.extractMethodNames(text);

    // Regex rules:
    // 1. (?<!def\s)      - Negative lookbehind for 'def' (do not match method definitions)
    // 2. (?<=^|\s|=)     - Positive lookbehind for start of line, whitespace, or equals sign
    // 3. (?<!\.|:|\||@)  - Negative lookbehind for dot, colon, pipe, or at-sign (do not match after ., :, |, or @)
    // 4. ([a-z_][a-z0-9_]*) - Match method/variable names starting with lowercase or underscore
    // 5. \b([\?!])?      - Optionally match a trailing ? or ! (Ruby idiom)
    // 6. (?!:)(?!\|)     - Negative lookahead for colon or pipe (do not match if immediately followed by : or |)
    // 7. (?!\s*=)        - Negative lookahead for equals sign (do not match if immediately followed by =)
    const regex = /(?<!def\s)(?<=^|\s|=)(?<!\.|:|\||@)([a-z_][a-z0-9_]*)\b([\?!])?(?!:)(?!\|)(?!\s*=)/g;

    let match: RegExpExecArray | null;
    while ((match = regex.exec(text)) !== null) {
      const methodName = match[1] + (match[2] || "");
      if (!methodDefs.has(methodName)) { continue; }

      const methodNameLength = methodName.length;
      const start = match[0].length - methodNameLength;
      const startPosition = document.positionAt(match.index + start);
      const endPosition = document.positionAt(match.index + start + methodNameLength);
      const range = new vscode.Range(startPosition, endPosition);
      const uri = vscode.Uri.parse(`command:rails.goToMethodDefinition?${encodeURIComponent(JSON.stringify([methodName]))}`);
      const link = new vscode.DocumentLink(range, uri);
      link.tooltip = `Go to method ${methodName}`;
      links.push(link);
    }

    // this.decorateLinks(links);

    return links;
  }

  extractMethodNames(text: string): Set<string> {
    return new Set(
      [...text.matchAll(/^\s*def\s+([a-z_][a-zA-Z0-9_]*(?:\?|!)?)/gm)].map(m => m[1])
    );
  }
}
