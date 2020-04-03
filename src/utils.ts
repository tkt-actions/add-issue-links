import {BranchIssueNumNotFound} from './domain/error/BranchIssueNumNotFound'

export function getIssueNumber(
  branchName: string,
  branchPrefix: string
): number {
  const pattern = new RegExp(`${branchPrefix}([0-9]+)`)
  const result = branchName.match(pattern)

  if (!result)
    throw new BranchIssueNumNotFound(
      'Skiped process to add an issue reference to a pull request.'
    )

  return parseInt(result[1])
}
