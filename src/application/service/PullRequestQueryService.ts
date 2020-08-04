import { Context } from '@actions/github/lib/context';
import { PullRequestRepository } from '../repository/PullRequestRepository';
import { PullRequest } from './../../domain/pullRequest/PullRequest';

export class PullRequestQueryService {
  constructor(private readonly pullRequestRepository: PullRequestRepository) {}

  findOne = async (context: Context): Promise<PullRequest> => {
    const { repo, issue } = context;
    return this.pullRequestRepository.get(issue.number, repo.owner, repo.repo);
  };
}
