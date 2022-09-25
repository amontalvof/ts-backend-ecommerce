import { createPool, Pool } from 'mysql2/promise';

export async function connect(): Promise<Pool> {
    const connection = await createPool({
        host: process.env.DB_HOST,
        user: process.env.DB_USER,
        password: process.env.DB_PASS,
        database: process.env.DB_NAME,
        connectionLimit: 10,
        port: Number(process.env.DB_PORT),
    });
    return connection;
}
