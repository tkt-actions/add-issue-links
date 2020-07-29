"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BranchQueryService = void 0;
const Branch_1 = require("src/domain/Branch");
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
//# sourceMappingURL=BranchQueryService.js.map