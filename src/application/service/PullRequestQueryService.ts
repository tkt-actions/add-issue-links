import { Context } from '@actions/github/lib/context';
import { PullRequestRepository } from '../repository/PullRequestRepository';
import { PullRequest } from './../../domain/pullRequest/PullRequest';
import * as core from '@actions/core';

export class PullRequestQueryService {
  constructor(private readonly pullRequestRepository: PullRequestRepository) {}

  findOne = async (context: Context): Promise<PullRequest> => {
    const { repo, issue } = context;

    core.debug('PullRequestQueryService.findOne:');
    core.debug(
      `コンテキスト情報: repo owner=${repo.owner}, repo name=${repo.repo}, issue number=${issue.number}`,
    );

    if (context.payload.pull_request) {
      core.debug(
        `PR情報(payload): owner=${
          context.payload.repository?.owner?.login || 'unknown'
        }, repo=${context.payload.repository?.name || 'unknown'}, number=${
          context.payload.pull_request.number
        }`,
      );
    }

    const pullRequest = await this.pullRequestRepository.get(
      issue.number,
      repo.owner,
      repo.repo,
    );

    core.debug(
      `取得したPR情報: owner=${pullRequest.owner}, repo=${pullRequest.repo}, number=${pullRequest.number}, title="${pullRequest.title}"`,
    );

    return pullRequest;
  };
}
