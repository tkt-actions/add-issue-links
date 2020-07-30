import { GitHub } from '@actions/github';
import { PullRequest } from '../../domain/PullRequest';
import { PullRequestRepository } from './../../application/repository/PullRequestRepository';

export class PullRequestDataStore implements PullRequestRepository {
  private readonly client: GitHub['pulls'];
  constructor(client: GitHub) {
    this.client = client.pulls;
  }
  update = async (pullRequest: PullRequest) =>
    this.client.update({
      body: pullRequest.body,
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
    return new PullRequest(data.title, data.body, data.number, owner, repo);
  };
}
