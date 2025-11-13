const { succes, error } = require("../utils/handleResponse");
const User = require("../models/User");

/**
 * GET USERS
 */
const getUsers = async (req, res) => {
  try {
    const users = await User.findAll();
    succes(res, users, 200);
  } catch (err) {
    error(res, [err.message], 500);
  }
};

/**
 * GET USER by name
 */
const getUser = async (req, res) => {
  try {
    const { id } = req.params;
    const users = await User.findAll({
      where: { id }
    });

    if (users.length === 0) {
      return error(res, ["No existe el usuario"], 404);
    }

    succes(res, users, 200);
  } catch (err) {
    error(res, [err.message], 500);
  }
};

/*
 * POST USER
 */
const postUsers = async (req, res) => {
  try {
    console.log(req.body);
    const { first_name, last_name, email, password } = req.body;
    const newUser = await User.create({ first_name, last_name, email, password });
    succes(res, newUser, 201);
  } catch (err) {
    error(res, [err.message], 500);
  }
};

/**
 * DELETE USER
 */
const deleteUser = async (req, res) => {
  try {
    console.log("req.params:", req.params);
    const { id } = req.params;
    console.log("ID recibido:", id, typeof id);

    const where = { id: Number(id) }; // fuerza número
    console.log("where:", where);

    const deleted = await User.destroy({ where });

    if (deleted === 0) {
      return res.status(404).json({ error: true, message: "Usuario no encontrado" });
    }

    succes(res, { message: "Usuario eliminado correctamente" }, 200);
  } catch (err) {
    console.log("================");
    console.log(err);
    console.log("================");
    error(res, [err.message], 500);
  }
};


/**
 * UPDATED USER
 */
const updatedUser = async (req, res) => {
  const { id } = req.params;
  const {
    first_name,
    last_name,
    email,
    password
  } = req.body;

  try {
    const item = await User.findOne({ where: { id } });

    if (!item) {
      return res
        .status(404)
        .json({ code: -1, message: "No encontrado", data: {} });
    }

    // 🔥 Construimos solo los campos que sí queremos actualizar
    const updateData = {
      first_name,
      last_name,
      email
    };

    // 👉 Agregamos password solo si viene con contenido
    if (password && password.trim() !== "") {
      updateData.password = password;
    }

    await User.update(updateData, { where: { id }, individualHooks: true });

    const updatedService = await User.findByPk(id);

    return res.status(200).json({
      code: 1,
      message: "Success",
      data: updatedService
    });

  } catch (error) {
    if (error.name === "SequelizeValidationError") {
      return res
        .status(400)
        .json({ code: -1, message: "Validation Error", errors: error.errors });
    } else {
      console.error("Error updating data: ", error);
      return res
        .status(500)
        .json({ code: -1, message: "Internal Server Error", data: {} });
    }
  }
};




module.exports = {
  getUsers,
  postUsers,
  getUser,
  deleteUser,
  updatedUser
};
