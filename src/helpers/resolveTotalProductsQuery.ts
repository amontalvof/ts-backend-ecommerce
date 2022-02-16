interface IResolveTotalProductsQueryParams {
    ordenar?: string;
    modo?: string;
    item?: string | null;
    valor?: number | null;
}

const resolveTotalProductsQuery = (body: IResolveTotalProductsQueryParams) => {
    const { ordenar, item, valor, modo } = body;
    if (item !== null) {
        return `SELECT COUNT(*) as total FROM productos WHERE ${item} = ${valor} ORDER BY ${ordenar} ${modo};`;
    } else {
        return `SELECT COUNT(*) as total FROM productos ORDER BY ${ordenar} ${modo}`;
    }
};

export default resolveTotalProductsQuery;
