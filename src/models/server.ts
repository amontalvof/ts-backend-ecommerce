import express, { Application } from 'express';
import colors from 'colors/safe';
import morgan from 'morgan';
import cors from 'cors';

export class Server {
    private app: Application;
    private port: string;
    private paths = {
        plantilla: '/api/plantilla',
    };

    constructor() {
        this.app = express();
        this.port = process.env.PORT || '8080';

        this.middlewares();
        this.routes();
    }

    private middlewares() {
        // CORS
        this.app.use(cors());
        // HTTP request logger
        this.app.use(morgan('dev'));
        // reading and parsing the body
        this.app.use(express.json());
        // public directory
        this.app.use(express.static('public'));
    }

    private routes() {
        // this.app.use(this.paths.plantilla, require('./routes/plantilla'));
    }

    async listen() {
        await this.app.listen(this.port);
        console.log(colors.cyan(`Server running on port: ${this.port}`));
    }
}
