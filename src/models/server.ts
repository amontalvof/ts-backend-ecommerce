import express, { Application } from 'express';
import colors from 'colors/safe';
import morgan from 'morgan';
import cors from 'cors';

// Routes
import plantillaRoute from '../routes/plantilla.route';
import productsRoute from '../routes/products.route';

export class Server {
    private app: Application;
    private port: string;
    private paths = {
        plantilla: '/api/plantilla',
        products: '/api/products',
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
        this.app.use(this.paths.plantilla, plantillaRoute);
        this.app.use(this.paths.products, productsRoute);
    }

    async listen() {
        await this.app.listen(this.port);
        console.log(colors.cyan(`Server running on port: ${this.port}`));
    }
}
