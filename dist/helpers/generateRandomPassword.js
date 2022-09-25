"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const generateRandomPassword = () => {
    const alpha = 'abcdefghijklmnopqrstuvwxyz';
    const cAlpha = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    const num = '1234567890';
    const specials = '!@#$%^&*';
    const options = [alpha, alpha, alpha, cAlpha, cAlpha, cAlpha, num, num, num, specials];
    let opt, choose;
    let pass = '';
    for (let i = 0; i < 10; i++) {
        opt = Math.floor(Math.random() * options.length);
        choose = Math.floor(Math.random() * options[opt].length);
        pass = pass + options[opt][choose];
        options.splice(opt, 1);
    }
    return pass;
};
exports.default = generateRandomPassword;
//# sourceMappingURL=generateRandomPassword.js.map