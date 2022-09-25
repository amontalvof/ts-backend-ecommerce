"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const path_1 = __importDefault(require("path"));
const validateImg = (req, res, next) => {
    const file = req.files.sampleFile;
    const extensionName = path_1.default.extname(file.name);
    const size = file.size;
    const allowedExtension = ['.png', '.jpg', '.jpeg'];
    if (!allowedExtension.includes(extensionName)) {
        return res.status(422).json({
            ok: false,
            message: `Sorry, invalid image. Only ${allowedExtension} extensions are allowed.`,
        });
    }
    if (size > 2000000) {
        return res.status(422).json({
            ok: false,
            message: `Sorry, invalid image. Max size allowed is 2 MB.`,
        });
    }
    next();
};
exports.default = validateImg;
//# sourceMappingURL=validate.img.js.map