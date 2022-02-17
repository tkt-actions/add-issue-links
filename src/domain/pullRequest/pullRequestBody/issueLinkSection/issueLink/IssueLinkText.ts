import { Resolve } from './../../../../../domain/resolve/Resolve';
import { TextMapping } from '../text/Text';
import { Repository } from './../../../../../domain/repository/Repository';
import { ResolveWord } from '../resolveWord/ResolveWord';

export class IssueLink {
  constructor(
    private readonly issueNumber: number,
    private readonly resolve: Resolve,
    private readonly resolveWord: ResolveWord,
    private readonly repository?: Repository,
  ) {}

  private createRepositoryText = () =>
    this.repository ? this.repository.createText() : TextMapping.blank;
  private createIssueLink = (): string => '#' + this.issueNumber;
  private createResolvePrefix = (): string =>
    this.resolve.isTrue
      ? this.resolveWord.value + TextMapping.whitespace
      : TextMapping.blank;

  createText = () =>
    this.createResolvePrefix() +
    this.createRepositoryText() +
    this.createIssueLink();
}
