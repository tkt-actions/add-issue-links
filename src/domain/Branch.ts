import { BranchIssueNumNotFound } from './error/BranchIssueNumNotFound';

export class Branch {
  constructor(private readonly branchName: string) {}

  getIssueNumber(branchPrefix?: string, branchSuffix?: string): number {
    const pattern = new RegExp(`${branchPrefix}([0-9]+)${branchSuffix}`);
    const result = this.branchName.match(pattern);

    if (!result)
      throw new BranchIssueNumNotFound(
        'Skiped process to add an issue reference to a pull request.',
      );

    return parseInt(result[1]);
  }
}
