import { PullRequest } from '../../domain/PullRequest';
import { Octokit } from 'src/types/Octokit';

export interface PullRequestRepository {
  update(
    pullRequest: PullRequest,
  ): Promise<Octokit.Response<Octokit.PullsUpdateResponse>>;
  get(number: number, owner: string, repo: string): Promise<PullRequest>;
}
