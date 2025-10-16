const { verifyToken } = require("../utils/handleJwt");
const { succes, error } = require("../utils/handleResponse");

const authMiddleware = async (req, res, next) => {
    try {

        if(!req.headers.authorization){
            error(res, "token error", 401)
            return
        }

        const token = req.headers.authorization.split(' ').pop();
        const dataToken = await verifyToken(token)
        if(!dataToken.email){
            error(res, "Unauthorized", 401);
            return
        }

        next();

        
    } catch (error) {
        error(res, "Unauthorized", 401);
    }
}

const PublicAuthMiddleware = async (req, res, next) => {
    try {
        const expectedString = "2DXrS3qdfviWURejnXxGWFtWujwbTHaUXD2ZGNTB44dY2mRB4RUMtkT3nRi0gXPn0qhiBp544Sevkp8YTT0gaeMQ4wTS3X0pqjae"// Reemplaza esto con tu string secreto

        if (!req.headers.authorization) {
            error(res, "Unauthorized", 401);
            return;
        }

        const providedString = req.headers.authorization;

        if (providedString !== expectedString) {
            error(res, "Unauthorized", 401);
            return;
        }

        next();

    } catch (error) {
        error(res, "Unauthorized", 401);
    }
};

module.exports = {authMiddleware, PublicAuthMiddleware}