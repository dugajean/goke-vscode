import { execSync } from 'child_process';
import * as vscode from 'vscode';
import { Task } from './Task';

export class TaskDataProvider implements vscode.TreeDataProvider<Task> {
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
