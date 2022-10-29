import * as vscode from 'vscode';
import { Task } from './Task';
import { TaskDataProvider } from './TaskDataProvider';

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
