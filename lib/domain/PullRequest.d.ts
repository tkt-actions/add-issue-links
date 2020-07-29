export declare class PullRequest {
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
