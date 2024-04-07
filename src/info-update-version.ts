import { extensions, Uri } from 'vscode';
import { posix } from 'path';
import { existsSync, readFileSync, writeFileSync } from 'fs';
import { showInfoMsg } from './helpers-vscode';

const EXT_ID = 'LukasPol.rails-go-to';
const CONFIG_FILE = 'user.rails-go-to.config.json';

interface ExtensionConfig {
  version: string;
  needShowMsg: boolean;
}

export class InfoUpdateVersion {
  private readonly extension: any;
  private readonly configFileUri: Uri;

  constructor() {
    this.extension = extensions.getExtension(EXT_ID);
    const extensionFolderUri = Uri.file(this.extension.extensionPath);
    this.configFileUri = extensionFolderUri.with({path: posix.join(extensionFolderUri.path, CONFIG_FILE)});
  }

  init(): void {
    if (!existsSync(this.configFileUri.fsPath)) {
      this.saveExtensionVersion(true);
      showInfoMsg('Enjoy the features added!');
    } else {
      const userConfig: ExtensionConfig = JSON.parse(readFileSync(this.configFileUri.fsPath, 'utf-8'));

      if (!userConfig.needShowMsg) { return }

      if (this.isUpdateVersion(userConfig)) {
        showInfoMsg('Extesion Updated. Enjoy the new features added!');
        this.saveExtensionVersion(); 
      }
    }
  }

  get currentVersionExt(): string {
    return this.extension.packageJSON.version;
  }

  isUpdateVersion(userConfig: ExtensionConfig): boolean {
    const splitVersion = (input: string): {major: number; minor: number; patch: number} => {
      const [major, minor, patch] = input.split('.').map(i => parseInt(i, 10));
      return {major, minor, patch};
    };

    const versionCurrent = splitVersion(this.currentVersionExt);
    const versionOld = splitVersion(userConfig.version);

    const update = (
      versionCurrent.major > versionOld.major ||
      versionCurrent.minor > versionOld.minor ||
      versionCurrent.patch > versionOld.patch
    );

    return update;
  }

  saveExtensionVersion(needShowMsg: boolean = false) {
    const config: ExtensionConfig = {
      version: this.currentVersionExt,
      needShowMsg: needShowMsg,
    };

    writeFileSync(this.configFileUri.fsPath, JSON.stringify(config, null, 2), 'utf-8');
  }
}
