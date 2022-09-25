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
Object.defineProperty(exports, "__esModule", { value: true });
exports.readSubCategories = void 0;
const server_1 = require("../server");
function readSubCategories(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const conn = server_1.Server.connection;
            const posts = yield conn.query('SELECT * FROM subcategorias');
            return res.json({
                ok: true,
                subCategories: posts[0],
            });
        }
        catch (error) {
            console.error(error);
            res.status(500).json({
                ok: false,
                message: 'Please talk to the administrator.',
            });
        }
    });
}
exports.readSubCategories = readSubCategories;
//# sourceMappingURL=subcategories.controller.js.map