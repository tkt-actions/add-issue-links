import { Resolve } from 'src/domain/resolve/Resolve';
import { TextMapping } from '../text/Text';

export class IssueLink {
  private static readonly resolveStr = 'Resolve';

  constructor(
    private readonly issueNumber: number,
    private readonly resolve: Resolve,
  ) {}

  private createIssueLink = (): string => '#' + this.issueNumber;
  private createResolvePrefix = (): string =>
    this.resolve.isTrue
      ? IssueLink.resolveStr + TextMapping.whitespace
      : TextMapping.blank;

  createText = () => this.createResolvePrefix() + this.createIssueLink();
}
