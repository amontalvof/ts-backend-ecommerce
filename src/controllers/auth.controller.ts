import crypto from 'crypto';
import { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import { Server } from '../server';
import sendEmail from '../services/sendEmail';
import verifyEmailTemplate from '../services/templates/verifyEmail';
import forgotPasswordTemplate from '../services/templates/forgotPassword';
import generateJWT from '../helpers/generateJwt';
import { IAuthInfoRequest } from '../types/request';
import generateRandomPassword from '../helpers/generateRandomPassword';

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

        //send email verification
        const email = {
            from: process.env.DEFAULT_FROM_ADDRESS || '',
            to: regEmail,
            subject: 'Email verification',
            replyTo: process.env.DEFAULT_FROM_ADDRESS,
            htmlTemplate: verifyEmailTemplate,
            variables: {
                confirmLink: `${process.env.REACT_APP_URL}/verify/${hash}`,
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
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            ok: false,
            message: 'Please talk to the administrator.',
        });
    }
};

export const loginUser = async (
    req: Request,
    res: Response
): Promise<Response | void> => {
    const { logEmail, logPassword } = req.body;

    try {
        const conn = Server.connection;
        const [user] = await conn.query(
            `SELECT * FROM usuarios where email = '${logEmail}'`
        );
        if (Array.isArray(user) && user.length === 0) {
            return res.status(400).json({
                ok: false,
                message:
                    "The email address that you've entered doesn't match any account.",
            });
        }
        const { id, nombre, password, email, foto, verificacion } = (
            user as any
        )[0];

        //confirm passwords
        const validPassword = bcrypt.compareSync(logPassword, password);

        if (!validPassword) {
            return res.status(400).json({
                ok: false,
                message: 'The password you entered for the user is incorrect.',
            });
        }

        if (verificacion) {
            return res.status(400).json({
                ok: false,
                message:
                    'Unverified email. Please check your email inbox or SPAM folder to verify the email address.',
            });
        }

        // generate JSON Web Token
        const token = await generateJWT(id, nombre);

        res.json({
            ok: true,
            id,
            nombre,
            foto,
            email,
            token,
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({
            ok: false,
            message: 'Please talk to the administrator.',
        });
    }
};

export const renewToken = async (
    req: IAuthInfoRequest,
    res: Response
): Promise<Response | void> => {
    const { uid = '', name = '' } = req;
    try {
        const conn = Server.connection;
        const [user] = await conn.query(
            `SELECT * FROM usuarios where id = '${uid}'`
        );

        if (Array.isArray(user) && user.length === 0) {
            return res.status(400).json({
                ok: false,
                message: 'The user does not exist.',
            });
        }

        const { id, nombre, email, foto } = (user as any)[0];

        // generate JSON Web Token
        const token = await generateJWT(uid, name);

        res.json({
            ok: true,
            id,
            nombre,
            foto,
            email,
            token,
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({
            ok: false,
            message: 'Please talk to the administrator.',
        });
    }
};

export const forgotPassword = async (
    req: Request,
    res: Response
): Promise<Response | void> => {
    try {
        const { fgpEmail } = req.body;

        const conn = Server.connection;
        const [user] = await conn.query(
            `SELECT * FROM usuarios where email = '${fgpEmail}'`
        );
        const [plantilla] = await conn.query(`SELECT * FROM plantilla`);

        if (Array.isArray(user) && user.length === 0) {
            return res.status(400).json({
                ok: false,
                message:
                    'A user with that email does not exists in the database.',
            });
        }
        const uid = Array.isArray(user) && (user[0] as any).id;
        const newPassword = generateRandomPassword();
        // encrypt password
        const salt = bcrypt.genSaltSync(10);
        const encryptedPassword = bcrypt.hashSync(newPassword, salt);

        const userData = { password: encryptedPassword };
        await conn.query('UPDATE usuarios set ? WHERE id = ?', [userData, uid]);

        //send email verification
        const email = {
            from: process.env.DEFAULT_FROM_ADDRESS || '',
            to: fgpEmail,
            subject: 'New password request',
            replyTo: process.env.DEFAULT_FROM_ADDRESS,
            htmlTemplate: forgotPasswordTemplate,
            variables: {
                newPassword,
                confirmLink: process.env.REACT_APP_URL,
                buttonColor: (plantilla as any)[0].colorTexto,
                buttonBackground: (plantilla as any)[0].colorFondo,
            },
        };

        const resp = await sendEmail(email);

        if (!resp.ok) {
            return res.status(500).json(resp);
        }

        res.status(200).json({
            ok: true,
            message: 'Password updated successfully.',
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({
            ok: false,
            message: 'Please talk to the administrator.',
        });
    }
};
