import { Request, Response } from 'express';
import { omit, isEmpty } from 'lodash';
import { Server } from '../server';

export const readUser = async (
    req: Request,
    res: Response
): Promise<Response | void> => {
    try {
        const { item, valor } = req.body;
        const conn = Server.connection;
        const [user] = await conn.query(
            `SELECT * FROM usuarios where ${item} = '${valor}'`
        );

        const userData = Array.isArray(user) && (user[0] as any);
        const finalUserData = omit(userData, 'password');

        if (isEmpty(finalUserData)) {
            return res.status(400).json({
                ok: false,
                message: 'Error verifying email.',
            });
        }

        res.status(200).json({
            ok: true,
            user: finalUserData,
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            ok: false,
            message: 'Please talk to the administrator.',
        });
    }
};

export const updateUser = async (
    req: Request,
    res: Response
): Promise<Response | void> => {
    try {
        const id = req.params.userId;
        const userData = req.body;
        const conn = Server.connection;
        await conn.query('UPDATE usuarios set ? WHERE id = ?', [userData, id]);

        res.status(200).json({
            ok: true,
            message: 'User updated successfully.',
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            ok: false,
            message: 'Please talk to the administrator.',
        });
    }
};
