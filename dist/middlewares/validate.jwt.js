"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const validateJwt = (req, res, next) => {
    // x-token headers
    const token = req.header('x-token');
    if (!token) {
        return res.status(401).json({
            ok: false,
            message: 'There is no token in the request.',
        });
    }
    try {
        const jwtSecret = process.env.SECRET_JWT_SEED || '';
        const { uid, name } = jsonwebtoken_1.default.verify(token, jwtSecret);
        req.uid = uid;
        req.name = name;
    }
    catch (error) {
        console.error(error);
        return res.status(401).json({
            ok: false,
            message: 'Invalid auth token.',
        });
    }
    next();
};
exports.default = validateJwt;
//# sourceMappingURL=validate.jwt.js.map