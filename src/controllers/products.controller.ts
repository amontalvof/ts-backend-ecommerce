import { Request, Response } from 'express';
import { Server } from '../models/server';

export const readRelevantProducts = async (
    req: Request,
    res: Response
): Promise<Response | void> => {
    try {
        const order = req.params.order;
        const conn = Server.connection;

        const freeQuery =
            'SELECT productos.*, categorias.categoria, categorias.ruta as categoriaRuta, subcategorias.subcategoria, subcategorias.ruta as subcategoriaRuta FROM productos left join categorias on productos.id_categoria=categorias.id LEFT JOIN subcategorias ON productos.id_subcategoria = subcategorias.id WHERE precio = 0 ORDER BY id LIMIT 4;';
        const ventasQuery =
            'SELECT productos.*, categorias.categoria, categorias.ruta as categoriaRuta, subcategorias.subcategoria, subcategorias.ruta as subcategoriaRuta FROM productos left join categorias on productos.id_categoria=categorias.id LEFT JOIN subcategorias ON productos.id_subcategoria = subcategorias.id ORDER BY ventas DESC LIMIT 4;';
        const vistasQuery =
            'SELECT productos.*, categorias.categoria, categorias.ruta as categoriaRuta, subcategorias.subcategoria, subcategorias.ruta as subcategoriaRuta FROM productos left join categorias on productos.id_categoria=categorias.id LEFT JOIN subcategorias ON productos.id_subcategoria = subcategorias.id ORDER BY vistas DESC LIMIT 4;';

        const freeRelevant = await conn.query(freeQuery);
        const ventasRelevant = await conn.query(ventasQuery);
        const vistasRelevant = await conn.query(vistasQuery);

        return res.json({
            ok: true,
            free: freeRelevant[0],
            ventas: ventasRelevant[0],
            vistas: vistasRelevant[0],
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            ok: false,
            message: 'Please talk to the administrator.',
        });
    }
};

export const readRouteProducts = async (
    req: Request,
    res: Response
): Promise<Response | void> => {
    try {
        const conn = Server.connection;
        const query = 'SELECT DISTINCT(ruta) FROM productos';
        const routes = await conn.query(query);

        return res.json({
            ok: true,
            routes: routes[0],
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            ok: false,
            message: 'Please talk to the administrator.',
        });
    }
};
