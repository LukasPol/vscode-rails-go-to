import * as vscode from 'vscode';
import { findFilesVscode, openOrSelectFile } from '../helpers-vscode';
import { ActiveFile } from '../active-file';

class GoToTestFile {
  private activeFile: ActiveFile;

  constructor() {
    this.activeFile = new ActiveFile();
  }

  async goTo() {
    try {
      const path = this.pathGoTo;
      if (!path) { return; }

      const specFiles = await findFilesVscode(path);

      await openOrSelectFile(specFiles);
    } catch (error) {
      console.log(`Navigate Rails: not can open the ${this.activeFile.documentUri?.fsPath} with error: '${error}'`);
      await vscode.window.showErrorMessage(`Spec not found for ${this.activeFile.documentUri?.fsPath}`);
    }
  }

  private get pathGoTo(): string | undefined {
    if (!this.activeFile.relativePath || !this.activeFile.filename) { return; }

    let relativePath = this.activeFile.relativePath;
    const filename = this.activeFile.filename;
    let newFileName = filename;

    if (relativePath.includes('spec/requests')) {
      newFileName = filename.replace(/(?:_request|_resource)?_spec/, '_controller');
      relativePath = relativePath.replace('spec/requests', 'app/controllers');
    } else if (relativePath.includes('spec')) {
      newFileName = filename.replace('_spec', '');
      relativePath = relativePath.replace('spec/', 'app/');
    } else if (relativePath.includes('app/controllers')) {
      newFileName = filename.replace('_controller.', '*_spec.');
      relativePath = relativePath.replace('app/controllers/', 'spec/*/');
    } else if (relativePath.includes('app')) {
      newFileName = filename.replace('.', '_spec.');
      relativePath = relativePath.replace('app/', 'spec/');
    }

    relativePath = relativePath.replace(filename, newFileName);
    return relativePath;
  }
}

export async function commandGoToTestFile() {
  const goToTestFile = new GoToTestFile();
  return await goToTestFile.goTo();
}
