import { Request, Response } from 'express';
import { Server } from '../models/server';

export const readRelevantProducts = async (
    req: Request,
    res: Response
): Promise<Response | void> => {
    try {
        const order = req.params.order;
        const conn = Server.connection;
        const posts = await conn.query(
            `SELECT * FROM productos ORDER BY ${order} DESC LIMIT 4`
        );
        return res.json({
            ok: true,
            products: posts[0],
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            ok: false,
            message: 'Please talk to the administrator.',
        });
    }
};

export const readFreeProducts = async (
    req: Request,
    res: Response
): Promise<Response | void> => {
    try {
        const conn = Server.connection;
        const posts = await conn.query(
            `SELECT * FROM productos WHERE precio = 0 ORDER BY id DESC LIMIT 4 `
        );
        return res.json({
            ok: true,
            products: posts[0],
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            ok: false,
            message: 'Please talk to the administrator.',
        });
    }
};
