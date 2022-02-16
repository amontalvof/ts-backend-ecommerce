import { Request, Response } from 'express';
import resolveProductsQuery from '../helpers/resolveProductsQuery';
import resolveTotalProductsQuery from '../helpers/resolveTotalProductsQuery';
import { Server } from '../models/server';

export const readRelevantProducts = async (
    req: Request,
    res: Response
): Promise<Response | void> => {
    try {
        const conn = Server.connection;

        const freeQuery = resolveProductsQuery({
            ordenar: 'id',
            modo: 'ASC',
            item: 'precio',
            valor: 0,
            base: 0,
            tope: 4,
        });
        const ventasQuery = resolveProductsQuery({
            ordenar: 'ventas',
            modo: 'DESC',
            item: null,
            valor: null,
            base: 0,
            tope: 4,
        });
        const vistasQuery = resolveProductsQuery({
            ordenar: 'vistas',
            modo: 'DESC',
            item: null,
            valor: null,
            base: 0,
            tope: 4,
        });

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

export const readProducts = async (
    req: Request,
    res: Response
): Promise<Response | void> => {
    try {
        const body = req.body;
        const conn = Server.connection;
        const query = resolveProductsQuery(body);
        const totalQuery = resolveTotalProductsQuery(body);
        const products = await conn.query(query);
        const total = (await conn.query(totalQuery)) as any;

        return res.json({
            ok: true,
            products: products[0],
            ...total[0][0],
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            ok: false,
            message: 'Please talk to the administrator.',
        });
    }
};
