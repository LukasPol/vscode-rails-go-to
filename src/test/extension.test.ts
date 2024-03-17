import { expect } from "chai";
import * as path from "path";
import { InputBox,TextEditor,Workbench } from "vscode-extension-tester";
import { describe, it } from 'mocha';

const PROJECT_PATH = path.resolve("src/test/project/");

describe('Extesion Tests', function () {
	this.timeout(60000);

  let workbench: Workbench;

	async function openFile(filename: string, line = 0, collumn = 1) {
		await workbench.executeCommand("File: Open File");
		const input = await InputBox.create();
		await new Promise(resolve => setTimeout(resolve, 2000));
		await input.setText(filename);
		await new Promise(resolve => setTimeout(resolve, 2000));
		await input.confirm();
		await new Promise(resolve => setTimeout(resolve, 3000));
		const editor = new TextEditor();
		await editor.wait(1000);

		if (line > 0) { await editor.moveCursor(line, collumn); }

		return editor;
	};

	async function executeCommand(command: string) {
    await workbench.executeCommand(command);
    await workbench.getDriver().sleep(100);
  }

	before(async () => {
    workbench = new Workbench();
    await executeCommand("Extest: Open Folder");
    const input = await InputBox.create();
    await input.setText(PROJECT_PATH);
    await input.confirm();
    await input.confirm();
		await new Promise(resolve => setTimeout(resolve, 2000));
  });

	describe('Command: Open Test File', () => {
		it('Open controller test', async () => {
			await openFile('app/controllers/vsextensions_controller.rb');
			await executeCommand("Rails GoTo: Open Test File");
			const editor = new TextEditor();
			expect((await editor.getFilePath()).endsWith('vsextensions_controller_spec.rb')).to.be.true;
		});
	});

	describe('Command: Open Test File', () => {
		it('Open controller test', async () => {
			await openFile('app/controllers/vsextensions_controller.rb', 3, 26);
			await executeCommand("Rails GoTo: Class File");
			const editor = new TextEditor();
			expect((await editor.getFilePath()).endsWith('models/vsextension.rb')).to.be.true;
		});
	});

	describe('Command: Open RelationShip Model File', () => {
		it('Open relationship', async () => {
			await openFile('app/models/command.rb', 2, 18);
			await executeCommand("Rails GoTo: Open RelationShip Model File");
			const editor = new TextEditor();
			expect((await editor.getFilePath()).endsWith('models/vsextension.rb')).to.be.true;
		});
	});
});
