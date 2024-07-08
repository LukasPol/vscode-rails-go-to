import { findFilesVscode, openOrSelectFile, showInfoMsg } from '../helpers-vscode';
import { ActiveFile } from '../active-file';

class GoToClassFile {
	private activeFile: ActiveFile;
	private word: string | undefined;

  constructor(word?: string) {
		this.word = word
    this.activeFile = new ActiveFile();
  }

	async goTo() {
		const classFile = this.activeFile.classSelectedToFile(this.word);
		if (!classFile) { return; }

		const files = await findFilesVscode(`{app,lib}/**/${classFile}`);

		openOrSelectFile(files);
	}
}

export async function commandGoToClassFile(word: string) {
	const goToClassFile = new GoToClassFile(word);
	return await goToClassFile.goTo();
}
