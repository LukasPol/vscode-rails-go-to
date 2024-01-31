import * as vscode from 'vscode';
import * as path from 'path';

export class ActiveFile {
  public activeTextEditor: vscode.TextEditor | undefined;

  constructor() {
    this.activeTextEditor = vscode.window.activeTextEditor;
  }

  get document(): vscode.TextDocument | undefined {
    return this.activeTextEditor?.document;
  }

  get documentUri(): vscode.Uri | undefined {
    return this.document?.uri;
  }

  get relativePath(): string | undefined {
    if (!this.documentUri) { return; }

    return path.normalize(vscode.workspace.asRelativePath(this.documentUri));
  }

  get filename(): string | undefined {
    if (!this.relativePath) { return; }

    return path.basename(this.relativePath);
  }

  get rootPath(): vscode.WorkspaceFolder | undefined {
    if (!this.documentUri) { return; }

    return vscode.workspace.getWorkspaceFolder(this.documentUri);
  }

  get wordsSelected(): string | undefined {
    if (!this.activeTextEditor || !this.document) { return; }

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
    classFile = classFile.replace(/^::/, '');

    // transform user::test to user/test
    classFile = classFile.replaceAll('::', '/');

    return `app/*/${classFile}.rb`;
  }

  get isController(): boolean | undefined {
    if (!this.documentUri) { return; }

    return this.documentUri.path.includes('app/controllers');
  }

  get isTest(): boolean | undefined {
    if (!this.documentUri) { return; }

    return this.documentUri.path.includes('spec/');
  }
}
