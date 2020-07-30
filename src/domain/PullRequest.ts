export class PullRequest {
  title: string;
  body: string;
  number: number;
  owner: string;
  repo: string;

  constructor(
    title: string,
    body: string,
    number: number,
    owner: string,
    repo: string,
  ) {
    this.title = title;
    this.body = body;
    this.number = number;
    this.owner = owner;
    this.repo = repo;
  }

  addRelatedIssueNumberToBody = (issueNumber: number) =>
    this.addIntoTopOfBody(`# Issue\n- Resolve #${issueNumber}`);

  addIntoTopOfBody = (str: string) => this.setBody(`${str}\n${this.body}`);

  addIntoBottomOfBody = (str: string) => this.setBody(`${this.body}\n${str}`);

  private static issueLinkText = (issueNumber: number) =>
    `# Related Issue\n\n- Resolve #${issueNumber}`;

  private setBody = (body: string) => {
    this.body = body;
    return this;
  };
}
