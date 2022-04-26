import { Response, NextFunction } from 'express';
import { IExtendedRequest } from '../types/request';

const validateFile = (
    req: IExtendedRequest,
    res: Response,
    next: NextFunction
) => {
    if (
        !req.files ||
        Object.keys(req.files).length === 0 ||
        !req.files.sampleFile
    ) {
        return res
            .status(400)
            .json({ ok: false, message: 'No files were uploaded.' });
    }
    next();
};

export default validateFile;
