import { execSync } from 'child_process';
import * as vscode from 'vscode';
import { Task, TasksView } from './tasksView';

export function activate(context: vscode.ExtensionContext) {
  if (!isGokeInstalled()) {
    vscode.window.showErrorMessage(
      `Goke must be available in your path.
      See: https://github.com/dugajean/goke#installation`
    );
    return;
  }

  let view = new TasksView(context);

  const refreshHandler = () => {
    view.dataProvider.reload();
  };

  const runTaskHandler = (task: Task) => {
    const taskName = task.label;
    const cwd = vscode?.workspace?.workspaceFolders?.[0].uri.path;
    const tasksStr = execSync(`cd ${cwd} && goke ${taskName}`).toString();

    vscode.window.showInformationMessage(
      `Executed ${taskName} task. See console for output.`
    );

    console.info(tasksStr);
  };

  context.subscriptions.push(
    vscode.commands.registerCommand('gokeTasks.refresh', refreshHandler)
  );

  context.subscriptions.push(
    vscode.commands.registerCommand('gokeTasks.runTask', runTaskHandler)
  );
}

// This method is called when your extension is deactivated
export function deactivate() {}

function isGokeInstalled(): boolean {
  try {
    execSync('which goke').toString();
    return true;
  } catch (error) {
    return false;
  }
}
