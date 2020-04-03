import {getIssueNumber} from '../src/utils'
import {BranchIssueNumNotFound} from '../src/domain/error/BranchIssueNumNotFound'

describe('getIssueNumber', () => {
  it('Gets the issue number based on branch name', () => {
    const branchName = 'issue-29'
    const branchNamePrefix = 'issue-'
    const issueNumber = getIssueNumber(branchName, branchNamePrefix)
    expect(issueNumber).toBe(29)
  })

  it('the branch name have a not match pattern', () => {
    const branchName = 'patch1'
    expect(() => getIssueNumber(branchName, branchName)).toThrow(
      BranchIssueNumNotFound
    )
  })
})
