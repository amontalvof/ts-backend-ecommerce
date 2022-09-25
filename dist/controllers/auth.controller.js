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
exports.forgotPassword = exports.renewToken = exports.googleSignIn = exports.loginUser = exports.createUser = void 0;
const crypto_1 = __importDefault(require("crypto"));
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const server_1 = require("../server");
const sendEmail_1 = __importDefault(require("../services/sendEmail"));
const verifyEmail_1 = __importDefault(require("../services/templates/verifyEmail"));
const forgotPassword_1 = __importDefault(require("../services/templates/forgotPassword"));
const generateJwt_1 = __importDefault(require("../helpers/generateJwt"));
const generateRandomPassword_1 = __importDefault(require("../helpers/generateRandomPassword"));
const googleVerify_1 = __importDefault(require("../helpers/googleVerify"));
const capitalizeFirstLetter_1 = __importDefault(require("../helpers/capitalizeFirstLetter"));
const createUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { regName, regEmail, regPassword1 } = req.body;
        const conn = server_1.Server.connection;
        const [user] = yield conn.query(`SELECT * FROM usuarios where email = '${regEmail}'`);
        const [plantilla] = yield conn.query(`SELECT * FROM plantilla`);
        if (Array.isArray(user) && user.length > 0) {
            return res.status(400).json({
                ok: false,
                message: 'Sorry, a user with that email already exists in the database.',
            });
        }
        // encrypt password
        const salt = bcryptjs_1.default.genSaltSync(10);
        const encryptedPassword = bcryptjs_1.default.hashSync(regPassword1, salt);
        // encrypt email
        const hash = crypto_1.default.createHash('md5').update(regEmail).digest('hex');
        const newUser = {
            nombre: regName,
            password: encryptedPassword,
            email: regEmail,
            modo: 'directo',
            foto: '',
            verificacion: 1,
            emailEncriptado: hash,
        };
        yield conn.query('INSERT INTO usuarios SET ?', [newUser]);
        //send email verification
        const email = {
            from: process.env.DEFAULT_FROM_ADDRESS || '',
            to: regEmail,
            subject: 'Email verification',
            replyTo: process.env.DEFAULT_FROM_ADDRESS,
            htmlTemplate: verifyEmail_1.default,
            variables: {
                confirmLink: `${process.env.REACT_APP_URL}/verify/${hash}`,
                buttonColor: plantilla[0].colorTexto,
                buttonBackground: plantilla[0].colorFondo,
            },
        };
        const resp = yield (0, sendEmail_1.default)(email);
        if (!resp.ok) {
            return res.status(500).json(resp);
        }
        res.status(201).json({
            ok: true,
            name: regName,
            email: regEmail,
            modo: 'directo',
            foto: '',
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
exports.createUser = createUser;
const loginUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { logEmail, logPassword } = req.body;
    try {
        const conn = server_1.Server.connection;
        const [user] = yield conn.query(`SELECT * FROM usuarios where email = '${logEmail}'`);
        if (Array.isArray(user) && user.length === 0) {
            return res.status(400).json({
                ok: false,
                message: "Sorry, the email address that you've entered doesn't match any account.",
            });
        }
        const { id, nombre, password, email, foto, verificacion, modo } = user[0];
        if (modo !== 'directo') {
            return res.status(400).json({
                ok: false,
                message: `Sorry, the email address that you've entered was registered by ${(0, capitalizeFirstLetter_1.default)(modo)}.`,
            });
        }
        //confirm passwords
        const validPassword = bcryptjs_1.default.compareSync(logPassword, password);
        if (!validPassword) {
            return res.status(400).json({
                ok: false,
                message: 'Sorry, the password you entered for the user is incorrect.',
            });
        }
        if (verificacion) {
            return res.status(400).json({
                ok: false,
                message: 'Unverified email. Please check your email inbox or SPAM folder to verify the email address.',
            });
        }
        // generate JSON Web Token
        const token = yield (0, generateJwt_1.default)(id, nombre);
        res.json({
            ok: true,
            id,
            nombre,
            foto,
            modo,
            email,
            token,
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
exports.loginUser = loginUser;
const googleSignIn = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { tokenId } = req.body;
    try {
        const { name, picture, email } = yield (0, googleVerify_1.default)(tokenId);
        const conn = server_1.Server.connection;
        const [user] = yield conn.query(`SELECT * FROM usuarios where email = '${email}'`);
        if (Array.isArray(user) && user.length === 0) {
            const newUser = {
                nombre: name,
                password: '',
                email,
                modo: 'google',
                foto: picture,
                verificacion: 0,
                emailEncriptado: '',
            };
            const resp = yield conn.query('INSERT INTO usuarios SET ?', [
                newUser,
            ]);
            const { insertId } = resp[0];
            // generate JSON Web Token
            const token = yield (0, generateJwt_1.default)(insertId, name);
            return res.status(200).json({
                ok: true,
                id: insertId,
                nombre: name,
                foto: picture,
                modo: 'google',
                email,
                token,
            });
        }
        const { id, modo } = user[0];
        if (modo !== 'google') {
            return res.status(400).json({
                ok: false,
                message: `Sorry, the Google account you select has been registered by email and password.`,
            });
        }
        const userData = { nombre: name, foto: picture };
        yield conn.query('UPDATE usuarios set ? WHERE id = ?', [userData, id]);
        // generate JSON Web Token
        const token = yield (0, generateJwt_1.default)(id, name);
        res.status(200).json({
            ok: true,
            id,
            nombre: name,
            foto: picture,
            modo: 'google',
            email,
            token,
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
exports.googleSignIn = googleSignIn;
const renewToken = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { uid = '', name = '' } = req;
    try {
        const conn = server_1.Server.connection;
        const [user] = yield conn.query(`SELECT * FROM usuarios where id = '${uid}'`);
        if (Array.isArray(user) && user.length === 0) {
            return res.status(400).json({
                ok: false,
                message: 'Sorry, the user does not exist in the database.',
            });
        }
        const { id, nombre, email, foto, modo } = user[0];
        // generate JSON Web Token
        const token = yield (0, generateJwt_1.default)(uid, name);
        res.json({
            ok: true,
            id,
            nombre,
            foto,
            modo,
            email,
            token,
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
exports.renewToken = renewToken;
const forgotPassword = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { fgpEmail } = req.body;
        const conn = server_1.Server.connection;
        const [user] = yield conn.query(`SELECT * FROM usuarios where email = '${fgpEmail}'`);
        const [plantilla] = yield conn.query(`SELECT * FROM plantilla`);
        if (Array.isArray(user) && user.length === 0) {
            return res.status(400).json({
                ok: false,
                message: 'Sorry, a user with that email does not exists in the database.',
            });
        }
        const uid = Array.isArray(user) && user[0].id;
        const newPassword = (0, generateRandomPassword_1.default)();
        // encrypt password
        const salt = bcryptjs_1.default.genSaltSync(10);
        const encryptedPassword = bcryptjs_1.default.hashSync(newPassword, salt);
        const userData = { password: encryptedPassword };
        yield conn.query('UPDATE usuarios set ? WHERE id = ?', [userData, uid]);
        //send email verification
        const email = {
            from: process.env.DEFAULT_FROM_ADDRESS || '',
            to: fgpEmail,
            subject: 'New password request',
            replyTo: process.env.DEFAULT_FROM_ADDRESS,
            htmlTemplate: forgotPassword_1.default,
            variables: {
                newPassword,
                confirmLink: process.env.REACT_APP_URL,
                buttonColor: plantilla[0].colorTexto,
                buttonBackground: plantilla[0].colorFondo,
            },
        };
        const resp = yield (0, sendEmail_1.default)(email);
        if (!resp.ok) {
            return res.status(500).json(resp);
        }
        res.status(200).json({
            ok: true,
            message: 'Password updated successfully.',
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
exports.forgotPassword = forgotPassword;
//# sourceMappingURL=auth.controller.js.map