import crypto from 'crypto';
import { Request, Response } from 'express';
import { omit, isEmpty } from 'lodash';
import bcrypt from 'bcryptjs';
import { Server } from '../server';
import sendEmail from '../services/sendEmail';
import verifyEmailTemplate from '../services/templates/verifyEmail';
import generateJWT from '../helpers/generateJwt';

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
        const [plantilla] = await conn.query(`SELECT * FROM plantilla`);

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

        // encrypt email
        const hash = crypto.createHash('md5').update(regEmail).digest('hex');

        const newUser: IUser = {
            nombre: regName,
            password: encryptedPassword,
            email: regEmail,
            modo: 'directo',
            foto: '',
            verificacion: 1,
            emailEncriptado: hash,
        };

        await conn.query('INSERT INTO usuarios SET ?', [newUser]);

        // generate JSON Web Token
        const token = await generateJWT(regName, hash);

        //send email verification
        const email = {
            from: process.env.DEFAULT_FROM_ADDRESS || '',
            to: regEmail,
            subject: 'Email verification',
            replyTo: regEmail,
            htmlTemplate: verifyEmailTemplate,
            variables: {
                confirmLink: `${process.env.REACT_APP_URL}/${hash}`,
                buttonColor: (plantilla as any)[0].colorTexto,
                buttonBackground: (plantilla as any)[0].colorFondo,
            },
        };

        const resp = await sendEmail(email);

        if (!resp.ok) {
            return res.status(500).json(resp);
        }

        res.status(201).json({
            ok: true,
            name: regName,
            email: regEmail,
            modo: 'directo',
            foto: '',
            token,
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            ok: false,
            message: 'Please talk to the administrator.',
        });
    }
};

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
