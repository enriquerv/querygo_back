const jwt = require("jsonwebtoken");

const tokenSign = async (email) => {
    const sign = await jwt.sign(
        {
            email:email
        },
        "240c59f46b55327400f95d224665db70"
    );

    return sign;

}

const verifyToken = async (tokenJWT) => {
    try {
        return jwt.verify(tokenJWT, "240c59f46b55327400f95d224665db70" );
    } catch(error) {
        return null;
    }
}

module.exports = { tokenSign, verifyToken };