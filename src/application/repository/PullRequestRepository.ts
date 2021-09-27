import { GitHub } from '@actions/github/lib/utils';
import { PullRequest } from '../../domain/pullRequest/PullRequest';
import { IssueLinkSection } from './../../domain/pullRequest/pullRequestBody/issueLinkSection/IssueLinkSection';

export interface PullRequestRepository {
  update(
    pullRequest: PullRequest,
  ): Promise<
    ReturnType<InstanceType<typeof GitHub>['rest']['pulls']['update']>
  >;
  get(number: number, owner: string, repo: string): Promise<PullRequest>;
  createComment(
    pullRequest: PullRequest,
    issueLink: IssueLinkSection,
  ): Promise<void>;
}
