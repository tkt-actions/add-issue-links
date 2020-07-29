import { GitHub } from '@actions/github';
import { PullRequest } from '../../domain/PullRequest';
import { PullRequestRepository } from 'src/application/repository/PullRequestRepository';
export declare class PullRequestDataStore implements PullRequestRepository {
    private readonly client;
    constructor(client: GitHub);
    update: (pullRequest: PullRequest) => Promise<import("@octokit/rest").Octokit.Response<import("@octokit/rest").Octokit.PullsUpdateResponse>>;
    get: (number: number, owner: string, repo: string) => Promise<PullRequest>;
}
