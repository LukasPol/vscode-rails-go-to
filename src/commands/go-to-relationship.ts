import { findFilesVscode, openOrSelectFile } from '../helpers-vscode';
import { ActiveFile } from '../active-file';

class GoToRelationship {
  private activeFile: ActiveFile;

  constructor() {
    this.activeFile = new ActiveFile();
  }

  async goTo() {
    if (!this.activeFile.isModel) { return; }
    if (!this.activeFile.isRelationShipLine) { return; }

    let currentLine = this.activeFile.lineSelected || '';

    let wordsSelected = this.activeFile.wordsSelected || '';

    if (/class_name\s*[:|=][>]?\s*["']([^"']+)["']/.test(currentLine)) {
      const match = currentLine.match(/class_name\s*[:|=][>]?\s*["']([^"']+)["']/);
      if (match) {
        wordsSelected = match[1];
      }
    } else if (/many/.test(currentLine)) {
      wordsSelected = wordsSelected.replace(/[e]?s$/, '');
    }

    const classFile = this.activeFile.classSelectedToFile(wordsSelected);
		if (!classFile) { return; }

		const files = await findFilesVscode(`app/**/${classFile}`);

		openOrSelectFile(files);
  }
}

export async function commandGoToRelationship() {
  const goToRelationship = new GoToRelationship();
  return await goToRelationship.goTo();
}
