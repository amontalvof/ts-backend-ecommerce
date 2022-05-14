import { Request, Response } from 'express';
import { omit, isEmpty } from 'lodash';
import bcrypt from 'bcryptjs';
import { v2 as cloudinary } from 'cloudinary';
import { Server } from '../server';
import { IExtendedRequest } from '../types/request';

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

export const verifyUser = async (
    req: Request,
    res: Response
): Promise<Response | void> => {
    try {
        const id = req.params.userId;
        const userData = { verificacion: req.body.verificacion };
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

export const updateUserPassword = async (
    req: Request,
    res: Response
): Promise<Response | void> => {
    try {
        const id = req.params.userId;
        // encrypt password
        const salt = bcrypt.genSaltSync(10);
        const encryptedPassword = bcrypt.hashSync(req.body.updPassword1, salt);
        const userData = { password: encryptedPassword };
        const conn = Server.connection;
        await conn.query('UPDATE usuarios set ? WHERE id = ?', [userData, id]);

        res.status(200).json({
            ok: true,
            message: 'Password updated successfully.',
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            ok: false,
            message: 'Sorry there was an error updating the password.',
        });
    }
};

export const uploadUserImage = async (
    req: IExtendedRequest,
    res: Response
): Promise<Response | void> => {
    try {
        cloudinary.config({
            cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
            api_key: process.env.CLOUDINARY_API_KEY,
            api_secret: process.env.CLOUDINARY_API_SECRET,
            secure: true,
        });
        const userFolderPath = 'ecommerce/usuarios';
        const id = req.params.userId;
        const conn = Server.connection;
        const [user] = await conn.query('SELECT * FROM usuarios WHERE id = ?', [
            id,
        ]);
        if (Array.isArray(user) && user.length === 0) {
            return res.status(400).json({
                ok: false,
                message: `There is no user with the id ${id} in the database.`,
            });
        }
        const { foto } = (user as any)[0];

        if (foto) {
            // delete image from server
            const nameArr = foto.split('/');
            const name = nameArr[nameArr.length - 1];
            const [publicId] = name.split('.');
            cloudinary.uploader.destroy(`${userFolderPath}/${publicId}`);
        }

        const { tempFilePath } = req.files.sampleFile;
        const response = await cloudinary.uploader.upload(tempFilePath, {
            folder: userFolderPath,
        });
        const { secure_url } = response;
        const userData = { foto: secure_url };
        await conn.query('UPDATE usuarios set ? WHERE id = ?', [userData, id]);

        res.status(200).json({
            ok: true,
            secure_url,
            message: 'Image uploaded successfully.',
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            ok: false,
            message: 'Please talk to the administrator.',
        });
    }
};

export const getUserOrders = async (
    req: Request,
    res: Response
): Promise<Response | void> => {
    try {
        const id = req.params.userId;
        const conn = Server.connection;
        const [orders] = await conn.query(
            'SELECT *, compras.id as comprasId, compras.fecha as comprasFecha, productos.id as productosId, productos.fecha as productosFecha FROM compras LEFT JOIN productos ON compras.id_producto = productos.id WHERE id_usuario = ?  ORDER BY compras.fecha DESC',
            [id]
        );
        res.status(200).json({
            ok: true,
            orders,
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            ok: false,
            message: 'Please talk to the administrator.',
        });
    }
};
