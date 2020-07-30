import { PullRequest } from '../../domain/pullRequest/PullRequest';
import { Octokit } from '../../types/Octokit';

export interface PullRequestRepository {
  update(
    pullRequest: PullRequest,
  ): Promise<Octokit.Response<Octokit.PullsUpdateResponse>>;
  get(number: number, owner: string, repo: string): Promise<PullRequest>;
}
