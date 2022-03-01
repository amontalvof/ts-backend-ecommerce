interface IResolveProductsQueryParams {
    ordenar?: string;
    modo?: string;
    busqueda?: string;
    item?: string | null;
    valor?: number | null;
    base?: number;
    tope?: number;
}

const resolveProductsQuery = (body: IResolveProductsQueryParams): string => {
    const { ordenar, item, valor, base, tope, modo, busqueda } = body;
    if (busqueda) {
        return `SELECT productos.*, categorias.categoria, categorias.ruta as categoriaRuta, subcategorias.subcategoria, subcategorias.ruta as subcategoriaRuta FROM productos LEFT JOIN categorias on productos.id_categoria=categorias.id LEFT JOIN subcategorias ON productos.id_subcategoria = subcategorias.id WHERE productos.ruta like '%${busqueda}%' OR productos.titulo like '%${busqueda}%' OR productos.titular like '%${busqueda}%' OR productos.descripcion like '%${busqueda}%' OR categorias.categoria like '%${busqueda}%' OR subcategorias.subcategoria like '%${busqueda}%' OR categorias.ruta like '%${busqueda}%' OR subcategorias.ruta like '%${busqueda}%' ORDER BY productos.${ordenar} ${modo} LIMIT ${base}, ${tope}`;
    }
    if (item !== null) {
        return `SELECT productos.*, categorias.categoria, categorias.ruta as categoriaRuta, subcategorias.subcategoria, subcategorias.ruta as subcategoriaRuta FROM productos LEFT JOIN categorias on productos.id_categoria=categorias.id LEFT JOIN subcategorias ON productos.id_subcategoria = subcategorias.id WHERE productos.${item} = ${valor} ORDER BY productos.${ordenar} ${modo} LIMIT ${base}, ${tope}`;
    } else {
        return `SELECT productos.*, categorias.categoria, categorias.ruta as categoriaRuta, subcategorias.subcategoria, subcategorias.ruta as subcategoriaRuta FROM productos LEFT JOIN categorias on productos.id_categoria=categorias.id LEFT JOIN subcategorias ON productos.id_subcategoria = subcategorias.id ORDER BY productos.${ordenar} ${modo} LIMIT ${base}, ${tope}`;
    }
};

export default resolveProductsQuery;
