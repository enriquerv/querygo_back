const User = require("../models/User");
const { succes, error } = require("../utils/handleResponse");

const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ where: { email } });
    if (!user) return error(res, ["Usuario no encontrado"], 404);

    const valid = await user.validPassword(password);
    if (!valid) return error(res, ["Contraseña incorrecta"], 401);

    // Aquí luego puedes generar un JWT
    succes(res, { message: "Login exitoso", user }, 200);
  } catch (err) {
    error(res, [err.message], 500);
  }
};

module.exports = { loginUser };
