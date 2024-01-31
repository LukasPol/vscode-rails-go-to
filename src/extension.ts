import * as vscode from 'vscode';
import { commandGoToClassFile } from './commands/go-to-class-file';

export function activate(context: vscode.ExtensionContext) {
	let disposableGoToClassFile = vscode.commands.registerCommand('rails.goToClassFile', commandGoToClassFile);

	context.subscriptions.push(disposableGoToClassFile);
}

export function deactivate() {}
