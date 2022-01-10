import { Request, Response } from 'express';
import { connect } from '../database/connection';

export const readStyles = async (
    req: Request,
    res: Response
): Promise<Response | void> => {
    try {
        const conn = await connect();
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
