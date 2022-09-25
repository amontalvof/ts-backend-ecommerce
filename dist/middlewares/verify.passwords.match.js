"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const verifyPasswordsMatch = (password2, req) => {
    var _a, _b;
    if (password2 !== ((_a = req.body) === null || _a === void 0 ? void 0 : _a.regPassword1) &&
        password2 !== ((_b = req.body) === null || _b === void 0 ? void 0 : _b.updPassword1)) {
        throw new Error("The passwords don't match");
    }
    else {
        return password2;
    }
};
exports.default = verifyPasswordsMatch;
//# sourceMappingURL=verify.passwords.match.js.map