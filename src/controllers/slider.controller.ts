import { Request, Response } from 'express';
import { Server } from '../server';

export const readSlider = async (
    req: Request,
    res: Response
): Promise<Response | void> => {
    try {
        const conn = Server.connection;
        const posts = await conn.query('SELECT * FROM slider ORDER BY id');
        return res.json({
            ok: true,
            slider: posts[0],
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            ok: false,
            message: 'Please talk to the administrator.',
        });
    }
};
