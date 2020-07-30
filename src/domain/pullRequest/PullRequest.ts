import { PullRequestBody } from './pullRequestBody/PullRequestBody';

export class PullRequest {
  title: string;
  body: PullRequestBody;
  number: number;
  owner: string;
  repo: string;

  constructor(
    title: string,
    body: PullRequestBody,
    number: number,
    owner: string,
    repo: string,
  ) {
    this.title = title;
    this.body = body;
    this.number = number;
    this.owner = owner;
    this.repo = repo;
  }
}
