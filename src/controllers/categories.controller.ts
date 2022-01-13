import { Request, Response } from 'express';
import { connect } from '../database/connection';

export const readCategories = async (
    req: Request,
    res: Response
): Promise<Response | void> => {
    try {
        const conn = await connect();
        const posts = await conn.query('SELECT * FROM categorias');
        return res.json({
            ok: true,
            categories: posts[0],
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            ok: false,
            message: 'Please talk to the administrator.',
        });
    }
};