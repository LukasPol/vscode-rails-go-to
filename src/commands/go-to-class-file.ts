import { findFilesVscode, openOrSelectFile } from '../helpers-vscode';
import { ActiveFile } from '../active-file';

class GoToClassFile {
	private activeFile: ActiveFile;

  constructor() {
    this.activeFile = new ActiveFile();
  }

	async goTo() {
		const classFile = this.activeFile.classSelectedToFile();
		if (!classFile) { return; }

		const files = await findFilesVscode(`app/*/${classFile}`);

		openOrSelectFile(files);
	}
}

export async function commandGoToClassFile() {
	const goToClassFile = new GoToClassFile();
	return await goToClassFile.goTo();
}
