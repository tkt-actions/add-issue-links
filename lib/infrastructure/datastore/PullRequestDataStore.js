"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PullRequestDataStore = void 0;
const PullRequest_1 = require("../../domain/PullRequest");
class PullRequestDataStore {
    constructor(client) {
        this.update = async (pullRequest) => this.client.update({
            body: pullRequest.body,
            pull_number: pullRequest.number,
            owner: pullRequest.owner,
            repo: pullRequest.repo,
        });
        this.get = async (number, owner, repo) => {
            const data = (await this.client.get({
                pull_number: number,
                owner,
                repo,
            })).data;
            return new PullRequest_1.PullRequest(data.title, data.body, data.number, owner, repo);
        };
        this.client = client.pulls;
    }
}
exports.PullRequestDataStore = PullRequestDataStore;
//# sourceMappingURL=PullRequestDataStore.js.map