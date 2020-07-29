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
//# sourceMappingURL=BaseError.js.map