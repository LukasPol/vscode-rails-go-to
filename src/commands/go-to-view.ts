import { ActiveFile } from "../active-file";
import { findFilesVscode, openOrSelectFile } from "../helpers-vscode";

class GoToView {
  private activeFile: ActiveFile;

  constructor() {
    this.activeFile = new ActiveFile();
  }

  async goTo() {
    if (!this.activeFile.isController) { return; }

    const viewName = `app/views/${this.controllerName}/${this.activeFile.wordsSelected}*`;

    await this.goToView(viewName);
  }

  async goToView(viewName: string) {
    const viewFiles = await findFilesVscode(viewName);
    await openOrSelectFile(viewFiles);
  }

  get controllerName(): string {
    return this.activeFile.relativePath.split('app/controllers/')[1].split('_controller.rb')[0];
  }
}

export async function commandGoToView(params: string) {
  const goToView = new GoToView();

  if (params) {
    return await goToView.goToView(params);
  }

  return await goToView.goTo();
}
