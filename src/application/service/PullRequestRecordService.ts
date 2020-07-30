import { Context } from '@actions/github/lib/context';
import { PullRequestRepository } from '../repository/PullRequestRepository';
import { Position } from './../../domain/position/Position';

export class PullRequestRecordService {
  constructor(private readonly pullRequestRepository: PullRequestRepository) {}

  addRelatedIssueNumberToBody = async (
    issueNumber: number,
    position: Position,
    context: Context,
  ) => {
    const { repo, issue } = context;
    const pr = await this.pullRequestRepository.get(
      issue.number,
      repo.owner,
      repo.repo,
    );
    pr.body.addRelatedIssueSection(issueNumber, position);
    return await this.pullRequestRepository.update(pr);
  };
}
