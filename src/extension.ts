import * as vscode from 'vscode';
import { commandGoToClassFile } from './commands/go-to-class-file';
import { commandGoToTestFile } from './commands/go-to-test-file';
import { commandGoToRelationship} from './commands/go-to-relationship';
import { commandGoToFile } from './commands/go-to-file';

export function activate(context: vscode.ExtensionContext) {
	let disposableGoToClassFile = vscode.commands.registerCommand('rails.goToClassFile', commandGoToClassFile);
	context.subscriptions.push(disposableGoToClassFile);

	let disposableGoToTestFile = vscode.commands.registerCommand('rails.goToTestFile', commandGoToTestFile);
	context.subscriptions.push(disposableGoToTestFile);

	let disposableGoToRelationship = vscode.commands.registerCommand('rails.goToRelationship', commandGoToRelationship);
	context.subscriptions.push(disposableGoToRelationship);

	let disposableGoToFile = vscode.commands.registerCommand('rails.goToFile', commandGoToFile);
	context.subscriptions.push(disposableGoToFile);
}

export function deactivate() {}
