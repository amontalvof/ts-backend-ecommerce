import path from 'path';
import { Response, NextFunction } from 'express';
import { IExtendedRequest } from '../types/request';

const validateImg = (
    req: IExtendedRequest,
    res: Response,
    next: NextFunction
) => {
    const file = req.files.sampleFile;
    const extensionName = path.extname(file.name);
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

export default validateImg;
