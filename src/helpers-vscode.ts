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
