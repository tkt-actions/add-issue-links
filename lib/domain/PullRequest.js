"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PullRequest = void 0;
class PullRequest {
    constructor(title, body, number, owner, repo) {
        this.addRelatedIssueNumberToBody = (issueNumber) => this.addIntoTopOfBody(`# Issue\n- Resolve #${issueNumber}`);
        this.addIntoTopOfBody = (str) => this.updateBody(`${str}\n${this.body}`);
        this.updateBody = (body) => {
            this.body = body;
            return this;
        };
        this.title = title;
        this.body = body;
        this.number = number;
        this.owner = owner;
        this.repo = repo;
    }
}
exports.PullRequest = PullRequest;
//# sourceMappingURL=PullRequest.js.map