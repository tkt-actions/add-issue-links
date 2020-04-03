import {GitHub} from '@actions/github'
import {PullRequest} from '../domain/PullRequest'

export class PullRequestRepository {
  client: GitHub['pulls']
  constructor(client: GitHub) {
    this.client = client.pulls
  }
  update = async (pullRequest: PullRequest) =>
    this.client.update({
      body: pullRequest.body,
      number: pullRequest.number,
      owner: pullRequest.owner,
      repo: pullRequest.repo
    })
  get = async (number: number, owner: string, repo: string) => {
    const data = (
      await this.client.get({
        number,
        owner,
        repo
      })
    ).data
    return new PullRequest(data.title, data.body, data.number, owner, repo)
  }
}
