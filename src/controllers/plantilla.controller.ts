import { Request, Response } from 'express';
import { Server } from '../models/server';

export const readStyles = async (
    req: Request,
    res: Response
): Promise<Response | void> => {
    try {
        const conn = Server.connection;
        const posts = await conn.query('SELECT * FROM plantilla');
        return res.json({
            ok: true,
            styles: posts[0],
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            ok: false,
            message: 'Please talk to the administrator.',
        });
    }
};
