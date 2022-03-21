import { Request, Response } from 'express';
import { Server } from '../server';

export const createUser = async (
    req: Request,
    res: Response
): Promise<Response | void> => {
    try {
        const { regName, regEmail, regPassword1 } = req.body;
        // const conn = Server.connection;
        // const [user] = await conn.query(
        //     `SELECT * FROM users where email = ${regEmail}`
        // );

        // if (user) {
        //     return res.status(400).json({
        //         ok: false,
        //         message: 'There is already a user with that email.',
        //     });
        // }

        res.status(201).json({
            ...req.body,
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            ok: false,
            message: 'Please talk to the administrator.',
        });
    }
};
