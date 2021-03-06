import { Server } from './server';
import dotenv from 'dotenv';

// configure dotenv
dotenv.config();

async function main() {
    const server = new Server();
    await server.listen();
}

main();
