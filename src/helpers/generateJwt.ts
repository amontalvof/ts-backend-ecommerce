import jwt from 'jsonwebtoken';

const generateJWT = (name: string, hash: string) => {
    return new Promise((resolve, reject) => {
        const payload = { id: hash, name };
        const seed = process.env.SECRET_JWT_SEED || '';
        jwt.sign(
            payload,
            seed,
            {
                expiresIn: '2h',
            },
            (err, token) => {
                if (err) {
                    console.log(err);
                    reject('The token could not be generated.');
                }
                resolve(token);
            }
        );
    });
};

export default generateJWT;
