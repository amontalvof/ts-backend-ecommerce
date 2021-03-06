import express, { Application } from 'express';
import fileUpload from 'express-fileupload';
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
import authRoute from '../routes/auth.route';
import userRoute from '../routes/user.route';
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
        auth: '/api/auth',
        user: '/api/user',
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
        // fileUpload
        this.app.use(
            fileUpload({
                useTempFiles: true,
                tempFileDir: '/tmp/',
                createParentPath: true,
            })
        );
    }

    private routes() {
        this.app.use(this.paths.plantilla, plantillaRoute);
        this.app.use(this.paths.products, productsRoute);
        this.app.use(this.paths.product, productRoute);
        this.app.use(this.paths.slider, sliderRoute);
        this.app.use(this.paths.banner, bannerRoute);
        this.app.use(this.paths.auth, authRoute);
        this.app.use(this.paths.user, userRoute);
    }

    async listen() {
        await this.app.listen(this.port);
        console.log(colors.cyan(`Server running on port: ${this.port}`));
    }
}
