import { Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { IAuthInfoRequest } from '../types/request';

interface IJwtPayload {
    uid: string;
    name: string;
}

const validateJwt = (
    req: IAuthInfoRequest,
    res: Response,
    next: NextFunction
) => {
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
        const { uid, name } = jwt.verify(token, jwtSecret) as IJwtPayload;
        req.uid = uid;
        req.name = name;
    } catch (error) {
        console.error(error);
        return res.status(401).json({
            ok: false,
            message: 'Invalid auth token.',
        });
    }
    next();
};

export default validateJwt;
