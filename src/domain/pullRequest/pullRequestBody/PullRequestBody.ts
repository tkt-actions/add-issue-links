import { Position } from 'src/domain/position/Position';

export class PullRequestBody {
  private static issueLinkText = (issueNumber: number) =>
    `# Related Issue\n\n- Resolve #${issueNumber}`;

  constructor(private _value: string) {}

  add = (text: string, position: Position) =>
    position.getIsTop() ? this.addIntoTop(text) : this.addIntoBottom(text);

  addIntoTop = (str: string) => this.setValue(`${str}\n\n${this._value}`);

  addIntoBottom = (str: string) => this.setValue(`${this._value}\n\n${str}`);

  addRelatedIssueSection = (issueNumber: number, posision: Position) =>
    this.add(PullRequestBody.issueLinkText(issueNumber), posision);

  private setValue = (value: string) => (this._value = value);

  get value(): string {
    return this._value;
  }
}
