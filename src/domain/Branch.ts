import { BranchIssueNumNotFound } from './error/BranchIssueNumNotFound';
import * as core from '@actions/core';

export class Branch {
  constructor(private readonly branchName: string) {}

  getIssueNumber(branchPrefix?: string): number {
    core.debug(
      `Branch.getIssueNumber: branchName=${this.branchName}, branchPrefix=${
        branchPrefix || '未指定'
      }`,
    );

    const pattern = new RegExp(`${branchPrefix}([0-9]+)`);
    core.debug(`使用する正規表現パターン: ${pattern.toString()}`);

    const result = this.branchName.match(pattern);
    core.debug(`正規表現マッチ結果: ${JSON.stringify(result)}`);

    if (!result) {
      core.debug('ブランチ名からイシュー番号を抽出できませんでした');
      throw new BranchIssueNumNotFound(
        'Skiped process to add an issue reference to a pull request.',
      );
    }

    const issueNumber = parseInt(result[1]);
    core.debug(`抽出されたイシュー番号: ${issueNumber}`);
    return issueNumber;
  }
}
