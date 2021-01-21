import { Branch } from './Branch';
import { BranchIssueNumNotFound } from './error/BranchIssueNumNotFound';

describe('Branch', () => {
  describe('getIssueNumber', () => {
    it('Gets the issue number based on branch name', () => {
      const branchName = 'feature/issue-29/update';
      const branch = new Branch(branchName);
      const branchNamePrefix = 'issue-';
      const issueNumber = branch.getIssueNumber(branchNamePrefix);
      expect(issueNumber).toBe(29);
    });

    it('the branch name has no match pattern', () => {
      const branchName = 'patch-1';
      const branch = new Branch(branchName);
      const branchNamePrefix = 'issue-';
      expect(() => branch.getIssueNumber(branchNamePrefix)).toThrow(
        BranchIssueNumNotFound,
      );
    });

    it('the branch name has no prefix', () => {
      const branchName = '12/feature/action';
      const branch = new Branch(branchName);
      const branchNamePrefix = '';
      const issueNumber = branch.getIssueNumber(branchNamePrefix);
      expect(issueNumber).toBe(12);
    });
  });
});
