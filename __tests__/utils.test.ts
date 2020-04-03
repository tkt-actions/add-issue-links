import {getIssueNumber} from '../src/utils'

describe('getIssueNumber', () => {
  it('Gets the issue number based on branch name', () => {
    const branchName = 'issue-29'
    const pattern = /issue-([0-9]+)/

    const issueNumber = getIssueNumber(branchName, pattern)

    expect(issueNumber).toBe(29)
  })

  it('Gets number 0 if the branch name is a pattern not match', () => {
    const branchName = 'patch1'
    const pattern = /issue-([0-9]+)/

    const issueNumber = getIssueNumber(branchName, pattern)

    expect(issueNumber).toBe(0)
  })
})
