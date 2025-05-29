import { ActiveFile } from "../active-file";
import * as vscode from 'vscode';
import { showInfoMsg } from "../helpers-vscode";

class GoToDefinition {
  private activeFile: ActiveFile;

  constructor() {
    this.activeFile = new ActiveFile();
  }

  goTo(definitionName: string | undefined = this.activeFile.wordsSelected) {
    if (!definitionName) { return;}

    const positionDefinition = this.getPositionDefinition(definitionName);
    if (!positionDefinition) {
      showInfoMsg(`Método def ${definitionName} não encontrado.`);
      return;
    }

    this.activeFile.activeTextEditor.selection = new vscode.Selection(positionDefinition, positionDefinition);
    this.activeFile.activeTextEditor.revealRange(
      new vscode.Range(positionDefinition, positionDefinition),
      vscode.TextEditorRevealType.InCenter
    );
  }

  getPositionDefinition(definitionName: string) {
    const regex = new RegExp(`^\\s*def\\s+${definitionName}\\b`);
    const lines = this.getLines();
    const line = lines.findIndex(linha => regex.test(linha));
    if (line === -1) {
      return;
    }

    const column = lines[line].indexOf(definitionName) || 0;
    const position = new vscode.Position(line, column);
    return position;
  }

  getLines() {
    return this.activeFile.activeTextEditor.document.getText().split('\n');
  }
}

export function commandGoToMethodDefinition(params: string) {
  const goToDefinition = new GoToDefinition();

  return goToDefinition.goTo(params);
}
