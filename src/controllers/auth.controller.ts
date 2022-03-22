import { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import { Server } from '../server';
// import generateJWT from '../helpers/generateJwt';

interface IUser {
    nombre: string;
    password: string;
    email: string;
    modo: string;
    foto: string;
    verificacion: number;
    emailEncriptado: string;
}

export const createUser = async (
    req: Request,
    res: Response
): Promise<Response | void> => {
    try {
        const { regName, regEmail, regPassword1 } = req.body;
        const conn = Server.connection;
        const [user] = await conn.query(
            `SELECT * FROM usuarios where email = '${regEmail}'`
        );

        if (Array.isArray(user) && user.length > 0) {
            return res.status(400).json({
                ok: false,
                message:
                    'A user with that email already exists in the database.',
            });
        }

        // encrypt password
        const salt = bcrypt.genSaltSync(10);
        const encryptedPassword = bcrypt.hashSync(regPassword1, salt);

        const newUser: IUser = {
            nombre: regName,
            password: encryptedPassword,
            email: regEmail,
            modo: 'directo',
            foto: '',
            verificacion: 0,
            emailEncriptado: '',
        };

        await conn.query('INSERT INTO usuarios SET ?', [newUser]);

        // generate JSON Web Token
        // const token = await generateJWT(regName);

        res.status(201).json({
            ok: true,
            name: regName,
            email: regEmail,
            modo: 'directo',
            foto: '',
            verificacion: 1,
            // token,
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            ok: false,
            message: 'Please talk to the administrator.',
        });
    }
};
