export declare class Branch {
    private readonly branchName;
    constructor(branchName: string);
    getIssueNumber(branchPrefix: string): number;
}
