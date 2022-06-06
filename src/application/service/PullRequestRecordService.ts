import { PullRequestRepository } from '../repository/PullRequestRepository';
import { Position } from './../../domain/position/Position';
import { Resolve } from './../../domain/resolve/Resolve';
import { IssueLinkSection } from './../../domain/pullRequest/pullRequestBody/issueLinkSection/IssueLinkSection';
import { IssueLink } from './../../domain/pullRequest/pullRequestBody/issueLinkSection/issueLink/IssueLinkText';
import { Repository } from './../../domain/repository/Repository';
import { PullRequest } from './../../domain/pullRequest/PullRequest';
import { ResolveWord } from 'src/domain/pullRequest/pullRequestBody/issueLinkSection/resolveWord/ResolveWord';
import { Header } from 'src/domain/pullRequest/pullRequestBody/issueLinkSection/header/Header';

export class PullRequestRecordService {
  constructor(private readonly pullRequestRepository: PullRequestRepository) {}

  addRelatedIssueNumberAsComment = async (
    pullRequest: PullRequest,
    header: Header,
    issueNumber: number,
    resolve: Resolve,
    resolveWord: ResolveWord,
    repository: Repository | undefined,
  ) =>
    this.pullRequestRepository.createComment(
      pullRequest,
      new IssueLinkSection(
        [new IssueLink(issueNumber, resolve, resolveWord, repository)],
        header,
      ),
    );

  addRelatedIssueNumberToBody = async (
    pullRequest: PullRequest,
    issueNumber: number,
    position: Position,
    header: Header,
    resolve: Resolve,
    resolveWord: ResolveWord,
    repository: Repository | undefined,
  ) => {
    pullRequest.body.addRelatedIssueSection(
      new IssueLinkSection(
        [new IssueLink(issueNumber, resolve, resolveWord, repository)],
        header,
      ),
      position,
    );
    return await this.pullRequestRepository.update(pullRequest);
  };
}
