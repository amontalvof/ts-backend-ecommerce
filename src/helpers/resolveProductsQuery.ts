interface IResolveProductsQueryParams {
    ordenar?: string;
    modo?: string;
    item?: string | null;
    valor?: number | null;
    base?: number;
    tope?: number;
}

const resolveProductsQuery = (body: IResolveProductsQueryParams): string => {
    const { ordenar, item, valor, base, tope, modo } = body;
    if (item !== null) {
        return `SELECT productos.*, categorias.categoria, categorias.ruta as categoriaRuta, subcategorias.subcategoria, subcategorias.ruta as subcategoriaRuta FROM productos LEFT JOIN categorias on productos.id_categoria=categorias.id LEFT JOIN subcategorias ON productos.id_subcategoria = subcategorias.id WHERE productos.${item} = ${valor} ORDER BY ${ordenar} ${modo} LIMIT ${base}, ${tope}`;
    } else {
        return `SELECT productos.*, categorias.categoria, categorias.ruta as categoriaRuta, subcategorias.subcategoria, subcategorias.ruta as subcategoriaRuta FROM productos LEFT JOIN categorias on productos.id_categoria=categorias.id LEFT JOIN subcategorias ON productos.id_subcategoria = subcategorias.id ORDER BY ${ordenar} ${modo} LIMIT ${base}, ${tope}`;
    }
};

export default resolveProductsQuery;
