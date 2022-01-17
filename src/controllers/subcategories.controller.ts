import { Request, Response } from 'express';
import { Server } from '../models/server';

export async function readSubCategories(
    req: Request,
    res: Response
): Promise<Response | void> {
    try {
        const conn = Server.connection;
        const posts = await conn.query('SELECT * FROM subcategorias');
        return res.json({
            ok: true,
            subCategories: posts[0],
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            ok: false,
            message: 'Please talk to the administrator.',
        });
    }
}
