import { Context } from '@actions/github/lib/context';
import { PullRequestRepository } from '../repository/PullRequestRepository';
import { Position } from './../../domain/position/Position';
import { Resolve } from 'src/domain/resolve/Resolve';
import { IssueLinkSection } from 'src/domain/pullRequest/pullRequestBody/issueLinkSection/IssueLinkSection';
import { IssueLink } from 'src/domain/pullRequest/pullRequestBody/issueLinkSection/issueLink/IssueLinkText';

export class PullRequestRecordService {
  constructor(private readonly pullRequestRepository: PullRequestRepository) {}

  addRelatedIssueNumberToBody = async (
    issueNumber: number,
    position: Position,
    resolve: Resolve,
    context: Context,
  ) => {
    const { repo, issue } = context;
    const pr = await this.pullRequestRepository.get(
      issue.number,
      repo.owner,
      repo.repo,
    );
    pr.body.addRelatedIssueSection(
      new IssueLinkSection([new IssueLink(issueNumber, resolve)]),
      position,
    );
    return await this.pullRequestRepository.update(pr);
  };
}
