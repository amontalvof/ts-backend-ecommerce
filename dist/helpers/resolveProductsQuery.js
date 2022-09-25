"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const resolveProductsQuery = (body) => {
    const { ordenar, item, valor, base, tope, modo, busqueda } = body;
    const orderByModo = modo !== 'Rand()' ? `productos.${ordenar} ${modo}` : `${modo}`;
    if (busqueda) {
        return `SELECT productos.*, categorias.categoria, categorias.ruta as categoriaRuta, subcategorias.subcategoria, subcategorias.ruta as subcategoriaRuta FROM productos LEFT JOIN categorias on productos.id_categoria=categorias.id LEFT JOIN subcategorias ON productos.id_subcategoria = subcategorias.id WHERE productos.ruta like '%${busqueda}%' OR productos.titulo like '%${busqueda}%' OR productos.titular like '%${busqueda}%' OR productos.descripcion like '%${busqueda}%' OR categorias.categoria like '%${busqueda}%' OR subcategorias.subcategoria like '%${busqueda}%' OR categorias.ruta like '%${busqueda}%' OR subcategorias.ruta like '%${busqueda}%' ORDER BY ${orderByModo} LIMIT ${base}, ${tope}`;
    }
    if (item !== null) {
        return `SELECT productos.*, categorias.categoria, categorias.ruta as categoriaRuta, subcategorias.subcategoria, subcategorias.ruta as subcategoriaRuta FROM productos LEFT JOIN categorias on productos.id_categoria=categorias.id LEFT JOIN subcategorias ON productos.id_subcategoria = subcategorias.id WHERE productos.${item} = ${valor} ORDER BY ${orderByModo} LIMIT ${base}, ${tope}`;
    }
    else {
        return `SELECT productos.*, categorias.categoria, categorias.ruta as categoriaRuta, subcategorias.subcategoria, subcategorias.ruta as subcategoriaRuta FROM productos LEFT JOIN categorias on productos.id_categoria=categorias.id LEFT JOIN subcategorias ON productos.id_subcategoria = subcategorias.id ORDER BY ${orderByModo} LIMIT ${base}, ${tope}`;
    }
};
exports.default = resolveProductsQuery;
//# sourceMappingURL=resolveProductsQuery.js.map