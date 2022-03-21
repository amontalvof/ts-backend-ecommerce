import { Request } from 'express';

export interface IAuthInfoRequest extends Request {
    uid: string;
    name: string;
}
