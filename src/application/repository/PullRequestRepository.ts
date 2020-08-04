import { PullRequest } from '../../domain/pullRequest/PullRequest';
import { Octokit } from '../../types/Octokit';
import { IssueLinkSection } from './../../domain/pullRequest/pullRequestBody/issueLinkSection/IssueLinkSection';

export interface PullRequestRepository {
  update(
    pullRequest: PullRequest,
  ): Promise<Octokit.Response<Octokit.PullsUpdateResponse>>; // TODO: Refactor
  get(number: number, owner: string, repo: string): Promise<PullRequest>;
  createComment(
    pullRequest: PullRequest,
    issueLink: IssueLinkSection,
  ): Promise<void>;
}
