import { Request, Response } from 'express';
import { Server } from '../server';

export const readProduct = async (
    req: Request,
    res: Response
): Promise<Response | void> => {
    try {
        const productId = req.params.productId;
        const conn = Server.connection;
        const product = await conn.query(
            `SELECT productos.*, categorias.categoria, categorias.ruta as categoriaRuta, subcategorias.subcategoria, subcategorias.ruta as subcategoriaRuta FROM productos LEFT JOIN categorias on productos.id_categoria=categorias.id LEFT JOIN subcategorias ON productos.id_subcategoria = subcategorias.id WHERE productos.ruta = '${productId}'`
        );

        return res.json({
            ok: true,
            product: product[0],
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            ok: false,
            message: 'Please talk to the administrator.',
        });
    }
};

export const updateProduct = async (
    req: Request,
    res: Response
): Promise<Response | void> => {
    try {
        const body = req.body;
        const { ruta, item, valor } = body;
        const conn = Server.connection;
        await conn.query(
            `UPDATE productos SET ${item} = ${valor} WHERE ruta = '${ruta}'`
        );
        return res.json({
            ok: true,
            message: 'Product updated successfully',
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            ok: false,
            message: 'Please talk to the administrator.',
        });
    }
};
