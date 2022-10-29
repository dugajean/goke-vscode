import { execSync } from 'child_process';
import path = require('path');
import * as vscode from 'vscode';

export class TasksView {
  private _view: vscode.TreeView<Task>;
  private _dataProvider: TaskDataProvider;

  get view() {
    return this._view;
  }

  get dataProvider() {
    return this._dataProvider;
  }

  constructor(context: vscode.ExtensionContext) {
    this._dataProvider = new TaskDataProvider();

    this._view = vscode.window.createTreeView('gokeTasks', {
      treeDataProvider: this._dataProvider,
    });

    context.subscriptions.push(this._view);
  }
}

class TaskDataProvider implements vscode.TreeDataProvider<Task> {
  private _onDidChangeTreeData: vscode.EventEmitter<
    Task | undefined | null | void
  > = new vscode.EventEmitter<Task | undefined | null | void>();

  readonly onDidChangeTreeData: vscode.Event<Task | undefined | null | void> =
    this._onDidChangeTreeData.event;

  getChildren(): Task[] {
    const cwd = vscode?.workspace?.workspaceFolders?.[0].uri.path;
    const tasksStr = execSync(`cd ${cwd} && goke -t`).toString();

    return tasksStr
      .split('\n')
      .filter((t) => !!t)
      .map((t) => new Task(t));
  }

  getTreeItem(task: Task): vscode.TreeItem {
    return task;
  }

  public reload(): void {
    this._onDidChangeTreeData.fire();
  }
}

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
      'resources',
      theme,
      'dependency.svg'
    );
  }
}
