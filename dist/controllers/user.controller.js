"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteUser = exports.deleteWish = exports.readWishList = exports.addToWishList = exports.updateProductComment = exports.createProductComment = exports.getUserOrders = exports.uploadUserImage = exports.updateUserPassword = exports.verifyUser = exports.readUser = void 0;
const lodash_1 = require("lodash");
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const cloudinary_1 = require("cloudinary");
const server_1 = require("../server");
const readUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { item, valor } = req.body;
        const conn = server_1.Server.connection;
        const [user] = yield conn.query(`SELECT * FROM usuarios where ${item} = '${valor}'`);
        const userData = Array.isArray(user) && user[0];
        const finalUserData = (0, lodash_1.omit)(userData, 'password');
        if ((0, lodash_1.isEmpty)(finalUserData)) {
            return res.status(400).json({
                ok: false,
                message: 'Error verifying email.',
            });
        }
        res.status(200).json({
            ok: true,
            user: finalUserData,
        });
    }
    catch (error) {
        console.error(error);
        res.status(500).json({
            ok: false,
            message: 'Please talk to the administrator.',
        });
    }
});
exports.readUser = readUser;
const verifyUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const id = req.params.userId;
        const userData = { verificacion: req.body.verificacion };
        const conn = server_1.Server.connection;
        yield conn.query('UPDATE usuarios set ? WHERE id = ?', [userData, id]);
        res.status(200).json({
            ok: true,
            message: 'User updated successfully.',
        });
    }
    catch (error) {
        console.error(error);
        res.status(500).json({
            ok: false,
            message: 'Please talk to the administrator.',
        });
    }
});
exports.verifyUser = verifyUser;
const updateUserPassword = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const id = req.params.userId;
        // encrypt password
        const salt = bcryptjs_1.default.genSaltSync(10);
        const encryptedPassword = bcryptjs_1.default.hashSync(req.body.updPassword1, salt);
        const userData = { password: encryptedPassword };
        const conn = server_1.Server.connection;
        yield conn.query('UPDATE usuarios set ? WHERE id = ?', [userData, id]);
        res.status(200).json({
            ok: true,
            message: 'Password updated successfully.',
        });
    }
    catch (error) {
        console.error(error);
        res.status(500).json({
            ok: false,
            message: 'Sorry there was an error updating the password.',
        });
    }
});
exports.updateUserPassword = updateUserPassword;
const uploadUserImage = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        cloudinary_1.v2.config({
            cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
            api_key: process.env.CLOUDINARY_API_KEY,
            api_secret: process.env.CLOUDINARY_API_SECRET,
            secure: true,
        });
        const userFolderPath = 'ecommerce/usuarios';
        const id = req.params.userId;
        const conn = server_1.Server.connection;
        const [user] = yield conn.query('SELECT * FROM usuarios WHERE id = ?', [
            id,
        ]);
        if (Array.isArray(user) && user.length === 0) {
            return res.status(400).json({
                ok: false,
                message: `There is no user with the id ${id} in the database.`,
            });
        }
        const { foto } = user[0];
        if (foto) {
            // delete image from server
            const nameArr = foto.split('/');
            const name = nameArr[nameArr.length - 1];
            const [publicId] = name.split('.');
            cloudinary_1.v2.uploader.destroy(`${userFolderPath}/${publicId}`);
        }
        const { tempFilePath } = req.files.sampleFile;
        const response = yield cloudinary_1.v2.uploader.upload(tempFilePath, {
            folder: userFolderPath,
        });
        const { secure_url } = response;
        const userData = { foto: secure_url };
        yield conn.query('UPDATE usuarios set ? WHERE id = ?', [userData, id]);
        res.status(200).json({
            ok: true,
            secure_url,
            message: 'Image uploaded successfully.',
        });
    }
    catch (error) {
        console.error(error);
        res.status(500).json({
            ok: false,
            message: 'Please talk to the administrator.',
        });
    }
});
exports.uploadUserImage = uploadUserImage;
const getUserOrders = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const id = req.params.userId;
        const conn = server_1.Server.connection;
        const [orders] = yield conn.query(`SELECT *, compras.id as comprasId, compras.fecha as comprasFecha, productos.id as productosId, productos.fecha as productosFecha, comments.id as commentsId FROM compras 
            LEFT JOIN productos ON compras.id_producto = productos.id
            LEFT JOIN (SELECT id, calificacion, comentario, id_producto FROM comentarios WHERE id_usuario = ?) as comments ON compras.id_producto = comments.id_producto
            WHERE id_usuario = ?  ORDER BY compras.fecha DESC`, [id, id]);
        res.status(200).json({
            ok: true,
            orders,
        });
    }
    catch (error) {
        console.error(error);
        res.status(500).json({
            ok: false,
            message: 'Please talk to the administrator.',
        });
    }
});
exports.getUserOrders = getUserOrders;
const createProductComment = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { calificacion, comentario, productosId, uid } = req.body;
        const newComment = {
            calificacion,
            comentario: comentario || '',
            id_producto: productosId,
            id_usuario: uid,
        };
        const conn = server_1.Server.connection;
        yield conn.query('INSERT INTO comentarios SET ?', [newComment]);
        res.status(200).json({
            ok: true,
            message: 'Comment created successfully.',
        });
    }
    catch (error) {
        console.error(error);
        res.status(500).json({
            ok: false,
            message: 'Sorry there was an error creating the comment.',
        });
    }
});
exports.createProductComment = createProductComment;
const updateProductComment = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const id = req.params.commentId;
        const { calificacion, comentario } = req.body;
        const commentData = comentario
            ? { calificacion, comentario }
            : { calificacion };
        const conn = server_1.Server.connection;
        yield conn.query('UPDATE comentarios SET ? WHERE id = ?', [
            commentData,
            id,
        ]);
        res.status(200).json({
            ok: true,
            message: 'Comment updated successfully.',
        });
    }
    catch (error) {
        console.error(error);
        res.status(500).json({
            ok: false,
            message: 'Sorry there was an error updating the comment.',
        });
    }
});
exports.updateProductComment = updateProductComment;
const addToWishList = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { idProducto, idUsuario } = req.body;
        const newWish = {
            id_producto: idProducto,
            id_usuario: idUsuario,
        };
        const conn = server_1.Server.connection;
        yield conn.query('INSERT INTO deseos SET ?', [newWish]);
        res.status(200).json({
            ok: true,
            message: 'Wish added successfully.',
        });
    }
    catch (error) {
        console.error(error);
        res.status(500).json({
            ok: false,
            message: 'Sorry there was an error adding the wish.',
        });
    }
});
exports.addToWishList = addToWishList;
const readWishList = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const id = req.params.userId;
        const conn = server_1.Server.connection;
        const [deseos] = yield conn.query('SELECT *, deseos.id as deseosId,productos.ruta as ruta, productos.id as productosId, categorias.id as categoriaId, subcategorias.id as subcategoriaId, categorias.ruta as categoriaRuta, subcategorias.subcategoria, subcategorias.ruta as subcategoriaRuta FROM deseos LEFT JOIN productos ON productos.id = deseos.id_producto LEFT JOIN categorias on productos.id_categoria=categorias.id LEFT JOIN subcategorias ON productos.id_subcategoria = subcategorias.id WHERE deseos.id_usuario = ? ORDER BY deseos.id DESC;', [id]);
        res.status(200).json({
            ok: true,
            deseos,
        });
    }
    catch (error) {
        console.error(error);
        res.status(500).json({
            ok: false,
            message: 'Sorry there was an error reading the wish list.',
        });
    }
});
exports.readWishList = readWishList;
const deleteWish = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const id = req.params.wishId;
        const conn = server_1.Server.connection;
        const [deseo] = yield conn.query('DELETE from deseos WHERE id = ?', [
            id,
        ]);
        res.status(200).json({
            ok: true,
            deseo,
            message: 'Wish deleted successfully.',
        });
    }
    catch (error) {
        console.error(error);
        res.status(500).json({
            ok: false,
            message: 'Sorry there was an error deleting the wish.',
        });
    }
});
exports.deleteWish = deleteWish;
const deleteUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const id = req.params.userId;
        const { modo, foto } = req.body;
        cloudinary_1.v2.config({
            cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
            api_key: process.env.CLOUDINARY_API_KEY,
            api_secret: process.env.CLOUDINARY_API_SECRET,
            secure: true,
        });
        const conn = server_1.Server.connection;
        yield conn.query('DELETE from usuarios WHERE id = ?', [id]);
        yield conn.query('DELETE from comentarios WHERE id_usuario = ?', [id]);
        yield conn.query('DELETE from compras WHERE id_usuario = ?', [id]);
        yield conn.query('DELETE from deseos WHERE id_usuario = ?', [id]);
        if (modo === 'directo' && foto) {
            const userFolderPath = 'ecommerce/usuarios';
            // delete image from server
            const nameArr = foto.split('/');
            const name = nameArr[nameArr.length - 1];
            const [publicId] = name.split('.');
            cloudinary_1.v2.uploader.destroy(`${userFolderPath}/${publicId}`);
        }
        res.status(200).json({
            ok: true,
            message: 'Your account has been successfully deleted.',
        });
    }
    catch (error) {
        console.error(error);
        res.status(500).json({
            ok: false,
            message: 'Sorry there was an error deleting the user.',
        });
    }
});
exports.deleteUser = deleteUser;
//# sourceMappingURL=user.controller.js.map