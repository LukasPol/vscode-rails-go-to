import * as vscode from 'vscode';
import * as path from 'path';
import * as fs from 'fs';

export class BaseProvider implements vscode.DocumentLinkProvider {
  protected filesWorkspace: Map<string, Set<string>> = new Map<string, Set<string>>();

  provideDocumentLinks(document: vscode.TextDocument, token: vscode.CancellationToken): vscode.ProviderResult<vscode.DocumentLink[]> {
    throw new Error('Method not implemented.');
  }

  resolveDocumentLink?(link: vscode.DocumentLink, token: vscode.CancellationToken): vscode.ProviderResult<vscode.DocumentLink> {
    throw new Error('Method not implemented.');
  }

  protected decorateLinks(links: vscode.DocumentLink[]) {
    const editor = vscode.window.activeTextEditor;
    const decorationType = vscode.window.createTextEditorDecorationType({
      textDecoration: 'none',
    });
    if (editor) {
      editor.setDecorations(decorationType, links.map(link => link.range));
    }
  }

  protected classExists(className: string): boolean {
    const workspaceFolders = vscode.workspace.workspaceFolders;
    if (!workspaceFolders) {
      return false;
    }

    const classFilePath = this.classNameToFilePath(className);
    for (const folder of workspaceFolders) {
      let files = this.filesWorkspace.get(folder.uri.fsPath);

      if (!files) {
        files = this.cacheWorkspaceFiles(folder.uri.fsPath);
      }

      if (files.has(classFilePath)) {
        return true;
      }
    }

    return false;
  }

  protected cacheWorkspaceFiles(folderPath: string): Set<string> {
    const appFiles = this.findFilesInDirectory(path.join(folderPath, 'app'));
    const libFiles = this.findFilesInDirectory(path.join(folderPath, 'lib'));
    const files = this.unionSets(appFiles, libFiles);
    this.filesWorkspace.set(folderPath, files);
    return files;
  }

  protected findFilesInDirectory(directory: string): Set<string> {
    const files = new Set<string>();
    if (fs.existsSync(directory)) {
      const stack = [directory];
      while (stack.length > 0) {
        const currentPath = stack.pop();
        if (!currentPath) continue;

        const stat = fs.statSync(currentPath);
        if (stat.isDirectory()) {
          const subPaths = fs.readdirSync(currentPath).map(subPath => path.join(currentPath, subPath));
          stack.push(...subPaths);
        } else if (stat.isFile() && currentPath.endsWith('.rb')) {
          let pathFile = path.relative(directory, currentPath).replace(/\\/g, '/');
          if (directory.includes('app')) {
            pathFile = pathFile.replace(/^[^/]*\//, '');
          }
          files.add(pathFile);
        }
      }
    }
    return files;
  }

  protected classNameToFilePath(className: string): string {
    return className.replace(/::/g, '/').replace(/([a-z])([A-Z])/g, '$1_$2').toLowerCase() + '.rb';
  }

  protected unionSets(setA: Set<string>, setB: Set<string>): Set<string> {
    return new Set<string>([...setA, ...setB]);
  }

  protected getCurrentClassName(text: string): string | null {
    const match = text.match(/class\s+([A-Z][a-zA-Z0-9_:]*)\s*</);
    return match ? match[1] : null;
  }
}