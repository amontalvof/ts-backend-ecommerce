import { Request, Response } from 'express';
import { Server } from '../server';

export const readBanner = async (
    req: Request,
    res: Response
): Promise<Response | void> => {
    try {
        const conn = Server.connection;
        const posts = await conn.query('SELECT * FROM banner ORDER BY id');
        return res.json({
            ok: true,
            banners: posts[0],
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            ok: false,
            message: 'Please talk to the administrator.',
        });
    }
};
