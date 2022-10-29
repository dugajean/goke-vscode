import path = require('path');
import * as vscode from 'vscode';

export class Task extends vscode.TreeItem {
  constructor(public readonly label: string) {
    super(label, vscode.TreeItemCollapsibleState.None);
  }

  iconPath: Record<'light' | 'dark', string> = {
    light: this.getIcon('light'),
    dark: this.getIcon('dark'),
  };

  private getIcon(theme: 'light' | 'dark') {
    return path.join(
      __filename,
      '..',
      '..',
      '..',
      'resources',
      theme,
      'dependency.svg'
    );
  }
}
