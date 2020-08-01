import { TextMapping } from './text/Text';
import { IssueLink } from './issueLink/IssueLinkText';

export class IssueLinkSection {
  private static readonly headingStr = 'Related Issue';

  private static readonly headingText =
    TextMapping.headingPrefix +
    IssueLinkSection.headingStr +
    TextMapping.lineBreak;

  constructor(private issueLinks: IssueLink[]) {}

  private createIssueLinkListText = () =>
    this.issueLinks.map(link => TextMapping.listPrefix + link.createText());

  createText = (): string =>
    IssueLinkSection.headingText +
    TextMapping.lineBreak +
    this.createIssueLinkListText();
}
