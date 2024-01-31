import * as vscode from 'vscode';
import { commandGoToClassFile } from './commands/go-to-class-file';
import { commandGoToTestFile } from './commands/go-to-test-file';

export function activate(context: vscode.ExtensionContext) {
	let disposableGoToClassFile = vscode.commands.registerCommand('rails.goToClassFile', commandGoToClassFile);

	context.subscriptions.push(disposableGoToClassFile);

	let disposableGoToTestFile = vscode.commands.registerCommand('rails.goToTestFile', commandGoToTestFile);

	context.subscriptions.push(disposableGoToTestFile);
}

export function deactivate() {}
