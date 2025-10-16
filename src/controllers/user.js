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

/**
 * POST USER
 */
const postUsers = async (req, res) => {
  try {
    console.log(req.body);
    const { first_name, last_name, email, password  } = req.body;
    const newUser = await User.create({ first_name, last_name, email, password });
    succes(res, newUser, 201);
  } catch (err) {
    error(res, [err.message], 500);
  }
};

module.exports = {
  getUsers,
  postUsers,
  getUser,
};
