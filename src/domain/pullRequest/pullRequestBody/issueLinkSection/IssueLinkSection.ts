import { TextMapping } from './text/Text';
import { IssueLink } from './issueLink/IssueLinkText';
import { Header } from './header/Header';

export class IssueLinkSection {
  constructor(private issueLinks: IssueLink[], private header: Header) {}

  private createIssueLinkListText = () =>
    this.issueLinks.map((link) => TextMapping.listPrefix + link.createText());

  createText = (): string =>
    this.header.value +
    TextMapping.lineBreak +
    TextMapping.lineBreak +
    this.createIssueLinkListText();
}
