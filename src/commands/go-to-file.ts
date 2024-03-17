import { commands } from 'vscode';
import { ActiveFile } from "../active-file";

class GoToFile {
  private activeFile: ActiveFile;

  constructor() {
    this.activeFile = new ActiveFile();
  }

  goTo() {
    if (this.activeFile.isModel && this.activeFile.isRelationShipLine) {
      commands.executeCommand('rails.goToRelationship');
    } else {
      commands.executeCommand('rails.goToClassFile');
    }
  }
}

export async function commandGoToFile() {
  const goToRelationship = new GoToFile();
  return await goToRelationship.goTo();
}