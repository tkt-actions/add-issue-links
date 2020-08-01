import { Position } from './../../../domain/position/Position';
import { IssueLinkSection } from './issueLinkSection/IssueLinkSection';

export class PullRequestBody {
  constructor(private _value: string) {}

  add = (text: string, position: Position) =>
    position.getIsTop() ? this.addIntoTop(text) : this.addIntoBottom(text);

  addIntoTop = (str: string) => this.setValue(`${str}\n\n${this._value}`);

  addIntoBottom = (str: string) => this.setValue(`${this._value}\n\n${str}`);

  addRelatedIssueSection = (
    issueLinkSection: IssueLinkSection,
    posision: Position,
  ) => this.add(issueLinkSection.createText(), posision);

  private setValue = (value: string) => (this._value = value);

  get value(): string {
    return this._value;
  }
}
