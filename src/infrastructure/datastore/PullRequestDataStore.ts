import { GitHub } from '@actions/github';
import { PullRequest } from '../../domain/pullRequest/PullRequest';
import { PullRequestRepository } from './../../application/repository/PullRequestRepository';
import { PullRequestBody } from './../../domain/pullRequest/pullRequestBody/PullRequestBody';
import { IssueLinkSection } from './../../domain/pullRequest/pullRequestBody/issueLinkSection/IssueLinkSection';

export class PullRequestDataStore implements PullRequestRepository {
  private readonly client: GitHub['pulls'];
  private readonly issuesClient: GitHub['issues'];
  constructor(client: GitHub) {
    this.client = client.pulls;
    this.issuesClient = client.issues;
  }
  update = async (pullRequest: PullRequest) =>
    this.client.update({
      body: pullRequest.body.value,
      pull_number: pullRequest.number,
      owner: pullRequest.owner,
      repo: pullRequest.repo,
    });
  get = async (number: number, owner: string, repo: string) => {
    const data = (
      await this.client.get({
        pull_number: number,
        owner,
        repo,
      })
    ).data;
    return new PullRequest(
      data.title,
      new PullRequestBody(data.body),
      data.number,
      owner,
      repo,
    );
  };
  createComment = async (
    pullRequest: PullRequest,
    issueLinkSection: IssueLinkSection,
  ): Promise<void> => {
    await this.issuesClient.createComment({
      body: issueLinkSection.createText(),
      repo: pullRequest.repo,
      owner: pullRequest.owner,
      issue_number: pullRequest.number,
    });
  };
}
