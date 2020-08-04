import { Resolve } from './../../../../../domain/resolve/Resolve';
import { TextMapping } from '../text/Text';
import { Repository } from './../../../../../domain/repository/Repository';

export class IssueLink {
  private static readonly resolveStr = 'Resolve';

  constructor(
    private readonly issueNumber: number,
    private readonly resolve: Resolve,
    private readonly repository?: Repository,
  ) {}

  private createRepositoryText = () =>
    this.repository ? this.repository.createText() : TextMapping.blank;
  private createIssueLink = (): string => '#' + this.issueNumber;
  private createResolvePrefix = (): string =>
    this.resolve.isTrue
      ? IssueLink.resolveStr + TextMapping.whitespace
      : TextMapping.blank;

  createText = () =>
    this.createResolvePrefix() +
    this.createRepositoryText() +
    this.createIssueLink();
}
