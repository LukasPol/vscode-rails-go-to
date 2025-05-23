import * as vscode from 'vscode';
import { commandGoToClassFile } from './commands/go-to-class-file';
import { commandGoToTestFile } from './commands/go-to-test-file';
import { commandGoToRelationship} from './commands/go-to-relationship';
import { commandGoToFile } from './commands/go-to-file';
import { commandGoToView } from './commands/go-to-view';
import { InfoUpdateVersion } from './info-update-version';
import { ClassLinkProvider } from './providers/class-link-provider';
import { RelationshipLinkProvider } from './providers/relationship-link-provider';
import { ViewLinkProvider } from './providers/view-link-provider';

export function activate(context: vscode.ExtensionContext) {
	let disposableGoToClassFile = vscode.commands.registerCommand('rails.goToClassFile', commandGoToClassFile);
	context.subscriptions.push(disposableGoToClassFile);

	let disposableGoToTestFile = vscode.commands.registerCommand('rails.goToTestFile', commandGoToTestFile);
	context.subscriptions.push(disposableGoToTestFile);

	let disposableGoToRelationship = vscode.commands.registerCommand('rails.goToRelationship', commandGoToRelationship);
	context.subscriptions.push(disposableGoToRelationship);

	let disposableGoToFile = vscode.commands.registerCommand('rails.goToFile', commandGoToFile);
	context.subscriptions.push(disposableGoToFile);

	let disposableGoToView = vscode.commands.registerCommand('rails.goToView', commandGoToView);
	context.subscriptions.push(disposableGoToView);

	const classLinkProviderRegistration = vscode.languages.registerDocumentLinkProvider({ scheme: 'file', language: 'ruby' }, new ClassLinkProvider());
	const relationshipLinkProviderRegistration = vscode.languages.registerDocumentLinkProvider({ scheme: 'file', language: 'ruby' }, new RelationshipLinkProvider());
	const viewLinkProviderRegistration = vscode.languages.registerDocumentLinkProvider({ scheme: 'file', language: 'ruby' }, new ViewLinkProvider());
  context.subscriptions.push(classLinkProviderRegistration, relationshipLinkProviderRegistration, viewLinkProviderRegistration);

	const infoUpdateVersion = new InfoUpdateVersion;
	infoUpdateVersion.init();
}

export function deactivate() {}
