import { Request } from 'express';

export interface IExtendedRequest extends Request {
    uid?: string;
    name?: string;
    files?: any;
}
