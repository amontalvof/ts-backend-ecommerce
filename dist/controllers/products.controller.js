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
exports.readProducts = exports.readRouteProducts = exports.readRelevantProducts = void 0;
const resolveProductsQuery_1 = __importDefault(require("../helpers/resolveProductsQuery"));
const resolveTotalProductsQuery_1 = __importDefault(require("../helpers/resolveTotalProductsQuery"));
const server_1 = require("../server");
const readRelevantProducts = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const conn = server_1.Server.connection;
        const freeQuery = (0, resolveProductsQuery_1.default)({
            ordenar: 'id',
            modo: 'ASC',
            item: 'precio',
            valor: 0,
            base: 0,
            tope: 4,
        });
        const ventasQuery = (0, resolveProductsQuery_1.default)({
            ordenar: 'ventas',
            modo: 'DESC',
            item: null,
            valor: null,
            base: 0,
            tope: 4,
        });
        const vistasQuery = (0, resolveProductsQuery_1.default)({
            ordenar: 'vistas',
            modo: 'DESC',
            item: null,
            valor: null,
            base: 0,
            tope: 4,
        });
        const freeRelevant = yield conn.query(freeQuery);
        const ventasRelevant = yield conn.query(ventasQuery);
        const vistasRelevant = yield conn.query(vistasQuery);
        return res.json({
            ok: true,
            free: freeRelevant[0],
            ventas: ventasRelevant[0],
            vistas: vistasRelevant[0],
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
exports.readRelevantProducts = readRelevantProducts;
const readRouteProducts = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const conn = server_1.Server.connection;
        const query = 'SELECT DISTINCT(ruta) FROM productos';
        const routes = yield conn.query(query);
        return res.json({
            ok: true,
            routes: routes[0],
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
exports.readRouteProducts = readRouteProducts;
const readProducts = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const body = req.body;
        const conn = server_1.Server.connection;
        const query = (0, resolveProductsQuery_1.default)(body);
        const totalQuery = (0, resolveTotalProductsQuery_1.default)(body);
        const products = yield conn.query(query);
        const total = (yield conn.query(totalQuery));
        return res.json(Object.assign({ ok: true, products: products[0] }, total[0][0]));
    }
    catch (error) {
        console.error(error);
        res.status(500).json({
            ok: false,
            message: 'Please talk to the administrator.',
        });
    }
});
exports.readProducts = readProducts;
//# sourceMappingURL=products.controller.js.map