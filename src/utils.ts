export function getIssueNumber(branchName: string, pattern: RegExp): number {
  const result = branchName.match(pattern)

  if (result !== null) {
    return parseInt(result[1])
  }

  return 0
}
