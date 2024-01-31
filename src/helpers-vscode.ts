import * as vscode from 'vscode';

export function showInfoMsg(msg: string = 'File not found') {
	return vscode.window.showInformationMessage(`Rails GoTo: ${msg}`);
}

export async function findFilesVscode(path: string): Promise<string[]> {
	const specFiles = await vscode.workspace.findFiles(path);
  return specFiles.map(file => file.fsPath);
}

export async function openFile(file: string) {
	vscode.workspace.openTextDocument(file).then(document => {
		vscode.window.showTextDocument(document, vscode.ViewColumn.Active);
	});
}

export async function openOrSelectFile(files: string[]) {
	if (files.length === 1) {
		openFile(files[0]);
	} else if (files.length > 1) {
		selectFile(files);
	} else {
		showInfoMsg();
	}
}

export async function selectFile(files: string[]) {
	const selectedFile = await vscode.window.showQuickPick(files, {
		placeHolder: 'Select a file to open',
	});

	if (selectedFile) {
		openFile(selectedFile);
	}
}
