define("domain/error/BaseError", ["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.BaseError = void 0;
    class BaseError extends Error {
        constructor(e) {
            super(e);
            this.name = new.target.name;
        }
    }
    exports.BaseError = BaseError;
});
define("domain/error/BranchIssueNumNotFound", ["require", "exports", "domain/error/BaseError"], function (require, exports, BaseError_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.BranchIssueNumNotFound = void 0;
    class BranchIssueNumNotFound extends BaseError_1.BaseError {
        constructor(e) {
            super(e);
        }
    }
    exports.BranchIssueNumNotFound = BranchIssueNumNotFound;
});
define("domain/PullRequest", ["require", "exports"], function (require, exports) {
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
});
define("application/repository/PullRequestRepository", ["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
});
define("infrastructure/datastore/PullRequestDataStore", ["require", "exports", "domain/PullRequest"], function (require, exports, PullRequest_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.PullRequestDataStore = void 0;
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
});
define("application/service/PullRequestRecordService", ["require", "exports"], function (require, exports) {
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
});
define("domain/Branch", ["require", "exports", "domain/error/BranchIssueNumNotFound"], function (require, exports, BranchIssueNumNotFound_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.Branch = void 0;
    class Branch {
        constructor(branchName) {
            this.branchName = branchName;
        }
        getIssueNumber(branchPrefix) {
            const pattern = new RegExp(`${branchPrefix}([0-9]+)`);
            const result = this.branchName.match(pattern);
            if (!result)
                throw new BranchIssueNumNotFound_1.BranchIssueNumNotFound('Skiped process to add an issue reference to a pull request.');
            return parseInt(result[1]);
        }
    }
    exports.Branch = Branch;
});
define("application/service/BranchQueryService", ["require", "exports", "domain/Branch"], function (require, exports, Branch_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.BranchQueryService = void 0;
    class BranchQueryService {
        constructor(context) {
            this.context = context;
            this.getBranch = () => {
                var _a;
                const branchName = (_a = this.context.payload.pull_request) === null || _a === void 0 ? void 0 : _a.head.ref;
                return new Branch_1.Branch(branchName);
            };
        }
    }
    exports.BranchQueryService = BranchQueryService;
});
define("main", ["require", "exports", "@actions/core", "@actions/github", "domain/error/BranchIssueNumNotFound", "infrastructure/datastore/PullRequestDataStore", "application/service/PullRequestRecordService", "application/service/BranchQueryService"], function (require, exports, core, github, BranchIssueNumNotFound_2, PullRequestDataStore_1, PullRequestRecordService_1, BranchQueryService_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    async function run() {
        try {
            const withInput = {
                token: core.getInput('repo-token', { required: true }),
                branchPrefix: core.getInput('branch-prefix', { required: true }),
            };
            const issueNumber = new BranchQueryService_1.BranchQueryService(github.context)
                .getBranch()
                .getIssueNumber(withInput.branchPrefix);
            const prUpdateResult = await new PullRequestRecordService_1.PullRequestRecordService(new PullRequestDataStore_1.PullRequestDataStore(new github.GitHub(withInput.token))).addRelatedIssueNumberToBody(issueNumber, github.context);
            core.info(`Added issue #${issueNumber} reference to pull request #${prUpdateResult.data.number}.\n${prUpdateResult.data.html_url}`);
        }
        catch (error) {
            if (error instanceof BranchIssueNumNotFound_2.BranchIssueNumNotFound)
                return core.info(error.message);
            core.setFailed(error.message);
        }
    }
    run();
});
//# sourceMappingURL=main.js.map