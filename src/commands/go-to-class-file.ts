import * as vscode from 'vscode';
import { findFilesVscode, openFile, showInfoMsg } from '../helpers-vscode';
import { ActiveFile } from '../active-file';

class GoToClassFile {
	private activeFile: ActiveFile;

  constructor() {
    this.activeFile = new ActiveFile();
  }

	async goTo() {
		const classFile = this.activeFile.classSelectedToFile;
		if (!classFile) { return; }

		const files = await findFilesVscode(classFile);

		if (files.length === 1) {
			openFile(files[0]);
		} else if (files.length > 1) {
			await this.selectFile(files);
		} else {
			showInfoMsg('Not found class file.');
		}
	}

	private async selectFile(files: Array<string>) {
		const selectedFile = await vscode.window.showQuickPick(files, {
			placeHolder: 'Select a file to open',
		});

		if (selectedFile) {
			openFile(selectedFile);
		}
	}
}

export async function commandGoToClassFile() {
	const goToClassFile = new GoToClassFile();
	return await goToClassFile.goTo();
}
