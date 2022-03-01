interface IResolveTotalProductsQueryParams {
    ordenar?: string;
    modo?: string;
    busqueda?: string;
    item?: string | null;
    valor?: number | null;
}

const resolveTotalProductsQuery = (body: IResolveTotalProductsQueryParams) => {
    const { ordenar, item, valor, modo, busqueda } = body;

    if (busqueda) {
        return `SELECT COUNT(*) as total FROM productos LEFT JOIN categorias on productos.id_categoria=categorias.id LEFT JOIN subcategorias ON productos.id_subcategoria = subcategorias.id WHERE productos.ruta like '%${busqueda}%' OR productos.titulo like '%${busqueda}%' OR productos.titular like '%${busqueda}%' OR productos.descripcion like '%${busqueda}%' OR categorias.categoria like '%${busqueda}%' OR subcategorias.subcategoria like '%${busqueda}%' OR categorias.ruta like '%${busqueda}%' OR subcategorias.ruta like '%${busqueda}%' ORDER BY productos.${ordenar} ${modo};`;
    }
    if (item !== null) {
        return `SELECT COUNT(*) as total FROM productos LEFT JOIN categorias on productos.id_categoria=categorias.id LEFT JOIN subcategorias ON productos.id_subcategoria = subcategorias.id WHERE productos.${item} = ${valor} ORDER BY productos.${ordenar} ${modo};`;
    } else {
        return `SELECT COUNT(*) as total FROM productos LEFT JOIN categorias on productos.id_categoria=categorias.id LEFT JOIN subcategorias ON productos.id_subcategoria = subcategorias.id ORDER BY productos.${ordenar} ${modo}`;
    }
};

export default resolveTotalProductsQuery;
