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
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateProduct = exports.readProductComments = exports.readProduct = void 0;
const server_1 = require("../server");
const readProduct = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const productId = req.params.productId;
        const conn = server_1.Server.connection;
        const product = yield conn.query(`SELECT productos.*, categorias.categoria, categorias.ruta as categoriaRuta, subcategorias.subcategoria, subcategorias.ruta as subcategoriaRuta FROM productos LEFT JOIN categorias on productos.id_categoria=categorias.id LEFT JOIN subcategorias ON productos.id_subcategoria = subcategorias.id WHERE productos.ruta = '${productId}'`);
        return res.json({
            ok: true,
            product: product[0],
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
exports.readProduct = readProduct;
const readProductComments = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const productId = req.params.productId;
        const conn = server_1.Server.connection;
        const comments = yield conn.query(`SELECT comentarios.id as id, calificacion, comentario, nombre, foto FROM comentarios LEFT JOIN usuarios on comentarios.id_usuario=usuarios.id WHERE id_producto = '${productId}' ORDER BY calificacion DESC;`);
        return res.json({
            ok: true,
            comments: comments[0],
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
exports.readProductComments = readProductComments;
const updateProduct = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const body = req.body;
        const { ruta, item, valor } = body;
        const conn = server_1.Server.connection;
        yield conn.query(`UPDATE productos SET ${item} = ${valor} WHERE ruta = '${ruta}'`);
        return res.json({
            ok: true,
            message: 'Product updated successfully',
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
exports.updateProduct = updateProduct;
//# sourceMappingURL=product.controller.js.map