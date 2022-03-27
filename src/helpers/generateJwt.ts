import jwt from 'jsonwebtoken';

const generateJWT = (uid: string, name: string) => {
    return new Promise((resolve, reject) => {
        const payload = { uid, name };
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
