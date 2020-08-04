import { PullRequestRepository } from '../repository/PullRequestRepository';
import { Position } from './../../domain/position/Position';
import { Resolve } from './../../domain/resolve/Resolve';
import { IssueLinkSection } from './../../domain/pullRequest/pullRequestBody/issueLinkSection/IssueLinkSection';
import { IssueLink } from './../../domain/pullRequest/pullRequestBody/issueLinkSection/issueLink/IssueLinkText';
import { Repository } from './../../domain/repository/Repository';
import { PullRequest } from './../../domain/pullRequest/PullRequest';

export class PullRequestRecordService {
  constructor(private readonly pullRequestRepository: PullRequestRepository) {}

  addRelatedIssueNumberAsComment = async (
    pullRequest: PullRequest,
    issueNumber: number,
    resolve: Resolve,
    repository: Repository | undefined,
  ) =>
    this.pullRequestRepository.createComment(
      pullRequest,
      new IssueLinkSection([new IssueLink(issueNumber, resolve, repository)]),
    );

  addRelatedIssueNumberToBody = async (
    pullRequest: PullRequest,
    issueNumber: number,
    position: Position,
    resolve: Resolve,
    repository: Repository | undefined,
  ) => {
    pullRequest.body.addRelatedIssueSection(
      new IssueLinkSection([new IssueLink(issueNumber, resolve, repository)]),
      position,
    );
    return await this.pullRequestRepository.update(pullRequest);
  };
}
