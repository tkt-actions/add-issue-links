import { Context } from '@actions/github/lib/context';
import { PullRequestRepository } from '../repository/PullRequestRepository';
import { Position } from './../../domain/position/Position';
import { Resolve } from './../../domain/resolve/Resolve';
import { IssueLinkSection } from './../../domain/pullRequest/pullRequestBody/issueLinkSection/IssueLinkSection';
import { IssueLink } from './../../domain/pullRequest/pullRequestBody/issueLinkSection/issueLink/IssueLinkText';
import { Repository } from 'src/domain/repository/Repository';

export class PullRequestRecordService {
  constructor(private readonly pullRequestRepository: PullRequestRepository) {}

  addRelatedIssueNumberToBody = async (
    issueNumber: number,
    position: Position,
    resolve: Resolve,
    repository: Repository | undefined,
    context: Context,
  ) => {
    const { repo, issue } = context;
    const pr = await this.pullRequestRepository.get(
      issue.number,
      repo.owner,
      repo.repo,
    );
    pr.body.addRelatedIssueSection(
      new IssueLinkSection([new IssueLink(issueNumber, resolve, repository)]),
      position,
    );
    return await this.pullRequestRepository.update(pr);
  };
}
