declare module "domain/error/BaseError" {
    export abstract class BaseError extends Error {
        constructor(e?: string);
    }
}
declare module "domain/error/BranchIssueNumNotFound" {
    import { BaseError } from "domain/error/BaseError";
    export class BranchIssueNumNotFound extends BaseError {
        constructor(e?: string);
    }
}
declare module "domain/PullRequest" {
    export class PullRequest {
        title: string;
        body: string;
        number: number;
        owner: string;
        repo: string;
        constructor(title: string, body: string, number: number, owner: string, repo: string);
        addRelatedIssueNumberToBody: (issueNumber: number) => this;
        addIntoTopOfBody: (str: string) => this;
        updateBody: (body: string) => this;
    }
}
declare module "application/repository/PullRequestRepository" {
    import { PullRequest } from "domain/PullRequest";
    import { Octokit } from 'src/types/Octokit';
    export interface PullRequestRepository {
        update(pullRequest: PullRequest): Promise<Octokit.Response<Octokit.PullsUpdateResponse>>;
        get(number: number, owner: string, repo: string): Promise<PullRequest>;
    }
}
declare module "infrastructure/datastore/PullRequestDataStore" {
    import { GitHub } from '@actions/github';
    import { PullRequest } from "domain/PullRequest";
    import { PullRequestRepository } from "application/repository/PullRequestRepository";
    export class PullRequestDataStore implements PullRequestRepository {
        private readonly client;
        constructor(client: GitHub);
        update: (pullRequest: PullRequest) => Promise<any>;
        get: (number: number, owner: string, repo: string) => Promise<PullRequest>;
    }
}
declare module "application/service/PullRequestRecordService" {
    import { PullRequestRepository } from "application/repository/PullRequestRepository";
    export class PullRequestRecordService {
        private readonly pullRequestRepository;
        constructor(pullRequestRepository: PullRequestRepository);
        addRelatedIssueNumberToBody: (issueNumber: number, context: any) => Promise<any>;
    }
}
declare module "domain/Branch" {
    export class Branch {
        private readonly branchName;
        constructor(branchName: string);
        getIssueNumber(branchPrefix: string): number;
    }
}
declare module "application/service/BranchQueryService" {
    import { Branch } from "domain/Branch";
    import { Context } from '@actions/github/lib/context';
    export class BranchQueryService {
        private readonly context;
        constructor(context: Context);
        getBranch: () => Branch;
    }
}
declare module "main" { }
