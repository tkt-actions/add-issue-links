"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Branch = void 0;
const BranchIssueNumNotFound_1 = require("./error/BranchIssueNumNotFound");
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
//# sourceMappingURL=Branch.js.map