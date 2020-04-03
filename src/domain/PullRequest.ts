export class PullRequest {
  title: string
  body: string
  number: number
  owner: string
  repo: string

  constructor(
    title: string,
    body: string,
    number: number,
    owner: string,
    repo: string
  ) {
    this.title = title
    this.body = body
    this.number = number
    this.owner = owner
    this.repo = repo
  }
  addRelatedIssueNumberToBody = (issueNumber: number) =>
    this.addIntoTopOfBody(`Issue\n- Resolve #${issueNumber}`)
  addIntoTopOfBody = (str: string) => this.updateBody(`${str}\n${this.body}`)
  updateBody = (body: string) => {
    this.body = body
    return this
  }
}
