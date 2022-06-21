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
            `SELECT *, compras.id as comprasId, compras.fecha as comprasFecha, productos.id as productosId, productos.fecha as productosFecha, comments.id as commentsId FROM compras 
            LEFT JOIN productos ON compras.id_producto = productos.id
            LEFT JOIN (SELECT id, calificacion, comentario, id_producto FROM comentarios WHERE id_usuario = ?) as comments ON compras.id_producto = comments.id_producto
            WHERE id_usuario = ?  ORDER BY compras.fecha DESC`,
            [id, id]
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

export const createProductComment = async (
    req: Request,
    res: Response
): Promise<Response | void> => {
    try {
        const { calificacion, comentario, productosId, uid } = req.body;

        const newComment = {
            calificacion,
            comentario: comentario || '',
            id_producto: productosId,
            id_usuario: uid,
        };

        const conn = Server.connection;

        await conn.query('INSERT INTO comentarios SET ?', [newComment]);

        res.status(200).json({
            ok: true,
            message: 'Comment created successfully.',
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            ok: false,
            message: 'Sorry there was an error creating the comment.',
        });
    }
};

export const updateProductComment = async (
    req: Request,
    res: Response
): Promise<Response | void> => {
    try {
        const id = req.params.commentId;
        const { calificacion, comentario } = req.body;

        const commentData = comentario
            ? { calificacion, comentario }
            : { calificacion };

        const conn = Server.connection;

        await conn.query('UPDATE comentarios SET ? WHERE id = ?', [
            commentData,
            id,
        ]);

        res.status(200).json({
            ok: true,
            message: 'Comment updated successfully.',
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            ok: false,
            message: 'Sorry there was an error updating the comment.',
        });
    }
};

export const addToWishList = async (
    req: Request,
    res: Response
): Promise<Response | void> => {
    try {
        const { idProducto, idUsuario } = req.body;

        const newWish = {
            id_producto: idProducto,
            id_usuario: idUsuario,
        };

        const conn = Server.connection;

        await conn.query('INSERT INTO deseos SET ?', [newWish]);

        res.status(200).json({
            ok: true,
            message: 'Wish added successfully.',
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            ok: false,
            message: 'Sorry there was an error adding the wish.',
        });
    }
};

export const readWishList = async (
    req: Request,
    res: Response
): Promise<Response | void> => {
    try {
        const id = req.params.userId;
        const conn = Server.connection;
        const [deseos] = await conn.query(
            'SELECT *, deseos.id as deseosId, productos.id as productosId, categorias.id as categoriaId, subcategorias.id as subcategoriaId, categorias.ruta as categoriaRuta, subcategorias.subcategoria, subcategorias.ruta as subcategoriaRuta FROM deseos LEFT JOIN productos ON productos.id = deseos.id_producto LEFT JOIN categorias on productos.id_categoria=categorias.id LEFT JOIN subcategorias ON productos.id_subcategoria = subcategorias.id WHERE deseos.id_usuario = ? ORDER BY deseos.id DESC;',
            [id]
        );

        res.status(200).json({
            ok: true,
            deseos,
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            ok: false,
            message: 'Sorry there was an error reading the wish list.',
        });
    }
};

export const deleteWish = async (
    req: Request,
    res: Response
): Promise<Response | void> => {
    try {
        const id = req.params.wishId;
        const conn = Server.connection;
        const [deseo] = await conn.query('DELETE from deseos WHERE id = ?', [
            id,
        ]);

        res.status(200).json({
            ok: true,
            deseo,
            message: 'Wish deleted successfully.',
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            ok: false,
            message: 'Sorry there was an error deleting the wish.',
        });
    }
};
