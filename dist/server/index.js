"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Server = void 0;
const express_1 = __importDefault(require("express"));
const express_fileupload_1 = __importDefault(require("express-fileupload"));
const safe_1 = __importDefault(require("colors/safe"));
const morgan_1 = __importDefault(require("morgan"));
const cors_1 = __importDefault(require("cors"));
// Routes
const plantilla_route_1 = __importDefault(require("../routes/plantilla.route"));
const products_route_1 = __importDefault(require("../routes/products.route"));
const product_route_1 = __importDefault(require("../routes/product.route"));
const slider_route_1 = __importDefault(require("../routes/slider.route"));
const banner_route_1 = __importDefault(require("../routes/banner.route"));
const auth_route_1 = __importDefault(require("../routes/auth.route"));
const user_route_1 = __importDefault(require("../routes/user.route"));
const connection_1 = require("../database/connection");
class Server {
    constructor() {
        this.paths = {
            plantilla: '/api/plantilla',
            products: '/api/products',
            product: '/api/product',
            slider: '/api/slider',
            banner: '/api/banner',
            auth: '/api/auth',
            user: '/api/user',
        };
        this.app = (0, express_1.default)();
        this.port = process.env.PORT || '8080';
        this.dbConnection();
        this.middlewares();
        this.routes();
    }
    dbConnection() {
        return __awaiter(this, void 0, void 0, function* () {
            Server.connection = yield (0, connection_1.connect)();
        });
    }
    middlewares() {
        // CORS
        this.app.use((0, cors_1.default)());
        // HTTP request logger
        this.app.use((0, morgan_1.default)('dev'));
        // reading and parsing the body
        this.app.use(express_1.default.json());
        // public directory
        this.app.use(express_1.default.static('public'));
        // fileUpload
        this.app.use((0, express_fileupload_1.default)({
            useTempFiles: true,
            tempFileDir: '/tmp/',
            createParentPath: true,
        }));
    }
    routes() {
        this.app.use(this.paths.plantilla, plantilla_route_1.default);
        this.app.use(this.paths.products, products_route_1.default);
        this.app.use(this.paths.product, product_route_1.default);
        this.app.use(this.paths.slider, slider_route_1.default);
        this.app.use(this.paths.banner, banner_route_1.default);
        this.app.use(this.paths.auth, auth_route_1.default);
        this.app.use(this.paths.user, user_route_1.default);
    }
    listen() {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.app.listen(this.port);
            console.log(safe_1.default.cyan(`Server running on port: ${this.port}`));
        });
    }
}
exports.Server = Server;
//# sourceMappingURL=index.js.map