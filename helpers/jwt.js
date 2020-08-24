const jwt = require('jsonwebtoken');

const generarJWT = (id) => {

    return new Promise((res, rej) => {
        const payload = {
            id
        };

        jwt.sign(payload, process.env.JWT_SECRET, {
            expiresIn: '12h'
        },
            (err, token) => {
                if (err) {
                    console.log(err);
                    rej('No se pudo generar el JWT');
                }

                res(token);
            })
    })
}

module.exports = {
    generarJWT
}