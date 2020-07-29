import { Context } from '@actions/github/lib/context';
import { PullRequestRepository } from '../repository/PullRequestRepository';

export class PullRequestRecordService {
  constructor(private readonly pullRequestRepository: PullRequestRepository) {}

  addRelatedIssueNumberToBody = async (
    issueNumber: number,
    context: Context,
  ) => {
    const { repo, issue } = context;
    const pr = await this.pullRequestRepository.get(
      issue.number,
      repo.owner,
      repo.repo,
    );
    return await this.pullRequestRepository.update(
      pr.addRelatedIssueNumberToBody(issueNumber),
    );
  };
}
