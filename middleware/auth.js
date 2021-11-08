const jwt = require('jsonwebtoken');

async function auth(req, res, next){
    try {
        const token = req.header('Token');
        jwt.verify(token, process.env.CLAVE_SECRETA);
        next();
    } catch (error) {
        res.status(401).send({error: error.message});
    }
}

module.exports = auth;