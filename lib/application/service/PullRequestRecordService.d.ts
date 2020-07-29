import { Context } from '@actions/github/lib/context';
import { PullRequestRepository } from '../repository/PullRequestRepository';
export declare class PullRequestRecordService {
    private readonly pullRequestRepository;
    constructor(pullRequestRepository: PullRequestRepository);
    addRelatedIssueNumberToBody: (issueNumber: number, context: Context) => Promise<import("../../types/Octokit").Octokit.Response<import("../../types/Octokit").Octokit.PullsUpdateResponse>>;
}
