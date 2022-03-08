import express, { Application } from 'express';
import { Pool } from 'mysql2/promise';
import colors from 'colors/safe';
import morgan from 'morgan';
import cors from 'cors';

// Routes
import plantillaRoute from '../routes/plantilla.route';
import productsRoute from '../routes/products.route';
import productRoute from '../routes/product.route';
import sliderRoute from '../routes/slider.route';
import bannerRoute from '../routes/banner.route';
import { connect } from '../database/connection';

export class Server {
    static connection: Pool;
    private app: Application;
    private port: string;
    private paths = {
        plantilla: '/api/plantilla',
        products: '/api/products',
        product: '/api/product',
        slider: '/api/slider',
        banner: '/api/banner',
    };

    constructor() {
        this.app = express();
        this.port = process.env.PORT || '8080';

        this.dbConnection();
        this.middlewares();
        this.routes();
    }

    async dbConnection() {
        Server.connection = await connect();
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
        this.app.use(this.paths.product, productRoute);
        this.app.use(this.paths.slider, sliderRoute);
        this.app.use(this.paths.banner, bannerRoute);
    }

    async listen() {
        await this.app.listen(this.port);
        console.log(colors.cyan(`Server running on port: ${this.port}`));
    }
}
