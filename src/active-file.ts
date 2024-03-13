import * as vscode from 'vscode';
import * as path from 'path';

export class ActiveFile {
  public activeTextEditor: vscode.TextEditor;

  constructor() {
    this.activeTextEditor = vscode.window.activeTextEditor || vscode.window.visibleTextEditors[0];
  }

  get document(): vscode.TextDocument {
    return this.activeTextEditor.document;
  }

  get documentUri(): vscode.Uri {
    return this.document.uri;
  }

  get relativePath(): string {
    return path.normalize(vscode.workspace.asRelativePath(this.documentUri));
  }

  get filename(): string {
    return path.basename(this.relativePath);
  }

  get rootPath(): vscode.WorkspaceFolder | undefined {
    return vscode.workspace.getWorkspaceFolder(this.documentUri);
  }

  get wordsSelected(): string | undefined {
    const position = this.activeTextEditor.selection.start;
    const wordRange = this.document.getWordRangeAtPosition(position, /[\w:]+/);
    const classSeleted = this.document.getText(wordRange);

    return classSeleted;
  }

  get classSelectedToFile(): string | undefined {
    if (!this.wordsSelected) { return; }

    // transform Test to test and/or MyTest to my_test
    let classFile = this.wordsSelected.replace(/([a-z])([A-Z])/g, '$1_$2').toLowerCase();

    // remove the :: case is ::MyTest::Creator
    classFile = classFile.replace(/^::|^:/, '');

    // transform user::test to user/test
    classFile = classFile.replace(/::/g, '/');

    return `app/*/${classFile}.rb`;
  }

  get isController(): boolean {
    return this.documentUri.path.includes('app/controllers');
  }

  get isTest(): boolean {
    return this.documentUri.path.includes('spec/');
  }

  get isModel(): boolean {
    return this.documentUri.path.includes('app/models');
  }
}
