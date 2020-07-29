"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PullRequestRecordService = void 0;
class PullRequestRecordService {
    constructor(pullRequestRepository) {
        this.pullRequestRepository = pullRequestRepository;
        this.addRelatedIssueNumberToBody = async (issueNumber, context) => {
            const { repo, issue } = context;
            const pr = await this.pullRequestRepository.get(issue.number, repo.owner, repo.repo);
            return await this.pullRequestRepository.update(pr.addRelatedIssueNumberToBody(issueNumber));
        };
    }
}
exports.PullRequestRecordService = PullRequestRecordService;
//# sourceMappingURL=PullRequestRecordService.js.map