"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const validateFile = (req, res, next) => {
    if (!req.files ||
        Object.keys(req.files).length === 0 ||
        !req.files.sampleFile) {
        return res
            .status(400)
            .json({ ok: false, message: 'No files were uploaded.' });
    }
    next();
};
exports.default = validateFile;
//# sourceMappingURL=validate.file.js.map