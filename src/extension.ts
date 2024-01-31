import * as vscode from 'vscode';

export function activate(context: vscode.ExtensionContext) {
	let disposable = vscode.commands.registerCommand('rails.helloWorld', () => {
		vscode.window.showInformationMessage('Hello World from Rails GoTo!');
	});

	context.subscriptions.push(disposable);
}

export function deactivate() {}
