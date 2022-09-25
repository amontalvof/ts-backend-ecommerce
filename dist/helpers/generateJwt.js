"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const generateJWT = (uid, name) => {
    return new Promise((resolve, reject) => {
        const payload = { uid, name };
        const seed = process.env.SECRET_JWT_SEED || '';
        jsonwebtoken_1.default.sign(payload, seed, {
            expiresIn: '1h',
        }, (err, token) => {
            if (err) {
                console.error(err);
                reject('The token could not be generated.');
            }
            resolve(token);
        });
    });
};
exports.default = generateJWT;
//# sourceMappingURL=generateJwt.js.map