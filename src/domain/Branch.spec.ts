import { Branch } from './Branch';
import { BranchIssueNumNotFound } from './error/BranchIssueNumNotFound';

describe('Branch', () => {
  describe('getIssueNumber', () => {
    it('Gets the issue number based on branch name with prefix', () => {
      const branchName = 'feature/issue-29/update';
      const branch = new Branch(branchName);
      const branchNamePrefix = 'issue-';
      const branchNameSuffix = '';
      const issueNumber = branch.getIssueNumber(
        branchNamePrefix,
        branchNameSuffix,
      );
      expect(issueNumber).toBe(29);
    });

    it('the branch name has no match pattern', () => {
      const branchName = 'patch-1';
      const branch = new Branch(branchName);
      const branchNamePrefix = 'issue-';
      const branchNameSuffix = '';
      expect(() =>
        branch.getIssueNumber(branchNamePrefix, branchNameSuffix),
      ).toThrow(BranchIssueNumNotFound);
    });
    it('the branch name has no prefix and suffix', () => {
      const branchName = '12/feature/action';
      const branch = new Branch(branchName);
      const branchNamePrefix = '';
      const branchNameSuffix = '';
      const issueNumber = branch.getIssueNumber(
        branchNamePrefix,
        branchNameSuffix,
      );
      expect(issueNumber).toBe(12);
    });
    it('the branch name has suffix', () => {
      const branchName = '93.issue';
      const branch = new Branch(branchName);
      const branchNamePrefix = '';
      const branchNameSuffix = '.';
      const issueNumber = branch.getIssueNumber(
        branchNamePrefix,
        branchNameSuffix,
      );
      expect(issueNumber).toBe(93);
    });
    it('the branch name has both prefix and suffix', () => {
      const branchName = 'feature/#123_issue/action';
      const branch = new Branch(branchName);
      const branchNamePrefix = '#';
      const branchNameSuffix = '_';
      const issueNumber = branch.getIssueNumber(
        branchNamePrefix,
        branchNameSuffix,
      );
      expect(issueNumber).toBe(123);
    });
  });
});
